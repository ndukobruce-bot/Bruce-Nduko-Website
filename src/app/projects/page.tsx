import type { Metadata } from "next";
import { ProjectsGrid } from "@/components/projects-grid";
import { HackathonsStrip } from "@/components/hackathons-strip";
import { projects } from "@/content/projects";
import { getProjectCovers } from "@/lib/files";

export const metadata: Metadata = {
  title: "Projects — Bruce Nduko",
  description: "Everything Bruce Nduko has built — live, in build, or concept.",
};

export default function ProjectsPage() {
  const covers = getProjectCovers(projects.map((p) => p.slug));

  return (
    <div className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div data-code-clear>
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-muted">
            Everything I&rsquo;ve built
          </p>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Projects
          </h1>
        </div>

        <div className="mt-12">
          <ProjectsGrid covers={covers} />
        </div>

        <div className="mt-24">
          <HackathonsStrip />
        </div>
      </div>
    </div>
  );
}
