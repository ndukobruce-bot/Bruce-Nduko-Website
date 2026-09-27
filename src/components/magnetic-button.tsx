"use client";

import { useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

function useMagnetic() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const reduced = useReducedMotion();

  function handleMove(e: React.MouseEvent<HTMLElement>) {
    if (reduced) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setPos({ x: x * 0.3, y: y * 0.3 });
  }

  function handleLeave() {
    setPos({ x: 0, y: 0 });
  }

  return { pos, handleMove, handleLeave };
}

export function MagneticButton({
  children,
  href,
  className,
  variant = "primary",
  onClick,
}: {
  children: ReactNode;
  href?: string;
  className?: string;
  variant?: "primary" | "ghost";
  onClick?: () => void;
}) {
  const { pos, handleMove, handleLeave } = useMagnetic();

  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-colors cursor-pointer",
    variant === "primary"
      ? "bg-accent-rich text-accent-ink hover:brightness-110"
      : "border border-border text-text hover:border-accent",
    className
  );

  const motionProps = {
    animate: { x: pos.x, y: pos.y },
    transition: { type: "spring" as const, stiffness: 150, damping: 12, mass: 0.2 },
    onMouseMove: handleMove,
    onMouseLeave: handleLeave,
    className: classes,
  };

  if (href) {
    return (
      <motion.a
        href={href}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
        {...motionProps}
      >
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button type="button" onClick={onClick} {...motionProps}>
      {children}
    </motion.button>
  );
}
