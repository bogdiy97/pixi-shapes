// Factory Pattern for Shape Creation
class ShapeFactory {
  // Static method to create shapes based on type and position
  static createShape(type, x, y) {
    // Create a new PIXI.Graphics object to draw the shape
    const graphics = new PIXI.Graphics();
    // Generate a random color for the shape
    const color = Math.floor(Math.random() * 0xffffff);
    graphics.beginFill(color); // Start filling the shape with the color

    let shapeWidth = 50; // Default width of shapes
    let shapeHeight = 50; // Default height of shapes

    // Switch case to draw the shape based on the type
    switch (type) {
      case "Triangle":
        // Draw an equilateral triangle
        graphics.drawPolygon([0, 50, 25, 0, 50, 50]);
        break;
      case "Square":
        // Draw a square with side length of 50
        graphics.drawRect(0, 0, 50, 50);
        break;
      case "Pentagon":
        // Draw a pentagon using generated points
        graphics.drawPolygon(ShapeFactory.generatePolygonPoints(25, 25, 5, 25));
        break;
      case "Hexagon":
        // Draw a hexagon using generated points
        graphics.drawPolygon(ShapeFactory.generatePolygonPoints(25, 25, 6, 25));
        break;
      case "Circle":
        // Draw a circle with radius 25
        graphics.drawCircle(25, 25, 25);
        break;
      case "Ellipse":
        // Draw an ellipse with radius x 25 and y 15
        graphics.drawEllipse(25, 25, 25, 15);
        shapeHeight = 30; // Ellipse height is different
        break;
      case "Star":
        // Draw a star with 5 points
        graphics.drawStar(25, 25, 5, 25, 10);
        break;
    }

    graphics.endFill(); // End filling the shape

    // Adjust the position to center the shape on the click coordinates
    graphics.x = x - shapeWidth / 2;
    graphics.y = y - shapeHeight / 2;
    graphics.interactive = true; // Make the shape interactive
    graphics.buttonMode = true; // Change cursor to pointer when hovering

    return graphics; // Return the created shape
  }

  // Static method to generate points for regular polygons
  static generatePolygonPoints(centerX, centerY, sides, radius) {
    const points = []; // Array to store the points of the polygon
    // Loop to calculate the points based on the number of sides
    for (let i = 0; i < sides; i++) {
      const angle = (Math.PI * 2 * i) / sides; // Calculate angle for each vertex
      const x = centerX + Math.cos(angle) * radius; // X coordinate of the vertex
      const y = centerY + Math.sin(angle) * radius; // Y coordinate of the vertex
      points.push(x, y); // Add the point to the array
    }
    return points; // Return the array of points
  }
}

// Strategy Pattern for Movement
class MovementStrategy {
  // Method to move the shape based on gravity
  move(shape, gravity) {
    shape.y += gravity; // Move the shape down by the gravity amount
  }
}

// ShapeManager class to manage shapes
class ShapeManager {
  constructor(stage, canvasWidth, canvasHeight, movementStrategy, view) {
    this.stage = stage; // PIXI stage where shapes are drawn
    this.view = view;
    this.canvasWidth = canvasWidth; // Width of the canvas
    this.canvasHeight = canvasHeight; // Height of the canvas
    this.shapes = []; // Array to store shapes
    this.gravity = 1; // Default gravity
    this.shapeRate = 2; // Shape generation rate (shapes per second)
    this.shapeGenerationInterval = null; // Interval for shape generation
    this.movementStrategy = movementStrategy; // Strategy for moving shapes
    this.shapeClicked = false;
    // Bind methods to ensure proper context
    this.createShape = this.createShape.bind(this);
    this.createWeirdShape = this.createWeirdShape.bind(this);
    this.updateShapes = this.updateShapes.bind(this);
    this.updateStats = this.updateStats.bind(this);
    this.updateShapeGenerationInterval =
      this.updateShapeGenerationInterval.bind(this);
    this.generateShape = this.generateShape.bind(this);
    this.handleCanvasClick = this.handleCanvasClick.bind(this); // Bind the method

    // Initialize shape generation interval
    this.updateShapeGenerationInterval(this.shapeRate);

    // Add a resize event listener
    window.addEventListener("resize", this.handleResize.bind(this));
  }

  // Method to handle canvas resizing
  handleResize() {
    this.canvasWidth = window.innerWidth;
    this.canvasHeight = window.innerHeight;
    this.stage.width = this.canvasWidth;
    this.stage.height = this.canvasHeight;
    this.updateStats(); // Update stats after resize
  }

