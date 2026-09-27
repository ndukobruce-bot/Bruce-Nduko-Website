import { NextResponse } from "next/server";
import { links } from "@/content/links";

export const revalidate = 3600; // 1 hour

// Below this, "recent activity" would be more noise than signal — hide the
// whole section rather than show a near-empty widget.
const MIN_EVENTS_TO_SHOW = 5;

type GithubEvent = {
  type: string;
  repo: { name: string };
  created_at: string;
  payload?: { commits?: { message: string }[] };
};

type GithubRepo = {
  name: string;
  language: string | null;
  fork: boolean;
};

function relativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 60) return `${Math.max(minutes, 1)}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  return `${weeks}w ago`;
}

export async function GET() {
  const username = links.githubUsername;
  if (!username) {
    return NextResponse.json(null, { status: 404 });
  }

  try {
    const headers = { "User-Agent": "brucenduko-website", Accept: "application/vnd.github+json" };

    const [eventsRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${username}/events/public?per_page=100`, {
        headers,
        next: { revalidate: 3600 },
      }),
      fetch(`https://api.github.com/users/${username}/repos?sort=pushed&per_page=100`, {
        headers,
        next: { revalidate: 3600 },
      }),
    ]);

    if (!eventsRes.ok || !reposRes.ok) {
      return NextResponse.json(null, { status: 502 });
    }

    const events = (await eventsRes.json()) as GithubEvent[];
    const repos = (await reposRes.json()) as GithubRepo[];

    if (events.length < MIN_EVENTS_TO_SHOW) {
      return NextResponse.json(null, { status: 404 });
    }

    const pushEvents = events.filter((e) => e.type === "PushEvent");

    const recentPushes = pushEvents.slice(0, 5).map((e) => ({
      repo: e.repo.name.split("/")[1] ?? e.repo.name,
      message: e.payload?.commits?.[0]?.message ?? "",
      date: relativeTime(e.created_at),
    }));

    const languageCounts = new Map<string, number>();
    for (const repo of repos) {
      if (repo.fork || !repo.language) continue;
      languageCounts.set(repo.language, (languageCounts.get(repo.language) ?? 0) + 1);
    }
    const totalLanguageRepos = [...languageCounts.values()].reduce((a, b) => a + b, 0);
    const topLanguages = [...languageCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([name, count]) => ({
        name,
        count,
        share: totalLanguageRepos > 0 ? count / totalLanguageRepos : 0,
      }));

    // 12-week activity heat strip from public events, oldest to newest.
    const weeks = 12;
    const heat = new Array(weeks).fill(0);
    const now = new Date();
    const msPerWeek = 1000 * 60 * 60 * 24 * 7;
    for (const e of events) {
      const diffWeeks = Math.floor(
        (now.getTime() - new Date(e.created_at).getTime()) / msPerWeek
      );
      if (diffWeeks >= 0 && diffWeeks < weeks) {
        heat[weeks - 1 - diffWeeks] += 1;
      }
    }

    return NextResponse.json({
      username,
      eventCount: events.length,
      recentPushes,
      topLanguages,
      heat,
    });
  } catch {
    return NextResponse.json(null, { status: 502 });
  }
}
