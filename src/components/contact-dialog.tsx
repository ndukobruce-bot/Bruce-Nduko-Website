"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { profile } from "@/content/profile";
import { links } from "@/content/links";

export function ContactDialog() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-md bg-accent-rich px-5 py-3 text-sm font-medium text-accent-ink hover:opacity-90"
      >
        Get in touch
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-5 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setOpen(false);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-dialog-title"
            className="w-full max-w-sm rounded-2xl border border-border bg-surface p-6 shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 id="contact-dialog-title" className="text-xl font-semibold">Get in touch</h2>
                <p className="mt-1 text-sm text-muted">Choose the way that works best for you.</p>
              </div>
              <button
                type="button"
                autoFocus
                onClick={() => setOpen(false)}
                aria-label="Close contact details"
                className="rounded-md p-2 text-muted hover:bg-surface-2 hover:text-text"
              >
                <X size={18} />
              </button>
            </div>
            <div className="mt-6 flex flex-col gap-3">
              <a className="rounded-lg border border-border px-4 py-3 text-sm hover:border-accent" href={`tel:+${profile.contact.phoneWhatsApp}`}>
                <span className="block text-xs text-muted">Phone</span>
                <span className="mt-1 block font-medium">{profile.contact.phoneDisplay}</span>
              </a>
              <a className="rounded-lg border border-border px-4 py-3 text-sm hover:border-accent" href={`mailto:${profile.contact.email}`}>
                <span className="block text-xs text-muted">Email</span>
                <span className="mt-1 block font-medium">{profile.contact.email}</span>
              </a>
              {links.social.linkedin && (
                <a className="rounded-lg border border-border px-4 py-3 text-sm hover:border-accent" href={links.social.linkedin} target="_blank" rel="noopener noreferrer">
                  <span className="block text-xs text-muted">LinkedIn</span>
                  <span className="mt-1 block font-medium">Connect with me</span>
                </a>
              )}
            </div>
          </section>
        </div>
      )}
    </>
  );
}
