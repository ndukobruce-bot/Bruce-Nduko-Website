import { hackathons } from "@/content/hackathons";
import { Reveal } from "@/components/reveal";

export function HackathonsStrip() {
  return (
    <div>
      <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-muted">
        Hackathons &amp; build sprints
      </p>
      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        {hackathons.map((h) => (
          <Reveal key={h.slug}>
            <div className="rounded-2xl border border-border bg-surface p-6">
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="font-medium">{h.name}</h3>
                <span className="font-mono text-xs text-muted">{h.year}</span>
              </div>
              <p className="mt-2 text-sm text-muted">{h.description}</p>
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
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
