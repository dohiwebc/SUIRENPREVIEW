import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

/** .env 未設定時に js/config.js から microCMS 接続情報を補完（CI 用） */
export function applyMicroCMSEnvFromConfig() {
  if (process.env.MICROCMS_SERVICE_DOMAIN && process.env.MICROCMS_API_KEY) {
    return;
  }

  const configPath = join(root, "js", "config.js");
  if (!existsSync(configPath)) return;

  const source = readFileSync(configPath, "utf8");
  const domain = source.match(/SERVICE_DOMAIN:\s*"([^"]*)"/)?.[1]?.trim();
  const apiKey = source.match(/API_KEY:\s*"([^"]*)"/)?.[1]?.trim();

  if (domain && !process.env.MICROCMS_SERVICE_DOMAIN) {
    process.env.MICROCMS_SERVICE_DOMAIN = domain;
  }
  if (apiKey && !process.env.MICROCMS_API_KEY) {
    process.env.MICROCMS_API_KEY = apiKey;
  }
}
