// Configuration
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const INITIAL_SHAPE_RATE = 1; // shapes per second
let shapeRate = INITIAL_SHAPE_RATE;
let gravity = 1;

// Create the application

const app = new PIXI.Application();
await app.init({
  width: CANVAS_WIDTH,
  height: CANVAS_HEIGHT,
  backgroundColor: 0x1099bb,
  view: document.getElementById("canvas"),
});
document.getElementById("container").appendChild(app.view); // Append the canvas to the DOM

// Create the stage
const stage = app.stage;

// Shape data
const shapes = [];

// Shape creation
function createShape(x, y) {
  const graphics = new PIXI.Graphics();
  const shapeType = Math.floor(Math.random() * 5);
  const color = Math.floor(Math.random() * 0xffffff); // Random integer color

  graphics.beginFill(color);

  switch (shapeType) {
    case 0:
      graphics.moveTo(0, 50); // Start at bottom-left
      graphics.lineTo(50, 50); // Bottom-right
      graphics.lineTo(25, 0); // Top-center
      graphics.lineTo(0, 50); // Close path
      break;
    case 1:
      graphics.drawRect(0, 0, 50, 50);
      break;
    case 2:
      graphics.drawCircle(25, 25, 25);
      break;
    case 3:
      graphics.drawEllipse(25, 25, 25, 15);
      break;
    case 4:
      graphics.drawStar(25, 25, 5, 25, 10);
      break;
  }

  graphics.endFill();

  graphics.x = x;
  graphics.y = y;
  graphics.interactive = true;
  graphics.buttonMode = true;

  graphics.on("pointerup", (e) => {
    e.stopPropagation(); // Prevent bubbling up to the canvas click handler
    stage.removeChild(graphics);
    shapes.splice(shapes.indexOf(graphics), 1);
    updateStats();
  });

  return graphics;
}

// Shape falling logic
function updateShapes() {
  for (const shape of shapes) {
    shape.y += gravity;
    if (shape.y > CANVAS_HEIGHT) {
      stage.removeChild(shape);
      shapes.splice(shapes.indexOf(shape), 1);
    }
  }
  updateStats();
}

// Generate shapes at intervals
let shapeGenerationInterval = setInterval(() => {
  const x = Math.random() * CANVAS_WIDTH;
  const y = -50;
  const shape = createShape(x, y);
  stage.addChild(shape);
  shapes.push(shape);
}, 1000 / shapeRate);

// Update stats
function updateStats() {
  const count = shapes.length;
  let totalArea = 0;
  for (const shape of shapes) {
    totalArea += getShapeArea(shape);
  }

  document.getElementById("shape-count").innerText = `Shapes: ${count}`;
  document.getElementById("shape-area").innerText = `Area: ${totalArea.toFixed(
    2
  )} px²`;
}

// Calculate the area of a shape
function getShapeArea(shape) {
  const bounds = shape.getBounds();
  const width = bounds.width;
  const height = bounds.height;
  return width * height;
}

// Handle clicks on the canvas
app.view.addEventListener("click", (event) => {
  // Get the click position relative to the canvas
  const rect = app.view.getBoundingClientRect();
  const clickX = event.clientX - rect.left; // Convert to canvas space
  const clickY = event.clientY - rect.top; // Convert to canvas space

  console.log(`Canvas Click Position: X = ${clickX}, Y = ${clickY}`);

  let shapeClicked = false;
  let clickedShape = null;
  // Loop over shapes to detect if a shape is clicked
  for (const shape of shapes) {
    // Convert the shape's bounds to the local coordinate system of the canvas
    const bounds = shape.getBounds();

    // Calculate the shape's start and end positions
    const shapeXStart = bounds.x;
    const shapeXEnd = bounds.x + bounds.width;
    const shapeYStart = bounds.y;
    const shapeYEnd = bounds.y + bounds.height;
    console.log("-------------");
    console.log("clickX" + clickX);
    console.log("clickY" + clickY);
    console.log("shapeXStart" + shapeXStart);
    console.log("shapeXEnd" + shapeXEnd);
    console.log("shapeYStart" + shapeYStart);
    console.log("shapeYEnd" + shapeYEnd);
    console.log(
      clickX >= shapeXStart &&
        clickX <= shapeXEnd &&
        clickY >= shapeYStart &&
        clickY <= shapeYEnd
    );
    // Log the calculated coordinates for debugging
    debugger;
    // Check if the click is within the shape's boundaries
    if (
      clickX >= shapeXStart &&
      clickX <= shapeXEnd &&
      clickY >= shapeYStart &&
      clickY <= shapeYEnd
    ) {
      shapeClicked = true;
      console.log("Shape clicked!");
      clickedShape = shape; // Store the clicked shape
      // Remove the clicked shape
      stage.removeChild(shape);
      shapes.splice(shapes.indexOf(shape), 1);
      updateStats();
      break; // Exit the loop as we only want to delete one shape
    }
  }

  // If no shape was clicked, create a weird shape at the click position
  if (!shapeClicked) {
    debugger;
    console.log("No shape clicked. Creating a new weird shape.");
    const newShape = createWeirdShape(clickX, clickY);
    stage.addChild(newShape);
    shapes.push(newShape);
    updateStats();
  } else {
    console.log("Shape was clicked. No new shape created.");
  }
});

// Function to create a random weird shape
function createWeirdShape(x, y) {
  const graphics = new PIXI.Graphics();
  const color = Math.floor(Math.random() * 0xffffff); // Random color
  graphics.beginFill(color);

  const vertices = [];
  const numPoints = Math.floor(Math.random() * 5) + 3; // 3 to 7 points

  for (let i = 0; i < numPoints; i++) {
    const angle = (Math.PI * 2 * i) / numPoints;
    const radius = Math.random() * 30 + 20; // Random radius between 20 and 50
    const px = Math.cos(angle) * radius;
    const py = Math.sin(angle) * radius;
    vertices.push(px, py);
  }

  graphics.drawPolygon(vertices);
  graphics.endFill();

  graphics.x = x;
  graphics.y = y;
  graphics.interactive = true;
  graphics.buttonMode = true;

  graphics.on("pointerup", (event) => {
    event.stopPropagation(); // Prevent the click from propagating to the canvas
    stage.removeChild(graphics);
    shapes.splice(shapes.indexOf(graphics), 1);
    updateStats();
  });

  return graphics;
}

// Handle controls
document.getElementById("increase-rate").addEventListener("click", () => {
  clearInterval(shapeGenerationInterval);
  shapeRate++;
  shapeGenerationInterval = setInterval(() => {
    const x = Math.random() * CANVAS_WIDTH;
    const y = -50;
    const shape = createShape(x, y);
    stage.addChild(shape);
    shapes.push(shape);
  }, 1000 / shapeRate);
  updateStats();
});

document.getElementById("decrease-rate").addEventListener("click", () => {
  if (shapeRate > 1) {
    clearInterval(shapeGenerationInterval);
    shapeRate--;
    shapeGenerationInterval = setInterval(() => {
      const x = Math.random() * CANVAS_WIDTH;
      const y = -50;
      const shape = createShape(x, y);
      stage.addChild(shape);
      shapes.push(shape);
    }, 1000 / shapeRate);
    updateStats();
  }
});

document.getElementById("increase-gravity").addEventListener("click", () => {
  gravity += 0.5;
  updateStats();
});

document.getElementById("decrease-gravity").addEventListener("click", () => {
  if (gravity > 0.5) {
    gravity -= 0.5;
    updateStats();
  }
});

// Main update loop
app.ticker.add(() => {
  updateShapes();
});
