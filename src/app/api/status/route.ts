import { NextResponse } from "next/server";
import { liveCheckTargets } from "@/content/projects";

export const revalidate = 300; // 5 minutes

async function checkUrl(url: string): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);
    // Some hosts (e.g. Google Play) reject HEAD — GET with no-cache is more
    // reliable, and we only care whether it resolves, not the body.
    const res = await fetch(url, {
      method: "GET",
      redirect: "follow",
      signal: controller.signal,
      next: { revalidate: 300 },
    });
    clearTimeout(timeout);
    return res.ok;
  } catch {
    return false;
  }
}

export async function GET() {
  const entries = await Promise.all(
    liveCheckTargets.map(async (t) => {
      const ok = await checkUrl(t.url);
      // Per spec: never surface "down" to visitors on a failed check —
      // only "live" (confirmed reachable) or "checking" (unconfirmed).
      return [t.slug, ok ? "live" : "checking"] as const;
    })
  );

  return NextResponse.json(Object.fromEntries(entries));
}
