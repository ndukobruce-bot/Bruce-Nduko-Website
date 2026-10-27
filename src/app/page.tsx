import Image from "next/image";
import { profile } from "@/content/profile";
import { projects } from "@/content/projects";
import { certifications } from "@/content/certifications";
import { fileExistsInPublic } from "@/lib/files";
import { ContactDialog } from "@/components/contact-dialog";

export default function Home() {
  const hasPhoto =
    profile.photo && fileExistsInPublic(profile.photo.replace(/^\//, ""));

  return (
    <div className="mx-auto max-w-4xl px-6 py-16 sm:py-24">
      <section className="flex flex-col-reverse items-start gap-10 sm:flex-row sm:items-center sm:justify-between sm:gap-12">
        <div data-code-clear className="max-w-2xl rounded-2xl bg-bg/75 p-5 backdrop-blur-[2px] sm:p-7">
          <p className="text-sm font-medium text-accent">{profile.location}</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-6xl">
            {profile.name}
          </h1>
          <p className="mt-4 text-lg text-muted">{profile.headline}</p>
          <p className="mt-6 max-w-xl leading-7 text-muted">
            I’m building systems that make Africa’s next billion workers
            impossible to ignore, one well-placed semicolon at a time. I turn
            ambitious ideas into practical products, bringing together code,
            AI, and product thinking to solve problems that matter. I write
            Python to turn raw data into decisions and prototypes into tools
            people can use.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <ContactDialog />
          </div>
        </div>
        {hasPhoto && (
          <Image
            src={profile.photo!}
            alt={`${profile.name}, ${profile.headline}`}
            width={192}
            height={192}
            priority
            className="size-36 rounded-full object-cover object-[center_24%] sm:size-48"
          />
        )}
      </section>

      <section className="mt-20 border-t border-border pt-10" aria-labelledby="work-heading">
        <h2 id="work-heading" className="text-2xl font-semibold tracking-tight">Projects</h2>
        {(["Mobile apps", "Websites"] as const).map((group) => {
          const items = projects.filter((project) =>
            group === "Websites" ? project.isWebsite : !project.isWebsite
          );
          return (
            <div key={group} className="mt-8">
              <h3 className="text-lg font-medium">{group}</h3>
              <ul className="mt-3 divide-y divide-border">
                {items.map((project) => (
                  <li key={project.slug} className="py-4">
                    {project.link ? (
                      <a className="font-medium hover:text-accent" href={project.link} target="_blank" rel="noopener noreferrer">{project.name}</a>
                    ) : (
                      <span className="font-medium">{project.name}</span>
                    )}
                    <p className="mt-1 text-sm text-muted">{project.oneLiner}</p>
                    <p className="mt-1 text-xs text-muted">{project.status === "in-build" ? "In progress" : project.status === "live" ? "Live" : project.status}</p>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </section>

      <section className="mt-16 border-t border-border pt-10" aria-labelledby="education-heading">
        <h2 id="education-heading" className="text-2xl font-semibold tracking-tight">Education</h2>
        <ul className="mt-5 space-y-3 text-muted">
          {profile.education.map((item) => (
            <li key={item.credential}>
              <span className="font-medium text-text">{item.credential}</span>{item.institution ? ` · ${item.institution}` : ""} · {item.detail}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-16 border-t border-border pt-10" aria-labelledby="certifications-heading">
        <h2 id="certifications-heading" className="text-2xl font-semibold tracking-tight">Certifications</h2>
        <p className="mt-2 text-sm text-muted">{certifications.length} certificates and courses in AI, engineering, cloud, security, and programming.</p>
        <ul className="mt-5 grid gap-x-8 divide-y divide-border sm:grid-cols-2 sm:divide-y-0">
          {certifications.map((certificate) => (
            <li key={certificate.title} className="border-b border-border py-3 text-sm">
              <span className="font-medium">{certificate.title}</span>
              <span className="mt-1 block text-muted">{certificate.issuer} · {certificate.category}</span>
              {certificate.certificateUrl && (
                <a className="mt-1 inline-block text-accent hover:underline" href={certificate.certificateUrl}>View certificate</a>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section id="contact" className="mt-16 border-t border-border pt-10" aria-labelledby="contact-heading">
        <h2 id="contact-heading" className="text-2xl font-semibold tracking-tight">Contact</h2>
        <div className="mt-4 flex flex-col items-start gap-2 text-muted sm:flex-row sm:gap-6">
          <a className="hover:text-accent" href={`mailto:${profile.contact.email}`}>{profile.contact.email}</a>
          <a className="hover:text-accent" href={`tel:+${profile.contact.phoneWhatsApp}`}>{profile.contact.phoneDisplay}</a>
        </div>
      </section>
    </div>
  );
}
