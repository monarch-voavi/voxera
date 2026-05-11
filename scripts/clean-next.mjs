import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, "..");
const nextDir = path.join(projectRoot, ".next");

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function removeWithRetries() {
  if (!fs.existsSync(nextDir)) {
    console.log("[clean-next] Каталогу .next немає — пропускаю.");
    return;
  }

  const opts = { recursive: true, force: true };
  for (let attempt = 1; attempt <= 8; attempt++) {
    try {
      fs.rmSync(nextDir, opts);
      console.log("[clean-next] Каталог .next видалено.");
      return;
    } catch (err) {
      const code = err && typeof err === "object" && "code" in err ? err.code : "";
      console.warn(`[clean-next] Спроба ${attempt}/8 не вдалась (${String(code)}): ${err instanceof Error ? err.message : err}`);
      if (attempt === 8) throw err;
      await sleep(350 * attempt);
    }
  }
}

await removeWithRetries();
