"use client";

import { useState } from "react";
import { Copy, Check, Mail, MessageCircle } from "lucide-react";
import { profile } from "@/content/profile";
import { MagneticButton } from "@/components/magnetic-button";
import { Reveal } from "@/components/reveal";
import { i18n, pick, type Lang } from "@/content/i18n";

export function Contact({ lang }: { lang: Lang }) {
  const [copied, setCopied] = useState(false);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(profile.contact.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard unavailable — no-op
    }
  }

  return (
    <section id="contact" className="px-6 py-28">
      <div className="mx-auto max-w-3xl text-center">
        <div data-code-clear>
          <Reveal>
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-muted">
              {pick(lang, i18n.contact.kicker)}
            </p>
            <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              {pick(lang, i18n.contact.headingPrefix)}
              <span className="text-accent">{pick(lang, i18n.contact.headingEmphasis)}</span>
            </h2>
          </Reveal>

          <Reveal delay={0.05}>
            <p className="mx-auto mt-4 max-w-md text-muted">
              {profile.contact.email} · {profile.contact.phoneDisplay}
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <MagneticButton href={`mailto:${profile.contact.email}`}>
              <Mail size={15} /> {pick(lang, i18n.contact.emailMe)}
            </MagneticButton>
            <MagneticButton
              variant="ghost"
              href={`https://wa.me/${profile.contact.phoneWhatsApp}`}
            >
              <MessageCircle size={15} /> {pick(lang, i18n.contact.whatsapp)}
            </MagneticButton>
            <button
              type="button"
              onClick={copyEmail}
              className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm text-text transition-colors hover:border-accent cursor-pointer"
            >
              {copied ? <Check size={15} /> : <Copy size={15} />}
              {copied ? pick(lang, i18n.contact.copied) : pick(lang, i18n.contact.copyEmail)}
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
