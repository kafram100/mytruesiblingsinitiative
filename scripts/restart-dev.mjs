/**
 * Stop anything on port 3000, remove .next, then start dev (avoids stale middleware/chunk errors).
 */
import { spawn, execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const cwd = process.cwd();
const port = process.env.PORT || "3003";

function killPort(portNum) {
  if (process.platform === "win32") {
    try {
      execSync(
        `powershell -NoProfile -Command "Get-NetTCPConnection -LocalPort ${portNum} -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique | ForEach-Object { Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue }"`,
        { stdio: "ignore" }
      );
    } catch {
      /* nothing listening */
    }
    return;
  }
  try {
    execSync(`lsof -ti:${portNum} | xargs kill -9 2>/dev/null`, {
      stdio: "ignore",
      shell: true,
    });
  } catch {
    /* nothing listening */
  }
}

function removeNextDir() {
  const nextDir = path.join(cwd, ".next");
  if (fs.existsSync(nextDir)) {
    fs.rmSync(nextDir, { recursive: true, force: true });
    console.log("Removed .next");
  }
}

killPort(Number(port));
removeNextDir();

const node = process.execPath;
const dev = spawn(node, [path.join("scripts", "dev.mjs"), ...process.argv.slice(2)], {
  cwd,
  stdio: "inherit",
  windowsHide: true,
});

dev.on("exit", (code, signal) => {
  if (signal) process.exit(1);
  process.exit(code ?? 0);
});

process.on("SIGINT", () => dev.kill("SIGINT"));
process.on("SIGTERM", () => dev.kill("SIGTERM"));
