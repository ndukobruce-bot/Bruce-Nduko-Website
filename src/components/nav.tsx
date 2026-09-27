"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Command } from "lucide-react";
import { profile } from "@/content/profile";
import { i18n, pick, type Lang } from "@/content/i18n";
import { LanguageToggle } from "@/components/language-toggle";

export function Nav({ lang }: { lang: Lang }) {
  const [open, setOpen] = useState(false);

  const links = [
    { href: "/#work", label: pick(lang, i18n.nav.work) },
    { href: "/#tija", label: pick(lang, i18n.nav.tijaLabs) },
    { href: "/about", label: pick(lang, i18n.nav.about) },
    { href: "/now", label: pick(lang, i18n.nav.now) },
    { href: "/certifications", label: pick(lang, i18n.nav.certifications) },
    { href: "/principles", label: pick(lang, i18n.nav.principles) },
    { href: "/terminal", label: pick(lang, i18n.nav.terminal) },
    { href: "/#contact", label: pick(lang, i18n.nav.contact) },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-semibold tracking-tight">
          {profile.name}
        </Link>

        <nav className="hidden items-center gap-8 text-sm text-muted md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="transition-colors hover:text-text"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden md:block">
            <LanguageToggle lang={lang} />
          </div>
          <button
            type="button"
            onClick={() =>
              window.dispatchEvent(new CustomEvent("open-command-palette"))
            }
            className="hidden items-center gap-2 rounded-full border border-border px-3 py-1.5 text-xs text-muted transition-colors hover:text-text hover:border-accent md:flex cursor-pointer"
          >
            <Command size={13} />
            <span>K</span>
          </button>
          <button
            type="button"
            className="flex size-9 items-center justify-center rounded-full border border-border text-muted md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-border px-6 py-4 md:hidden">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-2 py-2 text-sm text-muted hover:bg-surface hover:text-text"
            >
              {l.label}
            </Link>
          ))}
          <div className="mt-2 px-2">
            <LanguageToggle lang={lang} />
          </div>
        </nav>
      )}
    </header>
  );
}
