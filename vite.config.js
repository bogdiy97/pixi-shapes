import { defineConfig } from "vite";

export default defineConfig({
  server: {
    port: 3000,
  },
  build: {
    outDir: "dist",
  },
  esbuild: {
    target: "es2019", // or 'chrome89', 'firefox85', etc.
  },
});
