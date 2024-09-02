import { defineConfig } from "vite";

export default defineConfig({
  server: {
    port: 3000,
  },
  build: {
    outDir: "dist",
  },
  build: {
    target: "esnext", // Ensures that modern JS features like top-level await are supported
  },
  esbuild: {
    target: "esnext",
  },
});
