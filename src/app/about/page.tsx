import type { Metadata } from "next";
import Image from "next/image";
import { profile } from "@/content/profile";
import { tija } from "@/content/tija";
import { links } from "@/content/links";
import { skills } from "@/content/skills";
import { Reveal } from "@/components/reveal";
import { MagneticButton } from "@/components/magnetic-button";
import { fileExistsInPublic } from "@/lib/files";
import { i18n, pick, fill } from "@/content/i18n";
import { getLang } from "@/lib/lang";

export const metadata: Metadata = {
  title: "About — Bruce Nduko",
  description: profile.positioning,
};

export default async function AboutPage() {
  const lang = await getLang();
  const hasCv = fileExistsInPublic("cv.pdf");
  const hasPhoto = profile.photo && fileExistsInPublic(profile.photo.replace(/^\//, ""));

  const paragraph1 = fill(pick(lang, i18n.about.paragraph1), {
    location: profile.location,
    credential: profile.education[0].credential,
    institution: profile.education[0].institution,
    detail: profile.education[0].detail,
    credential2: profile.education[1].credential,
    institution2: profile.education[1].institution,
    detail2: profile.education[1].detail,
  });
  const paragraph2 = fill(pick(lang, i18n.about.paragraph2), {
    tijaName: tija.name,
    role: tija.myRole.toLowerCase(),
  });
  const paragraph3 = pick(lang, i18n.about.paragraph3);

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
            {pick(lang, i18n.about.kicker)}
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
            <p>{paragraph1}</p>
            <p>{paragraph2}</p>
            <p>{paragraph3}</p>
          </div>
        </Reveal>
        </div>

        <Reveal delay={0.1}>
          <div className="mt-14">
            <h2 className="text-xs font-medium uppercase tracking-wide text-muted">
              {pick(lang, i18n.about.education)}
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
              {pick(lang, i18n.about.skills)}
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
              {pick(lang, i18n.about.emailMe)}
            </MagneticButton>
            {hasCv && (
              <MagneticButton variant="ghost" href={links.cvPath}>
                {pick(lang, i18n.about.downloadCv)}
              </MagneticButton>
            )}
          </div>
        </Reveal>
      </div>
    </div>
  );
}