  // Method to create a random shape at (x, y)
  createShape(x, y) {
    // Array of possible shape types
    const shapeType = [
      "Triangle",
      "Square",
      "Pentagon",
      "Hexagon",
      "Circle",
      "Ellipse",
      "Star",
    ][Math.floor(Math.random() * 7)]; // Randomly select a shape type

    // Create the shape using ShapeFactory
    const shape = ShapeFactory.createShape(shapeType, x, y);

    // Add shape to the stage and the shapes array
    this.stage.addChild(shape);
    this.shapes.push(shape);

    // Function to remove shape when clicked
    function removeClickedShape() {
      this.shapeClicked = true;
      this.stage.removeChild(shape); // Remove shape from the stage
      this.shapes.splice(this.shapes.indexOf(shape), 1); // Remove shape from the array
      this.updateStats(); // Update stats after removal
    }
    shape.addEventListener("click", removeClickedShape.bind(this));

    return shape; // Return the created shape
  }

  // Method to create a weird shape at (x, y)
  createWeirdShape(x, y) {
    const graphics = new PIXI.Graphics(); // Create new PIXI.Graphics object
    const color = Math.floor(Math.random() * 0xffffff); // Generate random color
    graphics.beginFill(color); // Begin filling the shape with the color

    const vertices = []; // Array to store the vertices of the shape
    const numPoints = Math.floor(Math.random() * 5) + 3; // Random number of points (3 to 7)

    // Loop to calculate the vertices
    for (let i = 0; i < numPoints; i++) {
      const angle = (Math.PI * 2 * i) / numPoints; // Calculate angle for each vertex
      const radius = Math.random() * 30 + 20; // Random radius
      const px = Math.cos(angle) * radius; // X coordinate of the vertex
      const py = Math.sin(angle) * radius; // Y coordinate of the vertex
      vertices.push(px, py); // Add vertex to the array
    }

    graphics.drawPolygon(vertices); // Draw the shape using vertices
    graphics.endFill(); // End filling the shape

    graphics.x = x; // Set x position
    graphics.y = y; // Set y position
    graphics.interactive = true; // Make the shape interactive
    graphics.buttonMode = true; // Change cursor to pointer when hovering
    // Function to remove shape when clicked
    function removeClickedShape() {
      this.shapeClicked = true;
      this.stage.removeChild(graphics); // Remove shape from the stage
      this.shapes.splice(this.shapes.indexOf(graphics), 1); // Remove shape from the array
      this.updateStats(); // Update stats after removal
    }
    graphics.addEventListener("click", removeClickedShape.bind(this));
    // Event listener to remove shape when clicked

    this.stage.addChild(graphics); // Add shape to the stage
    this.shapes.push(graphics); // Add shape to the shapes array
    return graphics; // Return the created shape
  }

  // Method to update shapes position and handle their removal
  updateShapes() {
    const shapesToRemove = []; // Array to store shapes marked for removal

    // Loop through each shape
    for (const shape of this.shapes) {
      this.movementStrategy.move(shape, this.gravity); // Move the shape based on the strategy

      // Check if the shape is fully off-screen
      if (shape.y > this.canvasHeight) {
        shapesToRemove.push(shape); // Mark shape for removal
      }
    }

    // Remove shapes that have exited the screen
    for (const shape of shapesToRemove) {
      this.stage.removeChild(shape); // Remove shape from the stage
      this.shapes.splice(this.shapes.indexOf(shape), 1); // Remove shape from the array
    }

    this.updateStats(); // Update stats
  }

  // Method to generate a new shape at a random position
  generateShape() {
    const x = Math.random() * this.canvasWidth; // Random x position
    const y = -50; // Start above the canvas
    this.createShape(x, y); // Create a new shape
  }

  // Method to update the shape generation rate
  updateShapeGenerationInterval(newRate) {
    if (this.shapeGenerationInterval) {
      clearInterval(this.shapeGenerationInterval); // Clear existing interval
    }
    this.shapeRate = newRate; // Update shape rate
    this.shapeGenerationInterval = setInterval(
      this.generateShape, // Function to generate a shape
      1000 / this.shapeRate // Interval in milliseconds
    );
  }

  // Method to update stats on the page
  updateStats() {
    const count = this.shapes.length; // Number of shapes
    let totalArea = 0; // Total area of all shapes

    // Loop through each shape to calculate total area
    for (const shape of this.shapes) {
      if (this.isShapeVisible(shape)) {
        totalArea += this.getShapeArea(shape); // Add shape's area to total
      }
    }

    // Update the shape count and total area on the page
    document.getElementById("shape-count").innerText = `Shapes: ${count}`;
    document.getElementById(
      "shape-area"
    ).innerText = `Area: ${totalArea.toFixed(2)} px²`;
  }

