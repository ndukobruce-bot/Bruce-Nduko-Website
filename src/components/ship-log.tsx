import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { shiplog, type ShipLogEntry } from "@/content/shiplog";
import { Reveal } from "@/components/reveal";

export function ShipLog() {
  if (shiplog.length === 0) return null;

  const dated = shiplog.filter((e) => e.date !== null);
  const undated = shiplog.filter((e) => e.date === null);

  return (
    <section className="border-b border-border px-6 py-24">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-muted">
            Ship log
          </p>
          <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Dated milestones
          </h2>
        </Reveal>

        <div className="mt-12 space-y-8 border-l border-border pl-8">
          {dated.map((entry, i) => (
            <Entry key={entry.title} entry={entry} delay={i * 0.05} />
          ))}
        </div>

        {undated.length > 0 && (
          <div className="mt-14">
            <Reveal>
              <p className="mb-6 font-mono text-xs uppercase tracking-[0.2em] text-muted">
                Earlier
              </p>
            </Reveal>
            <div className="space-y-8 border-l border-border pl-8">
              {undated.map((entry, i) => (
                <Entry key={entry.title} entry={entry} delay={i * 0.05} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function Entry({ entry, delay }: { entry: ShipLogEntry; delay: number }) {
  const projectHref = entry.projectSlug ? `/projects/${entry.projectSlug}` : null;

  return (
    <Reveal delay={delay} className="relative">
      <span className="absolute -left-[calc(2rem+3px)] top-1.5 size-1.5 rounded-full bg-accent" />
      {entry.date && <p className="font-mono text-xs text-accent">{entry.date}</p>}
      <h3 className="mt-1.5 font-medium">{entry.title}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-muted">{entry.description}</p>
      {projectHref && (
        <Link
          href={projectHref}
          className="mt-1.5 inline-flex items-center gap-1 text-xs text-muted transition-colors hover:text-accent"
        >
          View project
          <ArrowUpRight size={12} />
        </Link>
      )}
    </Reveal>
  );
}
