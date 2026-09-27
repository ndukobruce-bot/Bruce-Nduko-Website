import type { Metadata } from "next";
import { uses } from "@/content/uses";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "Uses — Bruce Nduko",
  description: "Hardware, editor, AI tools, stack, and infra Bruce Nduko uses.",
};

export default function UsesPage() {
  return (
    <div className="px-6 py-24">
      <div className="mx-auto max-w-2xl">
        <div data-code-clear>
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-muted">
            Setup
          </p>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Uses
          </h1>
        </div>

        <div className="mt-14 space-y-12">
          {uses.map((section, i) => (
            <Reveal key={section.label} delay={i * 0.05}>
              <h2 className="text-xs font-medium uppercase tracking-wide text-muted">
                {section.label}
              </h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {section.items.map((item) => (
                  <li
                    key={item.name}
                    className="rounded-full border border-border bg-surface px-3.5 py-1.5 text-sm"
                  >
                    {item.name}
                    {item.note && <span className="text-muted"> · {item.note}</span>}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
