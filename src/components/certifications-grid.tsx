"use client";

import { useMemo, useState } from "react";
import { certifications, type CertCategory } from "@/content/certifications";
import { CertificationCard } from "@/components/certification-card";
import { RevealGroup, RevealItem, revealItem } from "@/components/reveal";
import { cn } from "@/lib/utils";

const categories: CertCategory[] = [
  "AI & Data",
  "Engineering",
  "Security & Cloud",
  "Languages",
];

export function CertificationsGrid({
  pdfHrefs,
}: {
  pdfHrefs: Record<string, string | undefined>;
}) {
  const [category, setCategory] = useState<CertCategory | "all">("all");

  const sorted = useMemo(
    () => [...certifications].sort((a, b) => (a.issued < b.issued ? 1 : -1)),
    []
  );

  const filtered = useMemo(
    () => sorted.filter((c) => category === "all" || c.category === category),
    [sorted, category]
  );

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        <FilterButton active={category === "all"} onClick={() => setCategory("all")}>
          All
        </FilterButton>
        {categories.map((c) => (
          <FilterButton
            key={c}
            active={category === c}
            onClick={() => setCategory(c)}
          >
            {c}
          </FilterButton>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="mt-16 text-sm text-muted">
          No certifications match that filter.
        </p>
      ) : (
        <RevealGroup className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((cert) => (
            <RevealItem key={`${cert.issuer}-${cert.title}`} variants={revealItem}>
              <CertificationCard cert={cert} pdfHref={pdfHrefs[cert.title]} />
            </RevealItem>
          ))}
        </RevealGroup>
      )}
    </div>
  );
}

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors cursor-pointer",
        active
          ? "border-accent bg-accent/10 text-accent"
          : "border-border text-muted hover:text-text"
      )}
    >
      {children}
    </button>
  );
}
