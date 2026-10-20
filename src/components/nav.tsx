import Link from "next/link";
import { profile } from "@/content/profile";

export function Nav() {
  return (
    <header className="border-b border-border">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-5">
        <Link href="/" className="font-semibold tracking-tight">{profile.name}</Link>
        <nav aria-label="Main navigation" className="flex gap-5 text-sm text-muted">
          <Link className="hover:text-accent" href="/projects">Work</Link>
          <Link className="hover:text-accent" href="/about">About</Link>
          <a className="hover:text-accent" href={`mailto:${profile.contact.email}`}>Contact</a>
        </nav>
      </div>
    </header>
  );
}
