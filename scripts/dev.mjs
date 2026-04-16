import { spawn } from "node:child_process";
import path from "node:path";

const projectRoot = process.cwd();

// 1. Start the Sync Watcher
console.log("Starting Sync Watcher...");
const syncWatcher = spawn("node", ["scripts/sync-md-to-pages.mjs", "--watch"], {
  stdio: "inherit",
  shell: true
});

// 2. Start Next.js
console.log("Starting Next.js Dev Server...");
const nextDev = spawn("npx", ["next", "dev"], {
  stdio: "inherit",
  shell: true
});

process.on("SIGINT", () => {
  syncWatcher.kill();
  nextDev.kill();
  process.exit();
});
