"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { codeSnippets, type CodeLanguage } from "@/content/code-snippets";
import { highlightLine } from "@/lib/highlight";
import { buildTypingScript, delayForStep, type TypeStep } from "@/lib/typewriter";

type Column = {
  x: number;
  colWidth: number;
  fontSize: number;
  lineHeight: number;
  snippetIndex: number;
  script: TypeStep[];
  stepIndex: number;
  nextTickAt: number;
  current: string;
  lineCount: number;
  maxLines: number;
  speed: number;
  restUntil: number | null;
  buffer: HTMLCanvasElement;
  bufferCtx: CanvasRenderingContext2D;
};

const FALLBACK_FAMILY = "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return h;
}

function pickColumnCount(width: number): number {
  if (width < 480) return 1;
  if (width < 1024) return 2;
  return Math.min(6, Math.max(4, Math.round(width / 280)));
}

// Fixed dark palette — the site has one theme, so this never needs to be
// re-read from CSS or refreshed on a theme change.
const KEYWORD_COLOR = "#e6c65c";
const MUTED_COLOR = "rgb(245,245,245)";
const BG_RGB: [number, number, number] = [11, 11, 12];
const OPACITY = 0.2;

/**
 * The site-wide code background: one fixed canvas behind everything, drawn
 * with requestAnimationFrame — never React state per character, so typing
 * never triggers a component re-render or DOM diff. Lives in the root
 * layout, so it's never unmounted by client-side navigation between pages.
 *
 * Two performance-critical details:
 * - Each column keeps its *completed* lines pre-rendered on a small
 *   offscreen canvas (a "buffer"), scrolled by copying it onto itself
 *   shifted up one line — the standard cheap way to scroll a canvas.
 *   Every frame only re-draws the one actively-typing line fresh, plus a
 *   single `drawImage` blit per column — never re-measuring the whole
 *   accumulated snippet 60 times a second.
 * - The initial 70-80%-of-screen fill (so there's never an empty frame)
 *   reuses that exact same buffer-writing path, just run synchronously in
 *   a tight loop before the first paint instead of paced over real time.
 */
