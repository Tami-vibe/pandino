#!/usr/bin/env node
import { mkdirSync } from "node:fs";
import { chromium } from "playwright";

const TIMEOUT = 30_000;
const DEFAULTS = ["header", "#hero", "#services", "#solutions", "#reviews", "#quote", "#faq", "footer"];
const VIEWS = [
  [1440, 900],
  [390, 844],
];

const [url, outDir, ...picked] = process.argv.slice(2);
if (!url || !outDir) {
  console.error("Usage: node scripts/shots.mjs <url> <out-dir> [selectors...]");
  process.exit(1);
}
const parsed = new URL(url);
if (!/^https?:$/.test(parsed.protocol) || parsed.username || parsed.password) {
  console.error("URL must be http(s) without credentials");
  process.exit(1);
}

const selectors = picked.length ? picked : DEFAULTS;
mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  page.setDefaultTimeout(TIMEOUT);
  page.setDefaultNavigationTimeout(TIMEOUT);
  for (const [width, height] of VIEWS) {
    await page.setViewportSize({ width, height });
    await page.goto(url, { timeout: TIMEOUT, waitUntil: "domcontentloaded" });
    for (const selector of selectors) {
      await page.locator(selector).first().scrollIntoViewIfNeeded({ timeout: TIMEOUT });
      const slug = selector.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "") || "section";
      await page.screenshot({ path: `${outDir}/${slug}-${width}x${height}.png`, timeout: TIMEOUT });
    }
  }
} finally {
  await browser.close();
}
