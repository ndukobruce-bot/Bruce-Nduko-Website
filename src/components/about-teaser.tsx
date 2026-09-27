import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { profile } from "@/content/profile";
import { Reveal } from "@/components/reveal";

export function AboutTeaser() {
  return (
    <section className="border-b border-border px-6 py-24">
      <div data-code-clear className="mx-auto max-w-3xl">
        <Reveal>
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-muted">
            About
          </p>
        </Reveal>
        <Reveal delay={0.05}>
          <p className="text-2xl leading-snug tracking-tight sm:text-3xl">
            I&rsquo;m a founder-engineer based in {profile.location}, studying
            {" "}
            {profile.education[0].credential} at {profile.education[0].institution}
            {" "}
            ({profile.education[0].detail}), and building AI productivity tools
            for Africa&rsquo;s next billion workers.
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <Link
            href="/about"
            className="mt-6 inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-accent"
          >
            More about how I work
            <ArrowUpRight size={14} />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
