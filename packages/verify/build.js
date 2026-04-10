import { cpSync, mkdirSync } from "fs";

// Simple build: copy src to dist (no transpilation needed for ESM)
mkdirSync("dist", { recursive: true });
cpSync("src/index.js", "dist/index.js");
cpSync("src/middleware.js", "dist/middleware.js");

console.log("Build complete: dist/index.js, dist/middleware.js");
