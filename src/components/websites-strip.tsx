import { ExternalLink } from "lucide-react";
import { projects } from "@/content/projects";
import { Reveal } from "@/components/reveal";
import { i18n, pick, type Lang } from "@/content/i18n";

// Data-driven on purpose: add a new site by setting `isWebsite: true` and a
// `link` on a project in /content/projects.ts — nothing else to touch.
export function WebsitesStrip({ lang }: { lang: Lang }) {
  const websites = projects.filter((p) => p.isWebsite && p.link);

  if (websites.length === 0) return null;

  return (
    <section className="border-b border-border px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="mb-6 font-mono text-xs uppercase tracking-[0.2em] text-muted">
            {pick(lang, i18n.websitesStrip.kicker)}
          </p>
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {websites.map((site) => (
            <a
              key={site.slug}
              href={site.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col gap-2 rounded-2xl border border-border bg-surface p-5 transition-colors hover:border-accent/50"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium">{site.name}</span>
                <ExternalLink
                  size={13}
                  className="shrink-0 text-muted transition-colors group-hover:text-accent"
                />
              </div>
              <p className="text-sm leading-relaxed text-muted">
                {site.oneLiner}
              </p>
              <span className="mt-1 text-xs text-muted">
                {site.link!.replace("https://", "").replace("http://", "")}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
