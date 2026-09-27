"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { buildTypingScript, delayForStep } from "@/lib/typewriter";
import { COMMAND_NAMES, runCommand, type TerminalLine } from "@/lib/terminal-commands";

const PROMPT = "bruce@tijalabs:~$";
const BOOT_COMMAND = "whoami";

type DisplayLine =
  | { kind: "banner" | "prompt"; text: string }
  | ({ kind: "output" } & TerminalLine);

function toneClass(tone?: TerminalLine["tone"]): string {
  if (tone === "accent") return "text-accent";
  if (tone === "error") return "text-red-400";
  if (tone === "muted") return "text-neutral-500";
  return "text-neutral-300";
}

export function TerminalApp({ hasCv }: { hasCv: boolean }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [lines, setLines] = useState<DisplayLine[]>([
    {
      kind: "banner",
      text: "bruce@tijalabs terminal — type 'help' to see available commands.",
    },
  ]);
  const [booted, setBooted] = useState(false);
  const [typedBoot, setTypedBoot] = useState("");
  const [input, setInput] = useState("");
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyPos, setHistoryPos] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  // Portal to document.body: this page's content renders inside <main>,
  // which has its own z-indexed stacking context (see layout.tsx), so a
  // z-index here alone can't out-rank the sticky Nav (z-40) — it would
  // stay trapped under main's z-10. Rendering at the body level escapes
  // that and lets this overlay sit above everything, full-screen.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- SSR can't know "mounted"; this is the standard portal-mount guard
    setMounted(true);
  }, []);

  // Boot sequence: auto-type "whoami" and run it, then hand control to the
  // real input. Respects prefers-reduced-motion by skipping straight to it.
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function finishBoot() {
      const result = runCommand(BOOT_COMMAND, { hasCv });
      setLines((prev) => [
        ...prev,
        { kind: "prompt", text: BOOT_COMMAND },
        ...result.lines.map((l) => ({ kind: "output" as const, ...l })),
      ]);
      setBooted(true);
    }

    if (reduced) {
      finishBoot();
      return;
    }

    let cancelled = false;
    const script = buildTypingScript(BOOT_COMMAND, 7);
    let stepIndex = 0;
    let buffer = "";
    let timeoutId: ReturnType<typeof setTimeout>;

    function tick() {
      if (cancelled) return;
      if (stepIndex >= script.length) {
        timeoutId = setTimeout(() => {
          if (!cancelled) finishBoot();
        }, 300);
        return;
      }
      const step = script[stepIndex];
      buffer = step.kind === "backspace" ? buffer.slice(0, -1) : buffer + step.char;
      setTypedBoot(buffer);
      stepIndex++;
      timeoutId = setTimeout(tick, delayForStep(step, Math.random));
    }

    tick();
    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- boot runs once
  }, []);

  useEffect(() => {
    if (booted) inputRef.current?.focus();
  }, [booted]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [lines, typedBoot]);

  function submit(raw: string) {
    const command = raw.trim();
    setLines((prev) => [...prev, { kind: "prompt", text: command }]);
    if (command) setCmdHistory((prev) => [...prev, command]);
    setHistoryPos(null);
    setInput("");

    if (!command) return;

    const result = runCommand(command, { hasCv });

    if (result.action === "clear") {
      setLines([]);
      return;
    }

    if (result.lines.length) {
      setLines((prev) => [
        ...prev,
        ...result.lines.map((l) => ({ kind: "output" as const, ...l })),
      ]);
    }

    if (result.action === "open" && result.openUrl) {
      if (result.openUrl.startsWith("mailto:")) {
        window.location.href = result.openUrl;
      } else {
        window.open(result.openUrl, "_blank", "noopener,noreferrer");
      }
    }

    if (result.action === "exit") {
      setTimeout(() => router.push("/"), 400);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      submit(input);
      return;
    }

    if (e.key === "Escape") {
      e.preventDefault();
      router.push("/");
      return;
    }

    if (e.key === "Tab") {
      e.preventDefault();
      const [firstToken] = input.split(/\s+/);
      if (!firstToken) return;
      const matches = COMMAND_NAMES.filter((c) => c.startsWith(firstToken.toLowerCase()));
      if (matches.length === 1) {
        setInput(matches[0] + " ");
      }
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (cmdHistory.length === 0) return;
      const nextPos = historyPos === null ? cmdHistory.length - 1 : Math.max(0, historyPos - 1);
      setHistoryPos(nextPos);
      setInput(cmdHistory[nextPos]);
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyPos === null) return;
      const nextPos = historyPos + 1;
      if (nextPos >= cmdHistory.length) {
        setHistoryPos(null);
        setInput("");
      } else {
        setHistoryPos(nextPos);
        setInput(cmdHistory[nextPos]);
      }
    }
  }

  if (!mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex flex-col bg-black font-mono text-sm"
      onClick={() => inputRef.current?.focus()}
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          router.push("/");
        }}
        aria-label="Close terminal"
        className="absolute right-4 top-4 z-10 flex size-8 items-center justify-center rounded-full border border-neutral-700 text-neutral-400 transition-colors hover:border-accent hover:text-accent"
      >
        <X size={14} />
      </button>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-6 sm:px-10 sm:py-10">
        <div className="mx-auto max-w-3xl space-y-1">
          {lines.map((line, i) => (
            <p
              key={i}
              className={
                line.kind === "banner"
                  ? "text-neutral-500"
                  : line.kind === "prompt"
                    ? "text-accent"
                    : toneClass((line as { tone?: TerminalLine["tone"] }).tone)
              }
            >
              {line.kind === "prompt" ? (
                <>
                  <span>{PROMPT} </span>
                  <span className="text-neutral-300">{line.text}</span>
                </>
              ) : (
                line.text || " "
              )}
            </p>
          ))}

          {!booted && (
            <p className="text-accent">
              {PROMPT} <span className="text-neutral-300">{typedBoot}</span>
              <span
                aria-hidden
                className="ml-0.5 inline-block h-[1em] w-[7px] translate-y-[2px] animate-[blink_1s_steps(1)_infinite] bg-neutral-300"
              />
            </p>
          )}

          {booted && (
            <div className="flex items-center text-accent">
              <label htmlFor="terminal-input" className="shrink-0">
                {PROMPT}
              </label>
              <input
                id="terminal-input"
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                autoComplete="off"
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck={false}
                aria-label="Terminal input"
                style={{ caretColor: "var(--color-accent)" }}
                className="ml-2 flex-1 bg-transparent text-neutral-300 outline-none"
              />
            </div>
          )}
        </div>
      </div>

      <p className="px-5 pb-4 text-xs text-neutral-600 sm:px-10">
        Press Esc, or type &lsquo;exit&rsquo;, to leave.
      </p>
    </div>,
    document.body
  );
}
