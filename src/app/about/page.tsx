import type { Metadata } from "next";
import Image from "next/image";
import { profile } from "@/content/profile";
import { tija } from "@/content/tija";
import { links } from "@/content/links";
import { skills } from "@/content/skills";
import { Reveal } from "@/components/reveal";
import { MagneticButton } from "@/components/magnetic-button";
import { fileExistsInPublic } from "@/lib/files";

export const metadata: Metadata = {
  title: "About — Bruce Nduko",
  description: profile.positioning,
};

export default function AboutPage() {
  const hasCv = fileExistsInPublic("cv.pdf");
  const hasPhoto = profile.photo && fileExistsInPublic(profile.photo.replace(/^\//, ""));

  return (
    <div className="px-6 py-24">
      <div className="mx-auto max-w-2xl">
        <div data-code-clear>
        <Reveal>
          {hasPhoto ? (
            <div className="mb-8 h-28 w-28 overflow-hidden rounded-full border border-border">
              <Image
                src={profile.photo!}
                alt={profile.name}
                width={224}
                height={224}
                className="h-full w-full object-cover"
                priority
              />
            </div>
          ) : (
            <div className="mb-8 flex size-28 items-center justify-center overflow-hidden rounded-full border border-border bg-surface-2">
              <span className="font-mono text-2xl font-semibold text-muted">BN</span>
            </div>
          )}
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-muted">
            About
          </p>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            {profile.name}
          </h1>
          <p className="mt-3 text-muted">
            {profile.headline} · {profile.location}
          </p>
        </Reveal>

        <Reveal delay={0.05}>
          <div className="mt-12 space-y-6 text-lg leading-relaxed text-muted">
            <p>
              I&rsquo;m a student and founder based in {profile.location}. I&rsquo;m
              reading {profile.education[0].credential} at{" "}
              {profile.education[0].institution} ({profile.education[0].detail}),
              and separately working through {profile.education[1].institution}
              &rsquo;s {profile.education[1].credential} (
              {profile.education[1].detail}).
            </p>
            <p>
              I care about the informal economy and productivity because
              that&rsquo;s where most of the work in Kenya actually happens,
              and it&rsquo;s the part of the economy that has the least
              tooling built for it. At {tija.name} I&rsquo;m {tija.myRole.toLowerCase()}
            </p>
            <p>
              I design, build, and ship end-to-end: product decisions,
              engineering, infrastructure, and deployment. I work
              AI-assisted — pairing with tools like Claude and Codex to move
              fast — but I own the architecture, the security, and the
              decisions myself.
            </p>
          </div>
        </Reveal>
        </div>

        <Reveal delay={0.1}>
          <div className="mt-14">
            <h2 className="text-xs font-medium uppercase tracking-wide text-muted">
              Education
            </h2>
            <ul className="mt-4 space-y-3">
              {profile.education.map((e) => (
                <li
                  key={e.credential}
                  className="rounded-xl border border-border bg-surface p-4 text-sm"
                >
                  <p className="font-medium">{e.credential}</p>
                  <p className="text-muted">
                    {e.institution} · {e.detail}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal delay={0.12}>
          <div className="mt-14">
            <h2 className="text-xs font-medium uppercase tracking-wide text-muted">
              Skills
            </h2>
            <div className="mt-4 space-y-4">
              {skills.map((group) => (
                <div key={group.label}>
                  <p className="text-sm font-medium text-text">{group.label}</p>
                  <ul className="mt-2 flex flex-wrap gap-1.5">
                    {group.items.map((item) => (
                      <li
                        key={item}
                        className="rounded-full border border-border bg-surface px-3 py-1 text-xs text-muted"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mt-14 flex flex-wrap gap-3">
            <MagneticButton href={`mailto:${profile.contact.email}`}>
              Email me
            </MagneticButton>
            {hasCv && (
              <MagneticButton variant="ghost" href={links.cvPath}>
                Download CV
              </MagneticButton>
            )}
          </div>
        </Reveal>
      </div>
    </div>
  );
}
