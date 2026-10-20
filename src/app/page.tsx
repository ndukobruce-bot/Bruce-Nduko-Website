import Image from "next/image";
import Link from "next/link";
import { profile } from "@/content/profile";
import { projects } from "@/content/projects";
import { links } from "@/content/links";
import { fileExistsInPublic } from "@/lib/files";

export default function Home() {
  const hasPhoto =
    profile.photo && fileExistsInPublic(profile.photo.replace(/^\//, ""));

  return (
    <div className="mx-auto max-w-4xl px-6 py-16 sm:py-24">
      <section className="flex flex-col-reverse items-start gap-10 sm:flex-row sm:items-center sm:justify-between sm:gap-12">
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-accent">{profile.location}</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-6xl">
            {profile.name}
          </h1>
          <p className="mt-4 text-lg text-muted">{profile.headline}</p>
          <p className="mt-6 max-w-xl leading-7 text-muted">
            I build useful technology and lead product work. I have completed
            the AI Programming with Python Nanodegree and am now pursuing an MBA
            in AI Product Management.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a className="rounded-md bg-accent-rich px-5 py-3 text-sm font-medium text-accent-ink hover:opacity-90" href={`mailto:${profile.contact.email}`}>
              Get in touch
            </a>
            {links.social.linkedin && (
              <a className="rounded-md border border-border px-5 py-3 text-sm font-medium hover:border-accent" href={links.social.linkedin} target="_blank" rel="noopener noreferrer">
                LinkedIn
              </a>
            )}
          </div>
        </div>
        {hasPhoto && (
          <Image
            src={profile.photo!}
            alt={profile.name}
            width={192}
            height={192}
            priority
            className="size-36 rounded-full object-cover sm:size-48"
          />
        )}
      </section>

      <section className="mt-20 border-t border-border pt-10" aria-labelledby="work-heading">
        <h2 id="work-heading" className="text-2xl font-semibold tracking-tight">Selected work</h2>
        <ul className="mt-5 divide-y divide-border">
          {projects.slice(0, 4).map((project) => (
            <li key={project.slug} className="py-4">
              <Link className="font-medium hover:text-accent" href={`/projects/${project.slug}`}>
                {project.name}
              </Link>
              <p className="mt-1 text-sm text-muted">{project.oneLiner}</p>
            </li>
          ))}
        </ul>
        <Link className="mt-4 inline-block text-sm font-medium text-accent hover:underline" href="/projects">
          View all projects →
        </Link>
      </section>

      <section className="mt-16 border-t border-border pt-10" aria-labelledby="education-heading">
        <h2 id="education-heading" className="text-2xl font-semibold tracking-tight">Education</h2>
        <ul className="mt-5 space-y-3 text-muted">
          {profile.education.map((item) => (
            <li key={item.credential}>
              <span className="font-medium text-text">{item.credential}</span> · {item.institution} · {item.detail}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
