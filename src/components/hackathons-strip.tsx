import { ArrowUpRight } from "lucide-react";
import { hackathons } from "@/content/hackathons";
import { Reveal } from "@/components/reveal";
import { i18n, pick, type Lang } from "@/content/i18n";

export function HackathonsStrip({ lang }: { lang: Lang }) {
  return (
    <div>
      <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-muted">
        {pick(lang, i18n.hackathons.kicker)}
      </p>
      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        {hackathons.map((h) => (
          <Reveal key={h.slug}>
            <div className="rounded-2xl border border-border bg-surface p-6">
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="font-medium">{h.name}</h3>
                <div className="flex items-center gap-2">
                  {h.badge && (
                    <span className="rounded-full border border-accent/40 bg-accent/10 px-2 py-0.5 font-mono text-xs font-semibold text-accent">
                      {h.badge}
                    </span>
                  )}
                  <span className="font-mono text-xs text-muted">{h.year}</span>
                </div>
              </div>
              <p className="mt-2 text-sm text-muted">{h.description}</p>
              {h.result && (
                <p className="mt-2 text-sm font-medium text-accent">{h.result}</p>
              )}
              {h.items.length > 0 && (
                <ul className="mt-4 flex flex-wrap gap-1.5">
                  {h.items.map((item) => (
                    <li
                      key={item}
                      className="rounded-full bg-surface-2 px-2.5 py-1 text-xs text-muted"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              )}
              {h.link && (
                <a
                  href={h.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-accent"
                >
                  View competition
                  <ArrowUpRight size={13} />
                </a>
              )}
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
