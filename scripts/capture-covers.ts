// Captures real cover screenshots of live products for /public/projects/<slug>/cover.webp.
// Run with: node scripts/capture-covers.ts
//
// Projects with no public URL are intentionally left alone — their card
// falls back to the designed monochrome cover (see ProjectCover component)
// rather than a fabricated or stock image.

import { chromium } from "playwright";
import path from "node:path";
import fs from "node:fs";

const targets: { slug: string; url: string; fullPage?: boolean }[] = [
  { slug: "allama", url: "https://allama-theta.vercel.app" },
  { slug: "studysphere", url: "https://studysphere.it.com" },
  { slug: "tijalabs-site", url: "https://tijalabs.com" },
  {
    slug: "leveragex",
    url: "https://play.google.com/store/apps/details?id=com.leveragex.leveragex",
  },
];

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  for (const target of targets) {
    const dir = path.join(process.cwd(), "public", "projects", target.slug);
    fs.mkdirSync(dir, { recursive: true });
    const dest = path.join(dir, "cover.webp");

    try {
      console.log(`Capturing ${target.slug} <- ${target.url}`);
      await page.goto(target.url, { waitUntil: "networkidle", timeout: 30000 });
      // Let hero animations/fonts settle before capturing.
      await page.waitForTimeout(1000);
      await page.screenshot({ path: dest, type: "webp", quality: 85 });
      console.log(`  saved ${dest}`);
    } catch (err) {
      console.error(`  FAILED ${target.slug}: ${(err as Error).message}`);
    }
  }

  await browser.close();
}

main();
