"use client";

import { memo, startTransition, useEffect, useMemo, useRef, useState } from "react";
import { codeSnippets, type CodeSnippet } from "@/content/code-snippets";
import { highlightLine } from "@/lib/highlight";
import { buildTypingScript, delayForStep, type TypeStep } from "@/lib/typewriter";
import { cn } from "@/lib/utils";

// "editor"/"static" render as a fixed dark IDE window regardless of the
// site's light/dark theme — a code editor is its own visual context.
// "ambient" is theme-aware since it's bare text laid over the page itself.
const editorTokenClass: Record<string, string> = {
  keyword: "text-[#E6C65C]",
  string: "text-white/55",
  comment: "text-white/30 italic",
  plain: "text-white/70",
};
const ambientTokenClass: Record<string, string> = {
  keyword: "text-accent",
  string: "text-muted",
  comment: "text-muted/60 italic",
  plain: "text-muted",
};

// Memoized per line: a finished line's text never changes again, so once
// typing has moved past it React can skip re-rendering it entirely instead
// of re-tokenizing and re-diffing every line on every keystroke.
const Line = memo(function Line({
  text,
  lineNumber,
  language,
  showCursor,
  dark,
}: {
  text: string;
  lineNumber: number;
  language: CodeSnippet["language"];
  showCursor: boolean;
  dark: boolean;
}) {
  const tokenClass = dark ? editorTokenClass : ambientTokenClass;
  return (
    <div className="flex">
      <span
        className={cn(
          "mr-4 w-5 shrink-0 select-none text-right",
          dark ? "text-white/25" : "text-muted/40"
        )}
      >
        {lineNumber}
      </span>
      <span className="whitespace-pre">
        {highlightLine(text, language).map((tok, j) => (
          <span key={j} className={tokenClass[tok.kind]}>
            {tok.text}
          </span>
        ))}
        {showCursor && <Cursor dark={dark} />}
      </span>
    </div>
  );
});

function Cursor({ dark }: { dark: boolean }) {
  return (
    <span
      aria-hidden
      className={cn(
        "ml-0.5 inline-block h-[1em] w-[2px] translate-y-[2px] animate-[blink_1s_steps(1)_infinite]",
        dark ? "bg-[#E6C65C]" : "bg-accent"
      )}
    />
  );
}

/**
 * `mode="editor"` — a dark IDE window: filename tab, line numbers, typing loop.
 *   Pass a fixed `snippet` to loop that one snippet forever (per-section
 *   homepage windows); omit it to cycle through all of codeSnippets (hero).
 * `mode="ambient"` — same typing loop, bare (no chrome), theme-aware colors,
 *   meant to sit at low opacity behind page content.
 * `mode="static"` — a single snippet, fully rendered, no animation — used
 *   for case-study previews so N of them never run N timers.
 */
