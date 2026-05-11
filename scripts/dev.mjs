import { spawn } from "node:child_process";
import path from "node:path";
import process from "node:process";

const cwd = process.cwd();
const node = process.execPath;

function run(name, args) {
  const child = spawn(node, args, {
    cwd,
    stdio: "inherit",
    windowsHide: true,
  });

  child.on("exit", (code, signal) => {
    if (signal) {
      console.log(`${name} exited with signal ${signal}`);
      process.exit(1);
    }
    if (code && code !== 0) {
      process.exit(code);
    }
  });

  return child;
}

const tailwind = run("tailwindcss", [
  path.join("node_modules", "tailwindcss", "lib", "cli.js"),
  "-i",
  path.join("app", "globals.css"),
  "-o",
  path.join("public", "site.css"),
  "--watch",
  "--config",
  "tailwind.config.ts",
]);

const next = run("next", [
  path.join("node_modules", "next", "dist", "bin", "next"),
  "dev",
  ...process.argv.slice(2),
]);

const shutdown = () => {
  for (const child of [tailwind, next]) {
    if (!child.killed) {
      child.kill();
    }
  }
};

process.on("SIGINT", () => {
  shutdown();
  process.exit(0);
});

process.on("SIGTERM", () => {
  shutdown();
  process.exit(0);
});
