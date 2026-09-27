import type { Metadata } from "next";
import { ProjectsGrid } from "@/components/projects-grid";
import { HackathonsStrip } from "@/components/hackathons-strip";
import { projects } from "@/content/projects";
import { getProjectCovers } from "@/lib/files";
import { i18n, pick } from "@/content/i18n";
import { getLang } from "@/lib/lang";

export const metadata: Metadata = {
  title: "Projects — Bruce Nduko",
  description: "Everything Bruce Nduko has built — live, in build, or concept.",
};

export default async function ProjectsPage() {
  const lang = await getLang();
  const covers = getProjectCovers(projects.map((p) => p.slug));

  return (
    <div className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div data-code-clear>
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-muted">
            {pick(lang, i18n.projects.pageKicker)}
          </p>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            {pick(lang, i18n.projects.pageH1)}
          </h1>
        </div>

        <div className="mt-12">
          <ProjectsGrid covers={covers} lang={lang} />
        </div>

        <div className="mt-24">
          <HackathonsStrip lang={lang} />
        </div>
      </div>
    </div>
  );
}
