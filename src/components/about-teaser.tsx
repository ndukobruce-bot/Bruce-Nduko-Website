import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { profile } from "@/content/profile";
import { Reveal } from "@/components/reveal";
import { i18n, pick, fill, type Lang } from "@/content/i18n";

export function AboutTeaser({ lang }: { lang: Lang }) {
  const bio = fill(pick(lang, i18n.aboutTeaser.bio), {
    location: profile.location,
    credential: profile.education[0].credential,
    institution: profile.education[0].institution,
    detail: profile.education[0].detail,
  });

  return (
    <section className="border-b border-border px-6 py-24">
      <div data-code-clear className="mx-auto max-w-3xl">
        <Reveal>
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-muted">
            {pick(lang, i18n.aboutTeaser.kicker)}
          </p>
        </Reveal>
        <Reveal delay={0.05}>
          <p className="text-2xl leading-snug tracking-tight sm:text-3xl">
            {bio}
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <Link
            href="/about"
            className="mt-6 inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-accent"
          >
            {pick(lang, i18n.aboutTeaser.ctaMore)}
            <ArrowUpRight size={14} />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
