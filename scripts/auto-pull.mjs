// Auto-pull Obsidian submodule every 5 minutes during development
import { execSync } from "child_process";

const INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

console.log("[content-sync] Started. Will pull latest Obsidian content every 5 minutes.");

async function pull() {
  const now = new Date().toLocaleTimeString();
  try {
    const output = execSync("git submodule update --remote --merge content", {
      cwd: process.cwd(),
      encoding: "utf8",
    });
    if (output.trim()) {
      console.log(`[content-sync] ${now} - Updated:\n${output.trim().split("\n").slice(-3).join("\n")}`);
    } else {
      console.log(`[content-sync] ${now} - Already up to date.`);
    }
  } catch (err) {
    // Git pull may have warnings/errors that are non-fatal
    if (err.stdout) {
      console.log(`[content-sync] ${now} - ${err.stdout.trim().split("\n").slice(-3).join("\n")}`);
    }
  }
}

// Initial pull
pull();

// Periodic pull
setInterval(pull, INTERVAL_MS);

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("[content-sync] Stopping...");
  process.exit(0);
});
