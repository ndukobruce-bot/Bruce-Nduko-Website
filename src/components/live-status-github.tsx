"use client";

import { useEffect, useState } from "react";
import { ExternalLink } from "lucide-react";
import { liveCheckTargets } from "@/content/projects";
import { Reveal } from "@/components/reveal";
import { links } from "@/content/links";

type StatusMap = Record<string, "live" | "checking">;

type GithubData = {
  username: string;
  eventCount: number;
  recentPushes: { repo: string; message: string; date: string }[];
  topLanguages: { name: string; count: number; share: number }[];
  heat: number[]; // relative activity per week, oldest first, most recent last
} | null;

export function LiveStatusGithub() {
  const [status, setStatus] = useState<StatusMap>({});
  const [github, setGithub] = useState<GithubData>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/status")
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) setStatus(data);
      })
      .catch(() => {
        // Leave everything as "checking" rather than claim anything is down.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!links.githubUsername) return;
    let cancelled = false;
    fetch("/api/github")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!cancelled && data) setGithub(data);
      })
      .catch(() => {
        // No username configured, or fewer than 5 recent events — section
        // stays hidden rather than show a near-empty widget.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="border-b border-border px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <div data-code-clear>
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-muted">
              Right now
            </p>
            <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              Live status
            </h2>
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <div className="mt-10 grid gap-3 sm:grid-cols-2">
            {liveCheckTargets.map((t) => {
              const state = status[t.slug];
              const isLive = state === "live";
              return (
                <a
                  key={t.slug}
                  href={t.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-3 rounded-xl border border-border bg-surface px-4 py-3 text-sm transition-colors hover:border-accent/50"
                >
                  <span className="flex items-center gap-2">
                    <span
                      className={
                        "pulse-dot relative flex size-1.5 rounded-full " +
                        (isLive ? "bg-accent text-accent" : "bg-muted text-muted")
                      }
                    />
                    {t.slug}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-muted">
                    {isLive ? "Live" : "Checking…"}
                    <ExternalLink size={12} />
                  </span>
                </a>
              );
            })}
          </div>
        </Reveal>

        {github && (
          <Reveal delay={0.1}>
            <div className="mt-12 rounded-2xl border border-border bg-surface p-6">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">
                  GitHub activity · @{github.username}
                </p>
                <a
                  href={`https://github.com/${github.username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-muted hover:text-accent"
                >
                  View profile
                </a>
              </div>

              <div
                className="mt-4 flex items-end gap-1"
                role="img"
                aria-label={`Activity over the last ${github.heat.length} weeks, oldest to newest`}
              >
                {github.heat.map((v, i) => (
                  <div
                    key={i}
                    title={`${v} event${v === 1 ? "" : "s"} · ${github.heat.length - i} week${
                      github.heat.length - i === 1 ? "" : "s"
                    } ago`}
                    className="h-6 flex-1 rounded-sm bg-accent"
                    style={{ opacity: v === 0 ? 0.12 : Math.min(0.3 + v * 0.2, 1) }}
                  />
                ))}
              </div>

              {github.topLanguages.length > 0 && (
                <div className="mt-5 space-y-2">
                  {github.topLanguages.map((l) => (
                    <div key={l.name} className="flex items-center gap-3 text-xs">
                      <span className="w-24 shrink-0 font-mono text-muted">
                        {l.name}
                      </span>
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-2">
                        <div
                          className="h-full rounded-full bg-accent"
                          style={{ width: `${Math.max(l.share * 100, 4)}%` }}
                        />
                      </div>
                      <span className="w-6 shrink-0 text-right font-mono text-muted">
                        {l.count}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {github.recentPushes.length > 0 && (
                <ul className="mt-5 space-y-2">
                  {github.recentPushes.map((p, i) => (
                    <li
                      key={i}
                      className="flex items-baseline justify-between gap-3 text-xs text-muted"
                    >
                      <span className="truncate text-text">{p.repo}</span>
                      <span className="shrink-0 font-mono">{p.date}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
