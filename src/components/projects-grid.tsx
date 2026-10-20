import Link from "next/link";
import { projects } from "@/content/projects";

export function ProjectsGrid() {
  const groups = [
    { title: "Apps", items: projects.filter((project) => !project.isWebsite) },
    { title: "Websites", items: projects.filter((project) => project.isWebsite) },
  ];

  return (
    <div className="space-y-12">
      {groups.map(({ title, items }) => (
        <section key={title} aria-labelledby={`projects-${title.toLowerCase()}`}>
          <h2 id={`projects-${title.toLowerCase()}`} className="text-xl font-semibold tracking-tight">{title}</h2>
          <ul className="mt-4 divide-y divide-border border-t border-border">
            {items.map((project) => (
              <li key={project.slug} className="flex flex-col gap-2 py-5 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="font-medium">
                    {project.link ? (
                      <a className="hover:text-accent" href={project.link} target="_blank" rel="noopener noreferrer">{project.name}</a>
                    ) : (
                      <Link className="hover:text-accent" href={`/projects/${project.slug}`}>{project.name}</Link>
                    )}
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted">{project.oneLiner}</p>
                </div>
                <span className="shrink-0 text-xs text-muted">{project.status === "in-build" ? "In progress" : project.status === "live" ? "Live" : project.status}</span>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