export function CodeBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const updateRectsRef = useRef<() => void>(() => {});
  const pathname = usePathname();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let columns: Column[] = [];
    let raf = 0;
    let cancelled = false;
    let fontFamily = FALLBACK_FAMILY;
    let vignette: HTMLCanvasElement | null = null;
    let clearRects: DOMRect[] = [];

    function font(size: number) {
      return `${size}px ${fontFamily}`;
    }

    function makeBuffer(w: number, h: number, fontSize: number) {
      const buffer = document.createElement("canvas");
      buffer.width = Math.max(1, Math.round(w));
      buffer.height = Math.max(1, Math.round(h));
      const bufferCtx = buffer.getContext("2d")!;
      bufferCtx.font = font(fontSize);
      bufferCtx.textBaseline = "top";
      return { buffer, bufferCtx };
    }

    // Keywords carry the full ambient opacity in gold; everything else (the
    // bulk of any snippet) draws at a *relative* 0.6 baked directly into
    // the buffer's pixels — the absolute site-wide opacity is applied once,
    // uniformly, at blit time instead of re-computed per token per frame.
    function drawTokensInto(tctx: CanvasRenderingContext2D, line: string, y: number, lang: CodeLanguage) {
      let cx = 0;
      for (const tok of highlightLine(line, lang)) {
        tctx.globalAlpha = tok.kind === "keyword" ? 1 : 0.6;
        tctx.fillStyle = tok.kind === "keyword" ? KEYWORD_COLOR : MUTED_COLOR;
        tctx.fillText(tok.text, cx, y);
        cx += tctx.measureText(tok.text).width;
      }
    }

    function pushCompletedLine(col: Column, line: string, lang: CodeLanguage) {
      const bctx = col.bufferCtx;
      if (col.lineCount >= col.maxLines) {
        bctx.drawImage(col.buffer, 0, -col.lineHeight);
        bctx.clearRect(0, (col.maxLines - 1) * col.lineHeight, col.colWidth, col.lineHeight);
      } else {
        col.lineCount++;
      }
      const y = (Math.min(col.lineCount, col.maxLines) - 1) * col.lineHeight;
      bctx.clearRect(0, y, col.colWidth, col.lineHeight);
      drawTokensInto(bctx, line, y, lang);
    }

    function nextSnippet(col: Column, seedSuffix: number | string) {
      col.snippetIndex = (col.snippetIndex + 1) % codeSnippets.length;
      col.script = buildTypingScript(
        codeSnippets[col.snippetIndex].code,
        hash(codeSnippets[col.snippetIndex].filename + seedSuffix)
      );
      col.stepIndex = 0;
    }

    // Applies one typing step's worth of state change. Used both for live,
    // paced ticking and for the synchronous initial fill below — same
    // logic either way, just driven by a real clock or a tight loop.
    function applyStep(col: Column, lang: CodeLanguage) {
      const step = col.script[col.stepIndex];
      if (step.kind === "backspace") {
        col.current = col.current.slice(0, -1);
      } else if (step.char === "\n") {
        pushCompletedLine(col, col.current, lang);
        col.current = "";
      } else {
        col.current += step.char;
      }
      col.stepIndex++;
      return step;
    }

    // Fills a column with 70-80% of a screen's worth of lines *instantly*
    // (synchronous, before first paint) so there's never an empty frame —
    // then live typing continues seamlessly from wherever this leaves off.
    function fastForwardFill(col: Column) {
      const target = Math.floor(col.maxLines * (0.7 + Math.random() * 0.1));
      let guard = 0;
      while (col.lineCount < target && guard < 20000) {
        guard++;
        if (col.stepIndex >= col.script.length) {
          nextSnippet(col, `fill${guard}`);
        }
        const lang = codeSnippets[col.snippetIndex].language;
        applyStep(col, lang);
      }
    }

    function buildColumns() {
      const fontSize = width < 640 ? 11 : 12;
      const lineHeight = Math.round(fontSize * 1.6);
      const count = pickColumnCount(width);
      const colWidth = width / count;
      const maxLines = Math.ceil(height / lineHeight) + 1;

      columns = Array.from({ length: count }, (_, i) => {
        const snippetIndex = (i * 3 + 1) % codeSnippets.length;
        const snippet = codeSnippets[snippetIndex];
        const { buffer, bufferCtx } = makeBuffer(colWidth, maxLines * lineHeight, fontSize);
        const col: Column = {
          x: i * colWidth + 14,
          colWidth,
          fontSize,
          lineHeight,
          snippetIndex,
          script: buildTypingScript(snippet.code, hash(snippet.filename + i)),
          stepIndex: 0,
          nextTickAt: 0,
          current: "",
          lineCount: 0,
          maxLines,
          // ~35-60 chars/sec: delayForStep's baseline (~25-90ms/char) scaled
          // down by this multiplier, with a little per-column spread so
          // they don't all type in perfect lockstep.
          speed: 0.35 + (i % 4) * 0.06,
          restUntil: null,
          buffer,
          bufferCtx,
        };
        fastForwardFill(col);
        col.nextTickAt = performance.now() + i * 80;
        return col;
      });
    }

    function setup() {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = Math.round(width * dpr);
      canvas!.height = Math.round(height * dpr);
      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildColumns();
      buildVignette();
    }

    // Returns true if this column's visible content actually changed.
    function advance(col: Column, now: number): boolean {
      if (col.restUntil !== null) {
        if (now < col.restUntil) return false;
        col.restUntil = null;
        col.lineCount = 0;
        col.current = "";
        nextSnippet(col, now);
        col.bufferCtx.clearRect(0, 0, col.buffer.width, col.buffer.height);
      }

      if (now < col.nextTickAt) return false;
      if (col.stepIndex >= col.script.length) {
        col.restUntil = now + 2200;
        col.nextTickAt = col.restUntil;
        return false;
      }

      const lang: CodeLanguage = codeSnippets[col.snippetIndex].language;
      const step = applyStep(col, lang);
      col.nextTickAt = now + delayForStep(step, Math.random) * col.speed;
      return true;
    }

    function drawScene() {
      ctx!.clearRect(0, 0, width, height);
      ctx!.textBaseline = "top";

      for (const col of columns) {
        ctx!.globalAlpha = OPACITY;
        ctx!.drawImage(col.buffer, col.x, 12);

        ctx!.font = font(col.fontSize);
        const lang: CodeLanguage = codeSnippets[col.snippetIndex].language;
        const y = 12 + Math.min(col.lineCount, col.maxLines) * col.lineHeight;
        let cx = col.x;
        for (const tok of highlightLine(col.current, lang)) {
          ctx!.globalAlpha = tok.kind === "keyword" ? OPACITY : OPACITY * 0.6;
          ctx!.fillStyle = tok.kind === "keyword" ? KEYWORD_COLOR : MUTED_COLOR;
          ctx!.fillText(tok.text, cx, y);
          cx += ctx!.measureText(tok.text).width;
        }
      }

      if (vignette) {
        ctx!.globalAlpha = 1;
        ctx!.drawImage(vignette, 0, 0, width, height);
      }

      drawReadabilityFades();
    }

    // A gentle, whole-viewport assist (the base 20% opacity is already
    // meant to be readable-through) — baked into its own canvas once per
    // resize since the gradient itself is comparatively expensive to
    // compute, then just blitted every redraw.
    function buildVignette() {
      const v = document.createElement("canvas");
      v.width = width;
      v.height = height;
      const vctx = v.getContext("2d")!;
      const grd = vctx.createRadialGradient(
        width * 0.32,
        height * 0.42,
        0,
        width * 0.32,
        height * 0.42,
        Math.max(width, height) * 0.2
      );
      const [r, g, b] = BG_RGB;
      grd.addColorStop(0, `rgba(${r},${g},${b},0.4)`);
      grd.addColorStop(0.7, `rgba(${r},${g},${b},0.12)`);
      grd.addColorStop(1, `rgba(${r},${g},${b},0)`);
      vctx.fillStyle = grd;
      vctx.fillRect(0, 0, width, height);
      vignette = v;
    }

    // A stronger, tightly-scoped fade behind specific known text blocks
    // (hero copy, section headings, page intros — anything tagged
    // data-code-clear) so code never actually runs behind words, while
    // still showing clearly in the space around them. Positions are
    // cached and only re-measured on scroll/resize/navigation, never per
    // animation frame.
    function fillRoundRect(x: number, y: number, w: number, h: number, radius: number) {
      ctx!.beginPath();
      if (typeof ctx!.roundRect === "function") {
        ctx!.roundRect(x, y, w, h, radius);
      } else {
        ctx!.rect(x, y, w, h);
      }
      ctx!.fill();
    }

    // Two layers per zone: a soft outer glow (feathered radial falloff, so
    // the transition into visible code is gentle) plus a near-solid core
    // sized to the text's actual box (guarantees full coverage everywhere
    // directly behind words, regardless of how wide/short the box is — a
    // pure radial gradient under-covers the corners of a wide rectangle).
    function drawReadabilityFades() {
      if (clearRects.length === 0) return;
      ctx!.save();
      ctx!.globalAlpha = 1;
      const [br, bg, bb] = BG_RGB;

      for (const r of clearRects) {
        if (r.bottom < -100 || r.top > height + 100) continue;

        const featherPad = 64;
        const fx = r.x - featherPad;
        const fy = r.y - featherPad;
        const fw = r.width + featherPad * 2;
        const fh = r.height + featherPad * 2;
        const grd = ctx!.createRadialGradient(
          fx + fw / 2,
          fy + fh / 2,
          0,
          fx + fw / 2,
          fy + fh / 2,
          Math.max(fw, fh) * 0.65
        );
        grd.addColorStop(0, `rgba(${br},${bg},${bb},0.92)`);
        grd.addColorStop(0.55, `rgba(${br},${bg},${bb},0.6)`);
        grd.addColorStop(1, `rgba(${br},${bg},${bb},0)`);
        ctx!.fillStyle = grd;
        fillRoundRect(fx, fy, fw, fh, 56);

        const innerPad = 22;
        const iw = r.width + innerPad * 2;
        const ih = r.height + innerPad * 2;
        ctx!.fillStyle = `rgba(${br},${bg},${bb},0.9)`;
        fillRoundRect(r.x - innerPad, r.y - innerPad, iw, ih, Math.min(48, ih / 2));
      }
      ctx!.restore();
    }

    function updateRects() {
      clearRects = Array.from(document.querySelectorAll("[data-code-clear]")).map((el) =>
        el.getBoundingClientRect()
      );
      drawScene();
    }
    updateRectsRef.current = updateRects;

    function frame(now: number) {
      if (cancelled) return;
      raf = requestAnimationFrame(frame);
      if (document.hidden) return;

      let changed = false;
      for (const col of columns) {
        if (advance(col, now)) changed = true;
      }
      // Nothing moved this frame — leave the canvas exactly as it was
      // instead of paying for a full redraw at 60fps regardless.
      if (!changed) return;

      drawScene();
    }

    // Start immediately: no waiting on fonts, idle callbacks or
    // IntersectionObserver. The fallback system-mono stack needs no
    // loading at all, so the very first frame is already fully drawn.
    setup();
    drawScene();
    requestAnimationFrame(updateRects);

    if (!reducedMotion) {
      raf = requestAnimationFrame(frame);
    }

    // Once the site's real mono webfont is ready, swap to it and redraw —
    // new text picks it up immediately; already-buffered lines keep the
    // (visually near-identical, low-opacity) fallback glyphs rather than
    // paying to re-render the whole scrollback.
    const brandedFamily = getComputedStyle(document.documentElement)
      .getPropertyValue("--font-jetbrains")
      .trim();
    if (brandedFamily && "fonts" in document) {
      document.fonts.ready.then(() => {
        if (cancelled) return;
        fontFamily = brandedFamily;
        drawScene();
      });
    }

    function onResize() {
      setup();
      drawScene();
    }
    window.addEventListener("resize", onResize);

    let scrollScheduled = false;
    function onScroll() {
      if (scrollScheduled) return;
      scrollScheduled = true;
      requestAnimationFrame(() => {
        scrollScheduled = false;
        updateRects();
      });
    }
    window.addEventListener("scroll", onScroll, { passive: true });

    // Layout can shift below the fold without any scroll/resize event at
    // all — e.g. the GitHub activity card populating late after its fetch
    // resolves, pushing everything below it down. A ResizeObserver on the
    // whole page catches that (and images loading, fonts swapping, etc.)
    // generally, so cached rects don't go stale silently.
    let resizeScheduled = false;
    const bodyResizeObserver = new ResizeObserver(() => {
      if (resizeScheduled) return;
      resizeScheduled = true;
      requestAnimationFrame(() => {
        resizeScheduled = false;
        updateRects();
      });
    });
    bodyResizeObserver.observe(document.body);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
      bodyResizeObserver.disconnect();
    };
  }, []);

  // Page content (and therefore the set of data-code-clear elements)
  // changes on navigation even though this component itself never
  // remounts — re-measure once the new page has painted.
  useEffect(() => {
    const id = requestAnimationFrame(() => updateRectsRef.current());
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10"
    />
  );
}
