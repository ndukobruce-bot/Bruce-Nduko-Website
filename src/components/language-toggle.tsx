"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { LANG_COOKIE, type Lang } from "@/content/i18n";
import { cn } from "@/lib/utils";

export function LanguageToggle({ lang }: { lang: Lang }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [target, setTarget] = useState<Lang | null>(null);

  // Writing document.cookie is a side effect, so it belongs in an effect
  // rather than directly in the click handler — runs once when `target`
  // diverges from the server-known `lang`, then again once they match.
  useEffect(() => {
    if (target === null || target === lang) return;
    document.cookie = `${LANG_COOKIE}=${target}; path=/; max-age=31536000`;
    startTransition(() => router.refresh());
  }, [target, lang, router]);

  return (
    <div
      className={cn(
        "flex items-center overflow-hidden rounded-full border border-border text-xs font-medium",
        pending && "opacity-60"
      )}
      role="group"
      aria-label="Language"
    >
      {(["en", "sw"] as const).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setTarget(l)}
          aria-pressed={lang === l}
          className={cn(
            "px-2.5 py-1.5 uppercase tracking-wide transition-colors cursor-pointer",
            lang === l ? "bg-accent-rich text-accent-ink" : "text-muted hover:text-text"
          )}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
