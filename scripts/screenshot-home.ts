// One-off verification script: screenshots the homepage immediately after
// a hard refresh (minimal wait) to confirm the code background appears on
// the very first frame, using the system's already-installed Chrome
// (Playwright's own bundled Chromium can't be downloaded from this network).
import { chromium } from "playwright";

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const BASE = process.argv[2] ?? "http://localhost:4100";

async function shot(width: number, height: number, filename: string, waitMs: number) {
  const browser = await chromium.launch({ executablePath: CHROME_PATH });
  const page = await browser.newPage({ viewport: { width, height } });
  await page.goto(BASE + "/", { waitUntil: "load" });
  await page.waitForTimeout(waitMs);
  await page.screenshot({ path: filename, fullPage: false });
  await browser.close();
  console.log(`saved ${filename} (waited ${waitMs}ms)`);
}

async function main() {
  // Near-zero wait: this is the "very first frame" check.
  await shot(1440, 900, "screenshot-instant-1440.png", 150);
  await shot(390, 844, "screenshot-instant-390.png", 150);
}

main();
