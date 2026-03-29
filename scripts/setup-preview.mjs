import { execSync } from "child_process";
import { existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const previewDir = path.join(__dirname, "..", "preview");

console.log("[v0] Setting up preview app in:", previewDir);

if (!existsSync(path.join(previewDir, "node_modules"))) {
  console.log("[v0] Installing dependencies...");
  execSync("npm install", { cwd: previewDir, stdio: "inherit" });
  console.log("[v0] Dependencies installed.");
} else {
  console.log("[v0] node_modules already exists, skipping install.");
}
