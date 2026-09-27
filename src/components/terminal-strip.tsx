"use client";

import { startTransition, useEffect, useRef, useState } from "react";
import { buildTypingScript, delayForStep } from "@/lib/typewriter";

const COMMAND = "git push origin main";
const RESULT = "✓ deployed to production";

export function TerminalStrip() {
  const rootRef = useRef<HTMLDivElement>(null);
  const visibleRef = useRef(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [typed, setTyped] = useState("");
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReducedMotion(mq.matches);
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting;
      },
      { threshold: 0.01 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (reducedMotion) return;

    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout>;
    const script = buildTypingScript(COMMAND, 1);
    let stepIndex = 0;
    let buffer = "";

    function tick() {
      if (cancelled) return;
      if (!visibleRef.current || document.hidden) {
        timeoutId = setTimeout(tick, 500);
        return;
      }

      if (stepIndex >= script.length) {
        timeoutId = setTimeout(() => {
          if (cancelled) return;
          setShowResult(true);
          timeoutId = setTimeout(() => {
            if (cancelled) return;
            setShowResult(false);
            setTyped("");
            buffer = "";
            stepIndex = 0;
            timeoutId = setTimeout(tick, 600);
          }, 3200);
        }, 500);
        return;
      }

      const step = script[stepIndex];
      buffer = step.kind === "backspace" ? buffer.slice(0, -1) : buffer + step.char;
      const bufferSnapshot = buffer;
      startTransition(() => setTyped(bufferSnapshot));
      stepIndex++;
      timeoutId = setTimeout(tick, delayForStep(step, Math.random));
    }

    tick();
    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [reducedMotion]);

  const line = reducedMotion ? COMMAND : typed;
  const done = reducedMotion || showResult;

  return (
    <div
      ref={rootRef}
      className="w-full max-w-sm rounded-lg border border-border bg-surface px-4 py-3 font-mono text-xs"
    >
      <p className="text-muted">
        <span className="text-accent">$</span> {line}
        {!done && (
          <span
            aria-hidden
            className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[2px] animate-[blink_1s_steps(1)_infinite] bg-accent"
          />
        )}
      </p>
      {done && <p className="mt-1 text-accent">{RESULT}</p>}
    </div>
  );
}
