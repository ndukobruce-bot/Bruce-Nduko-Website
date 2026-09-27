"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/content/projects";
import { StatusBadge } from "@/components/status-badge";
import { ProjectCover } from "@/components/project-cover";

export function ProjectCard({
  project,
  cover,
}: {
  project: Project;
  cover?: string;
}) {
  const reduced = useReducedMotion();
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    if (reduced) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: py * -6, y: px * 6 });
  }

  function handleLeave() {
    setTilt({ x: 0, y: 0 });
  }

  return (
    <Link href={`/projects/${project.slug}`}>
      <motion.div
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        animate={{ rotateX: tilt.x, rotateY: tilt.y }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        style={{ transformPerspective: 800 }}
        className="group flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-border bg-surface transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:border-accent/50 hover:shadow-[0_16px_40px_-16px_var(--color-accent-rich)]"
      >
        <ProjectCover
          name={project.name}
          categories={project.categories}
          coverSrc={cover}
          className="border-b border-border"
        />
        <div className="flex flex-1 flex-col justify-between p-6">
          <div>
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-lg font-semibold tracking-tight">
                {project.name}
              </h3>
              <ArrowUpRight
                size={16}
                className="mt-1 shrink-0 text-muted transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
              />
            </div>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {project.oneLiner}
            </p>
          </div>

          <div className="mt-6 flex items-center justify-between gap-3">
            <StatusBadge status={project.status} />
            <div className="flex flex-wrap justify-end gap-1.5">
              {project.categories.map((c) => (
                <span
                  key={c}
                  className="rounded-full bg-surface-2 px-2 py-0.5 text-[11px] text-muted"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
