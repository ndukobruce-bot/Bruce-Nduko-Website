import type { Metadata } from "next";
import { principles } from "@/content/principles";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "Principles — Bruce Nduko",
  description: "How Bruce Nduko builds — six working principles.",
};

export default function PrinciplesPage() {
  return (
    <div className="px-6 py-24">
      <div className="mx-auto max-w-3xl">
        <div data-code-clear>
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-muted">
            Principles
          </p>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            How I build
          </h1>
        </div>

        <div className="mt-16 space-y-20">
          {principles.map((p, i) => (
            <Reveal key={p.title} className="border-t border-border pt-10">
              <span className="font-mono text-sm text-accent">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
                {p.title}
              </h2>
              <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted">
                {p.subtext}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
