import { profile } from "@/content/profile";
import { links } from "@/content/links";

const PLAY_STORE =
  "https://play.google.com/store/apps/details?id=com.leveragex.leveragex";

export function SiteFooter() {
  const profiles = [
    { label: "GitHub", href: links.social.github },
    { label: "LinkedIn", href: links.social.linkedin },
    { label: "X", href: links.social.x },
    { label: "Tija Labs", href: "https://tijalabs.com" },
    { label: "LeverageX", href: PLAY_STORE },
  ].filter((l) => l.href);

  return (
    <footer className="relative z-10 border-t border-border">
      <div className="mx-auto flex max-w-4xl flex-col gap-4 px-6 py-10 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>
          &copy; {new Date().getFullYear()} {profile.name} — {profile.headline}
        </p>
        <nav aria-label="Find Bruce Nduko online">
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {profiles.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  target="_blank"
                  rel="me noopener noreferrer"
                  className="hover:text-accent"
                >
                  {l.label}
                </a>
              </li>
            ))}
            <li>
              <a href={`mailto:${profile.contact.email}`} className="hover:text-accent">
                Email
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
