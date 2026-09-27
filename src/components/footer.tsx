import Link from "next/link";
import { profile } from "@/content/profile";
import { links } from "@/content/links";
import { TerminalStrip } from "@/components/terminal-strip";

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-border">
      {/* Feathered fill instead of a flat bg-bg rect — fades in from
          transparent at the top edge so the code behind it shows through
          smoothly rather than cutting off at a hard line. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-bg"
        style={{
          maskImage: "linear-gradient(to bottom, transparent, black 120px)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent, black 120px)",
        }}
      />
      <div className="mx-auto max-w-6xl px-6 pt-8">
        <TerminalStrip />
      </div>
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-10 text-sm text-muted md:flex-row md:items-center md:justify-between">
        <p>
          &copy; {new Date().getFullYear()} {profile.name}. Built from{" "}
          {profile.location}.
        </p>
        <div className="flex flex-wrap gap-5">
          <Link href="/projects" className="hover:text-accent">
            Projects
          </Link>
          <Link href="/certifications" className="hover:text-accent">
            Certifications
          </Link>
          <Link href="/about" className="hover:text-accent">
            About
          </Link>
          <Link href="/now" className="hover:text-accent">
            Now
          </Link>
          <a href={`mailto:${profile.contact.email}`} className="hover:text-accent">
            Email
          </a>
          {links.social.github && (
            <a
              href={links.social.github}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent"
            >
              GitHub
            </a>
          )}
          {links.social.linkedin && (
            <a
              href={links.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent"
            >
              LinkedIn
            </a>
          )}
          {links.social.x && (
            <a
              href={links.social.x}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent"
            >
              X
            </a>
          )}
        </div>
      </div>
    </footer>
  );
}
