import type { Metadata } from "next";
import { now } from "@/content/now";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "Now — Bruce Nduko",
  description: "What Bruce Nduko is focused on right now.",
};

export default function NowPage() {
  return (
    <div className="px-6 py-24">
      <div className="mx-auto max-w-2xl">
        <Reveal>
          <div data-code-clear>
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-muted">
              Now
            </p>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              What I&rsquo;m focused on
            </h1>
            <p className="mt-3 font-mono text-xs text-muted">
              Last updated {now.lastUpdated}
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <ul className="mt-10 space-y-4">
            {now.items.map((item, i) => (
              <li
                key={i}
                className="rounded-xl border border-border bg-surface p-4 text-base leading-relaxed"
              >
                {item}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </div>
  );
}
