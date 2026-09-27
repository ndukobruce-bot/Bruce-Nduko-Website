import fs from "node:fs";
import path from "node:path";

export function fileExistsInPublic(relativePath: string): boolean {
  try {
    return fs.existsSync(path.join(process.cwd(), "public", relativePath));
  } catch {
    return false;
  }
}

const exts = new Set([".png", ".jpg", ".jpeg", ".webp", ".avif"]);
const coverExts = [".png", ".jpg", ".jpeg", ".webp"];

// Looks for /public/projects/<slug>/*.{png,jpg,...} at build time, excluding
// the dedicated cover.* file (that has its own getter below). Returns an
// empty array (never a guess) when nothing's there yet — the UI hides the
// gallery entirely rather than show a placeholder.
export function getProjectScreenshots(slug: string): string[] {
  const dir = path.join(process.cwd(), "public", "projects", slug);
  try {
    if (!fs.existsSync(dir)) return [];
    return fs
      .readdirSync(dir)
      .filter((f) => exts.has(path.extname(f).toLowerCase()) && !f.startsWith("cover."))
      .sort()
      .map((f) => `/projects/${slug}/${f}`);
  } catch {
    return [];
  }
}

// A dedicated cover.(png|jpg|jpeg|webp) file, if present — distinct from
// the screenshot gallery. Used for card/case-study cover art. Never falls
// back to a random screenshot: a mismatched-aspect screenshot forced into
// the fixed cover slot looks worse than the designed monochrome fallback.
export function getProjectCover(slug: string): string | undefined {
  const dir = path.join(process.cwd(), "public", "projects", slug);
  try {
    if (!fs.existsSync(dir)) return undefined;
    for (const ext of coverExts) {
      if (fs.existsSync(path.join(dir, `cover${ext}`))) {
        return `/projects/${slug}/cover${ext}`;
      }
    }
    return undefined;
  } catch {
    return undefined;
  }
}

export function getProjectCovers(slugs: string[]): Record<string, string | undefined> {
  return Object.fromEntries(slugs.map((slug) => [slug, getProjectCover(slug)]));
}

// Resolves a certificate PDF path (e.g. "/certificates/foo.pdf") only if the
// file actually exists in /public — never links to a certificate that
// hasn't been uploaded yet.
export function getCertificatePdf(relativePath: string | null | undefined): string | undefined {
  if (!relativePath) return undefined;
  return fileExistsInPublic(relativePath.replace(/^\//, "")) ? relativePath : undefined;
}
