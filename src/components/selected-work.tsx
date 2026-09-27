import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { projects } from "@/content/projects";
import { ProjectCard } from "@/components/project-card";
import { Reveal, RevealGroup, RevealItem, revealItem } from "@/components/reveal";
import { getProjectCovers } from "@/lib/files";

// Chosen to show range: two live consumer products (one AI+payments, one
// AI+web+mobile), a live mobile app shipped to the Play Store, and one
// in-build product to show current momentum.
const selectedSlugs = ["allama", "studysphere", "leveragex", "hali"];

export function SelectedWork() {
  const selected = selectedSlugs
    .map((slug) => projects.find((p) => p.slug === slug))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));
  const covers = getProjectCovers(selectedSlugs);

  return (
    <section id="work" className="border-b border-border px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <div data-code-clear className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-muted">
                Selected work
              </p>
              <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                Things I&rsquo;ve <span className="text-accent">shipped</span>
              </h2>
            </div>
            <Link
              href="/projects"
              className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-accent"
            >
              All projects
              <ArrowUpRight size={14} />
            </Link>
          </div>
        </Reveal>

        <RevealGroup className="mt-12 grid gap-5 sm:grid-cols-2">
          {selected.map((project) => (
            <RevealItem key={project.slug} variants={revealItem}>
              <ProjectCard project={project} cover={covers[project.slug]} />
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
