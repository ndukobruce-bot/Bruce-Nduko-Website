// Pure logic for the "human typing" simulation — no React here so it's
// easy to reason about and reuse across the hero window, the ambient
// background layer, and any future variant.

export type TypeStep =
  | { kind: "type"; char: string }
  | { kind: "backspace" };

const NEARBY_KEYS: Record<string, string> = {
  a: "s", s: "a", d: "f", f: "d", e: "r", r: "e", i: "o", o: "i", n: "m",
  m: "n", t: "y", y: "t", c: "v", v: "c",
};

function typoFor(char: string): string {
  const lower = char.toLowerCase();
  const swapped = NEARBY_KEYS[lower] ?? lower;
  return char === lower ? swapped : swapped.toUpperCase();
}

/**
 * Turns a full source string into a sequence of type/backspace steps that,
 * played back with per-step delays, looks like a person typing it —
 * including the occasional wrong character that gets noticed and fixed.
 */
export function buildTypingScript(code: string, seed = 0): TypeStep[] {
  const steps: TypeStep[] = [];
  const rand = mulberry32(seed || hashString(code));

  for (let i = 0; i < code.length; i++) {
    const char = code[i];

    // Skip typos on whitespace/newlines and keep them rare overall.
    const shouldTypo = char !== " " && char !== "\n" && char !== "\t" && rand() < 0.012;

    if (shouldTypo) {
      steps.push({ kind: "type", char: typoFor(char) });
      steps.push({ kind: "backspace" });
    }

    steps.push({ kind: "type", char });
  }

  return steps;
}

export function delayForStep(step: TypeStep, rand: () => number): number {
  if (step.kind === "backspace") return 25 + rand() * 30;
  if (step.char === "\n") return 120 + rand() * 220;
  if (step.char === " ") return 15 + rand() * 40;
  // Rare "thinking" pause, otherwise a normal human keystroke interval.
  if (rand() < 0.03) return 200 + rand() * 350;
  return 25 + rand() * 65;
}

// Small deterministic PRNG so a given snippet always types the same way
// (stable across re-renders) without pulling in a dependency.
export function mulberry32(seed: number): () => number {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  }
  return h;
}