export function LiveCode({
  mode,
  snippet,
  startIndex = 0,
  speed = 1,
  startDelayMs = 0,
  restMs = 1600,
  className,
  lines: visibleLines = 16,
}: {
  mode: "editor" | "ambient" | "static";
  snippet?: CodeSnippet;
  startIndex?: number;
  speed?: number;
  // A fixed-position ambient layer is *always* "on screen" per
  // IntersectionObserver, so it can never rely on off-screen pausing —
  // this delay keeps it quiet during the critical initial-load window
  // instead, so it doesn't compete with FCP/TTI on every single page.
  startDelayMs?: number;
  restMs?: number;
  className?: string;
  lines?: number;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const visibleRef = useRef(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [snippetIndex, setSnippetIndex] = useState(startIndex);
  // Split so a keystroke only ever re-renders the one active line, not the
  // whole snippet typed so far.
  const [completedLines, setCompletedLines] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState("");

  const cycling = !snippet;
  const current = snippet ?? codeSnippets[snippetIndex % codeSnippets.length];
  const dark = mode !== "ambient";

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReducedMotion(mq.matches);
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (mode === "static") return;
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
  }, [mode]);

  const script = useMemo(
    () => (mode === "static" ? [] : buildTypingScript(current.code, hash(current.filename))),
    [current, mode]
  );

  useEffect(() => {
    if (mode === "static" || reducedMotion) return;

    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout>;
    let stepIndex = 0;
    let completed: string[] = [];
    let line = "";

    function scheduleNext() {
      if (cancelled) return;
      if (!visibleRef.current || document.hidden) {
        timeoutId = setTimeout(scheduleNext, 400);
        return;
      }

      if (stepIndex >= script.length) {
        timeoutId = setTimeout(() => {
          if (cancelled) return;
          stepIndex = 0;
          completed = [];
          line = "";
          startTransition(() => {
            setCompletedLines([]);
            setCurrentLine("");
            if (cycling) setSnippetIndex((i) => i + 1);
          });
        }, restMs);
        return;
      }

      const step: TypeStep = script[stepIndex];
      if (step.kind === "backspace") {
        line = line.slice(0, -1);
      } else if (step.char === "\n") {
        completed = [...completed, line];
        line = "";
        startTransition(() => setCompletedLines(completed));
      } else {
        line += step.char;
      }
      const lineSnapshot = line;
      startTransition(() => setCurrentLine(lineSnapshot));
      stepIndex++;

      timeoutId = setTimeout(scheduleNext, delayForStep(step, Math.random) * speed);
    }

    timeoutId = setTimeout(scheduleNext, startDelayMs);
    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
    // `cycling`, `speed`, `restMs` and `startDelayMs` are stable for a
    // given instance's lifetime.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [script, reducedMotion, mode]);

  // Scroll is only ever needed at line granularity, so this only has to
  // run when a line completes — not on every character.
  useEffect(() => {
    const el = scrollRef.current;
    if (el && el.scrollHeight > el.clientHeight) el.scrollTop = el.scrollHeight;
  }, [completedLines.length]);

  const staticLines = useMemo(
    () => (mode === "static" || reducedMotion ? current.code.split("\n") : []),
    [mode, reducedMotion, current]
  );

  return (
    <div
      ref={rootRef}
      className={cn(
        "overflow-hidden rounded-xl font-mono text-xs",
        dark ? "border border-black/40 bg-[#0D0D0D]" : "border border-border bg-surface",
        className
      )}
    >
      {mode === "editor" && (
        <div
          className={cn(
            "flex items-center gap-2 border-b px-4 py-2.5",
            dark ? "border-white/10 bg-[#171717]" : "border-border bg-surface-2"
          )}
        >
          <span className={cn("size-2.5 rounded-full", dark ? "bg-white/15" : "bg-muted/30")} />
          <span className={cn("size-2.5 rounded-full", dark ? "bg-white/15" : "bg-muted/30")} />
          <span className={cn("size-2.5 rounded-full", dark ? "bg-white/15" : "bg-muted/30")} />
          <span className={cn("ml-2", dark ? "text-white/45" : "text-muted")}>
            {current.filename}
          </span>
        </div>
      )}
      <div
        ref={scrollRef}
        style={mode === "ambient" ? undefined : { height: `${visibleLines * 1.35}em` }}
        className={cn(
          "overflow-hidden px-4 py-3 leading-[1.35]",
          mode === "ambient" && "h-full"
        )}
      >
        {mode === "static" || reducedMotion ? (
          staticLines.map((l, i) => (
            <Line key={i} text={l} lineNumber={i + 1} language={current.language} showCursor={false} dark={dark} />
          ))
        ) : (
          <>
            {completedLines.map((l, i) => (
              <Line key={i} text={l} lineNumber={i + 1} language={current.language} showCursor={false} dark={dark} />
            ))}
            <Line
              text={currentLine}
              lineNumber={completedLines.length + 1}
              language={current.language}
              showCursor
              dark={dark}
            />
          </>
        )}
      </div>
    </div>
  );
}

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return h;
}
