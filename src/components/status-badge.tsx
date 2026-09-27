import { cn } from "@/lib/utils";
import { statusLabel, type ProjectStatus } from "@/content/projects";

const styles: Record<ProjectStatus, string> = {
  live: "border-accent/40 text-accent bg-accent/10",
  beta: "border-border text-text bg-surface-2",
  "in-build": "border-border text-muted bg-surface-2",
  concept: "border-border text-muted bg-transparent",
};

export function StatusBadge({ status }: { status: ProjectStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
        styles[status]
      )}
    >
      {status === "live" && (
        <span className="pulse-dot relative flex size-1.5 rounded-full bg-accent text-accent" />
      )}
      {statusLabel[status]}
    </span>
  );
}
