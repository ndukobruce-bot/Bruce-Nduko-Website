import Image from "next/image";
import { Globe, Smartphone, Sparkles, CreditCard } from "lucide-react";
import type { ProjectCategory } from "@/content/projects";

const categoryIcon: Record<ProjectCategory, React.ComponentType<{ size?: number; className?: string }>> = {
  Web: Globe,
  Mobile: Smartphone,
  AI: Sparkles,
  Payments: CreditCard,
};

// A card's fallback cover and its title (rendered right below it) would
// otherwise show the project name twice — the fallback shows initials
// instead, so the name only appears once.
function initials(name: string): string {
  const words = name.split(/\s+/).filter(Boolean);
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

// The fixed-aspect image slot used everywhere a project needs a cover — the
// grid card and the case-study header. Real screenshot if one exists;
// otherwise a designed monochrome fallback. Never raw/cropped text, never
// an empty box.
export function ProjectCover({
  name,
  categories,
  coverSrc,
  priority,
  sizes,
  className,
}: {
  name: string;
  categories: ProjectCategory[];
  coverSrc?: string;
  priority?: boolean;
  sizes?: string;
  className?: string;
}) {
  if (coverSrc) {
    return (
      <div className={"relative aspect-[16/10] w-full overflow-hidden bg-surface-2 " + (className ?? "")}>
        <Image
          src={coverSrc}
          alt={`${name} screenshot`}
          fill
          priority={priority}
          sizes={sizes ?? "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"}
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
    );
  }

  const Icon = categoryIcon[categories[0]] ?? Globe;

  return (
    <div
      className={
        "grain relative flex aspect-[16/10] w-full items-center justify-center overflow-hidden bg-surface-2 " +
        (className ?? "")
      }
    >
      <Icon size={20} className="absolute left-5 top-5 text-muted" />
      <span className="font-mono text-4xl font-semibold tracking-tight text-muted/70">
        {initials(name)}
      </span>
    </div>
  );
}