  // Method to check if a shape is visible on the canvas
  isShapeVisible(shape) {
    const bounds = shape.getBounds(); // Get the bounds of the shape
    return (
      bounds.x + bounds.width > 0 &&
      bounds.x < this.canvasWidth &&
      bounds.y + bounds.height > 0 &&
      bounds.y < this.canvasHeight
    );
  }

  // Method to calculate the area of a shape
  getShapeArea(shape) {
    const bounds = shape.getBounds(); // Get the bounds of the shape
    const width = bounds.width; // Width of the shape
    const height = bounds.height; // Height of the shape
    return width * height; // Return area (width * height)
  }

  // Method to handle canvas click events
  handleCanvasClick(event) {
    if (this.shapeClicked) {
      this.shapeClicked = false;
      return;
    }
    const rect = app.view.getBoundingClientRect(); // Get the bounding rectangle of the canvas
    const clickX = event.clientX - rect.left; // X coordinate of the click
    const clickY = event.clientY - rect.top; // Y coordinate of the click

    this.createWeirdShape(clickX, clickY); // Create weird shape
    this.updateStats(); // Update stats
  }
}

// Observer Pattern for UI Updates
class UIHandler {
  constructor(shapeManager) {
    this.shapeManager = shapeManager; // ShapeManager instance
    this.initializeEventListeners(); // Set up event listeners
  }

  // Initialize event listeners for UI controls
  initializeEventListeners() {
    // Event listener to increase shape generation rate
    document.getElementById("increase-rate").addEventListener("click", () => {
      const newRate = this.shapeManager.shapeRate + 1; // Increase rate
      this.shapeManager.updateShapeGenerationInterval(newRate); // Update interval
      this.shapeManager.updateStats(); // Update stats
    });

    // Event listener to decrease shape generation rate
    document.getElementById("decrease-rate").addEventListener("click", () => {
      if (this.shapeManager.shapeRate > 1) {
        const newRate = this.shapeManager.shapeRate - 1; // Decrease rate
        this.shapeManager.updateShapeGenerationInterval(newRate); // Update interval
        this.shapeManager.updateStats(); // Update stats
      }
    });

    // Event listener to increase gravity
    document
      .getElementById("increase-gravity")
      .addEventListener("click", () => {
        this.shapeManager.gravity += 0.5; // Increase gravity
        this.shapeManager.updateStats(); // Update stats
      });

    // Event listener to decrease gravity
    document
      .getElementById("decrease-gravity")
      .addEventListener("click", () => {
        if (this.shapeManager.gravity > 0.5) {
          this.shapeManager.gravity -= 0.5; // Decrease gravity
          this.shapeManager.updateStats(); // Update stats
        }
      });

    // Event listener for clicks on the canvas
    app.view.addEventListener("click", this.shapeManager.handleCanvasClick);

    // Ensure shape clicks are handled separately
    this.shapeManager.stage.interactive = true;

    // this.shapeManager.stage.addEventListener(
    //   "click",
    //   function () {
    //     console.log(arguments);
    //   },
    //   {
    //     capture: false,
    //   }
    // );
    // this.shapeManager.stage.on("pointerdown", (event) => {
    //   debugger;
    //   if (event.target instanceof PIXI.Graphics) {
    //     // Shape was clicked
    //     event.target.emit("pointerdown", event); // Trigger the pointerdown event
    //   }
    // });
  }
}

// Usage
const CANVAS_WIDTH = window.innerWidth; // Get canvas width
const CANVAS_HEIGHT = window.innerHeight; // Get canvas height

const app = new PIXI.Application(); // Create PIXI application
await app.init({
  width: CANVAS_WIDTH, // Set canvas width
  height: CANVAS_HEIGHT, // Set canvas height
  backgroundColor: 0x1099bb, // Set background color
  resizeTo: window, // Resize canvas with window
  view: document.getElementById("canvas"), // Get the canvas element
});
document.getElementById("container").appendChild(app.view); // Append canvas to container

// Function to resize the canvas
function resizeCanvas() {
  app.renderer.resize(window.innerWidth, window.innerHeight); // Resize renderer
}

// Event listener to resize canvas on window resize
window.addEventListener("resize", resizeCanvas);
resizeCanvas(); // Initial canvas resize

const movementStrategy = new MovementStrategy(); // Create movement strategy instance
const shapeManager = new ShapeManager(
  app.stage, // PIXI stage
  CANVAS_WIDTH, // Canvas width
  CANVAS_HEIGHT, // Canvas height
  movementStrategy, // Movement strategy instance
  app.view
);
new UIHandler(shapeManager); // Create UIHandler instance

// Add the updateShapes method to the PIXI ticker
app.ticker.add(() => {
  shapeManager.updateShapes(); // Update shapes on each frame
});
