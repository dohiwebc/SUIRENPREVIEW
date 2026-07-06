import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

/** .env 未設定時に js/config.js から microCMS 接続情報を補完（CI 用） */
export function applyMicroCMSEnvFromConfig() {
  const currentDomain = String(process.env.MICROCMS_SERVICE_DOMAIN || "").trim();
  const currentKey = String(process.env.MICROCMS_API_KEY || "").trim();
  if (currentDomain && currentKey) {
    return;
  }

  const configPath = join(root, "js", "config.js");
  if (!existsSync(configPath)) return;

  const source = readFileSync(configPath, "utf8");
  const domain = source.match(/SERVICE_DOMAIN:\s*"([^"]*)"/)?.[1]?.trim();
  const apiKey = source.match(/API_KEY:\s*"([^"]*)"/)?.[1]?.trim();

  if (domain && !currentDomain) {
    process.env.MICROCMS_SERVICE_DOMAIN = domain;
  }
  if (apiKey && !currentKey) {
    process.env.MICROCMS_API_KEY = apiKey;
  }
}
