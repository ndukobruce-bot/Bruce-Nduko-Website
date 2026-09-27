import { ExternalLink } from "lucide-react";
import { tija } from "@/content/tija";
import { Reveal } from "@/components/reveal";

export function TijaSpotlight() {
  return (
    <section
      id="tija"
      className="relative overflow-hidden px-6 py-24"
    >
      {/* Feathered panel background instead of a flat bg-surface rect —
          fades to transparent at the top/bottom so the code behind it
          shows through smoothly rather than cutting off at a hard edge. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-surface"
        style={{
          maskImage:
            "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full opacity-20 blur-3xl"
        style={{ background: "var(--color-accent-rich)" }}
      />
      <div className="relative mx-auto max-w-6xl">
        <Reveal>
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-accent">
            The main thing
          </p>
        </Reveal>

        <Reveal delay={0.05}>
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              {tija.name}
            </h2>
            <a
              href={tija.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-accent"
            >
              {tija.url.replace("https://", "")}
              <ExternalLink size={13} />
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="mt-3 font-mono text-sm text-accent">
            &ldquo;{tija.tagline}&rdquo;
          </p>
        </Reveal>

        <Reveal delay={0.15}>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
            {tija.description}
          </p>
        </Reveal>

        <Reveal delay={0.2}>
          <div className={`mt-10 grid gap-6 ${tija.stage ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
            <div className="rounded-2xl border border-border bg-bg p-6">
              <p className="text-xs uppercase tracking-wide text-muted">
                My role
              </p>
              <p className="mt-2 text-sm leading-relaxed">{tija.myRole}</p>
            </div>
            <div className="rounded-2xl border border-border bg-bg p-6">
              <p className="text-xs uppercase tracking-wide text-muted">
                Co-founder
              </p>
              <p className="mt-2 text-sm leading-relaxed">
                {tija.cofounder.name} — {tija.cofounder.role}
              </p>
            </div>
            {tija.stage && (
              <div className="rounded-2xl border border-border bg-bg p-6">
                <p className="text-xs uppercase tracking-wide text-muted">
                  Stage
                </p>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {tija.stage}
                </p>
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
