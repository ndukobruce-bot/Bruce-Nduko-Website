"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { projects } from "@/content/projects";
import { profile } from "@/content/profile";
import { links } from "@/content/links";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  useEffect(() => {
    function onKeydown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") setOpen(false);
    }
    function onOpenEvent() {
      setOpen(true);
    }
    window.addEventListener("keydown", onKeydown);
    window.addEventListener("open-command-palette", onOpenEvent);
    return () => {
      window.removeEventListener("keydown", onKeydown);
      window.removeEventListener("open-command-palette", onOpenEvent);
    };
  }, []);

  const go = useCallback(
    (href: string) => {
      setOpen(false);
      if (href.startsWith("http")) {
        window.open(href, "_blank", "noopener,noreferrer");
      } else {
        router.push(href);
      }
    },
    [router]
  );

  const copyEmail = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(profile.contact.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard unavailable — silently ignore
    }
    setOpen(false);
  }, []);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 pt-[12vh]"
      onClick={() => setOpen(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl"
      >
        <Command label="Command palette">
          <Command.Input
            autoFocus
            placeholder="Jump to a section, project, or link…"
            className="w-full border-b border-border bg-transparent px-4 py-3 text-sm text-text outline-none placeholder:text-muted"
          />
          <Command.List className="max-h-80 overflow-y-auto p-2">
            <Command.Empty className="px-3 py-4 text-sm text-muted">
              No results.
            </Command.Empty>

            <Command.Group
              heading="Navigate"
              className="px-2 py-1 [&_[cmdk-group-heading]]:block [&_[cmdk-group-heading]]:px-1 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wide [&_[cmdk-group-heading]]:text-muted"
            >
              <Item onSelect={() => go("/#work")}>Selected work</Item>
              <Item onSelect={() => go("/#tija")}>Tija Labs</Item>
              <Item onSelect={() => go("/projects")}>All projects</Item>
              <Item onSelect={() => go("/about")}>About</Item>
              <Item onSelect={() => go("/now")}>Now</Item>
              <Item onSelect={() => go("/certifications")}>Certifications</Item>
              <Item onSelect={() => go("/#contact")}>Contact</Item>
            </Command.Group>

            <Command.Group
              heading="Projects"
              className="px-2 py-1 [&_[cmdk-group-heading]]:block [&_[cmdk-group-heading]]:px-1 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wide [&_[cmdk-group-heading]]:text-muted"
            >
              {projects.map((p) => (
                <Item key={p.slug} onSelect={() => go(`/projects/${p.slug}`)}>
                  {p.name}
                </Item>
              ))}
            </Command.Group>

            <Command.Group
              heading="Actions"
              className="px-2 py-1 [&_[cmdk-group-heading]]:block [&_[cmdk-group-heading]]:px-1 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wide [&_[cmdk-group-heading]]:text-muted"
            >
              <Item onSelect={copyEmail}>
                {copied ? "Copied!" : `Copy email — ${profile.contact.email}`}
              </Item>
              {links.social.github && (
                <Item onSelect={() => go(links.social.github)}>
                  Open GitHub
                </Item>
              )}
              {links.social.linkedin && (
                <Item onSelect={() => go(links.social.linkedin)}>
                  Open LinkedIn
                </Item>
              )}
            </Command.Group>
          </Command.List>
        </Command>
      </div>
    </div>
  );
}

function Item({
  children,
  onSelect,
}: {
  children: React.ReactNode;
  onSelect: () => void;
}) {
  return (
    <Command.Item
      onSelect={onSelect}
      className="cursor-pointer rounded-lg border-l-2 border-transparent px-3 py-2 text-sm text-text data-[selected=true]:border-accent-rich data-[selected=true]:bg-accent-rich/10 data-[selected=true]:text-accent"
    >
      {children}
    </Command.Item>
  );
}
