"use client";

import { useEffect, useRef } from "react";

/**
 * Ambient hero background: a soft accent-colored glow that follows the
 * cursor, plus a static grain texture. Pure CSS-variable updates on
 * pointer move — no canvas, no per-frame React state, so it's cheap and
 * naturally does nothing when prefers-reduced-motion is on (the glow just
 * stays centered).
 */
export function GrainGradient() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduced) return;

    const el = ref.current;
    if (!el) return;

    function handleMove(e: MouseEvent) {
      const rect = el!.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      el!.style.setProperty("--mx", `${x}%`);
      el!.style.setProperty("--my", `${y}%`);
    }

    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ ["--mx" as string]: "50%", ["--my" as string]: "30%" }}
    >
      <div
        className="absolute inset-0 opacity-60 transition-[background] duration-300"
        style={{
          background:
            "radial-gradient(600px circle at var(--mx) var(--my), color-mix(in srgb, var(--color-accent) 16%, transparent), transparent 70%)",
        }}
      />
      <div className="grain absolute inset-0 opacity-[0.05] mix-blend-overlay" />
    </div>
  );
}
