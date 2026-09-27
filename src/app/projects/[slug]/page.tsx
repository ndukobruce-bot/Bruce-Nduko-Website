import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { projects } from "@/content/projects";
import { StatusBadge } from "@/components/status-badge";
import { getProjectScreenshots } from "@/lib/files";
import { LiveCode } from "@/components/live-code";
import { codeSnippets } from "@/content/code-snippets";
import { projectCodeFilename } from "@/content/project-code";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  return {
    title: `${project.name} — Bruce Nduko`,
    description: project.oneLiner,
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  const screenshots = getProjectScreenshots(project.slug);
  const codeFilename = projectCodeFilename[project.slug];
  const codeSnippet = codeSnippets.find((s) => s.filename === codeFilename);

  return (
    <div className="px-6 py-24">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/projects"
          className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-text"
        >
          <ArrowLeft size={14} /> All projects
        </Link>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <StatusBadge status={project.status} />
          {project.categories.map((c) => (
            <span
              key={c}
              className="rounded-full bg-surface-2 px-2.5 py-1 text-xs text-muted"
            >
              {c}
            </span>
          ))}
        </div>

        <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
          {project.name}
        </h1>
        <p className="mt-4 text-lg text-muted">{project.oneLiner}</p>

        {project.link && (
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-1.5 text-sm text-accent hover:underline"
          >
            {project.link.replace("https://", "").replace("http://", "")}
            <ExternalLink size={13} />
          </a>
        )}

        <div className="mt-12">
          {screenshots.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {screenshots.map((src) => (
                <div
                  key={src}
                  className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-surface"
                >
                  <Image
                    src={src}
                    alt={`${project.name} screenshot`}
                    fill
                    sizes="(min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <div className="mt-14 space-y-10">
          <Section title="Problem" body={project.problem} />
          <Section title="What I built" body={project.whatIBuilt} />

          <div>
            <h2 className="text-xs font-medium uppercase tracking-wide text-muted">
              Stack
            </h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {project.stack.map((s) => (
                <span
                  key={s}
                  className="rounded-full border border-border px-3 py-1 text-xs text-text"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          {project.lessons && (
            <div>
              <h2 className="text-xs font-medium uppercase tracking-wide text-muted">
                Lessons
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                {project.lessons}
              </p>
            </div>
          )}

          {codeSnippet && (
            <div>
              <h2 className="text-xs font-medium uppercase tracking-wide text-muted">
                The kind of code behind it
              </h2>
              <LiveCode mode="static" snippet={codeSnippet} className="mt-3" lines={codeSnippet.code.split("\n").length} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Section({ title, body }: { title: string; body: string | null }) {
  if (!body || body === "TODO") return null;
  return (
    <div>
      <h2 className="text-xs font-medium uppercase tracking-wide text-muted">
        {title}
      </h2>
      <p className="mt-3 text-base leading-relaxed">{body}</p>
    </div>
  );
}
