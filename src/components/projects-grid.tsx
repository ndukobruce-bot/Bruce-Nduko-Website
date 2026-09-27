"use client";

import { useMemo, useState } from "react";
import {
  projects,
  statusLabel,
  type ProjectCategory,
  type ProjectStatus,
} from "@/content/projects";
import { ProjectCard } from "@/components/project-card";
import { RevealGroup, RevealItem, revealItem } from "@/components/reveal";
import { cn } from "@/lib/utils";
import { i18n, pick, type Lang } from "@/content/i18n";

const statuses: ProjectStatus[] = ["live", "beta", "in-build", "concept"];
const categories: ProjectCategory[] = ["Web", "Mobile", "AI", "Payments"];

export function ProjectsGrid({
  covers,
  lang,
}: {
  covers: Record<string, string | undefined>;
  lang: Lang;
}) {
  const [status, setStatus] = useState<ProjectStatus | "all">("all");
  const [category, setCategory] = useState<ProjectCategory | "all">("all");

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      if (status !== "all" && p.status !== status) return false;
      if (category !== "all" && !p.categories.includes(category)) return false;
      return true;
    });
  }, [status, category]);

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        <FilterButton active={status === "all"} onClick={() => setStatus("all")}>
          {pick(lang, i18n.projects.filterAllStatuses)}
        </FilterButton>
        {statuses.map((s) => (
          <FilterButton
            key={s}
            active={status === s}
            onClick={() => setStatus(s)}
          >
            {statusLabel[s]}
          </FilterButton>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <FilterButton
          active={category === "all"}
          onClick={() => setCategory("all")}
        >
          {pick(lang, i18n.projects.filterAllCategories)}
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
          {pick(lang, i18n.projects.emptyState)}
        </p>
      ) : (
        <RevealGroup className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project) => (
            <RevealItem key={project.slug} variants={revealItem}>
              <ProjectCard project={project} cover={covers[project.slug]} />
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
