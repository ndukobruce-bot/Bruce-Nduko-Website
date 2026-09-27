import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { certifications, getCertStats } from "@/content/certifications";
import { CertificationCard } from "@/components/certification-card";
import { Reveal, RevealGroup, RevealItem, revealItem } from "@/components/reveal";
import { getCertificatePdf } from "@/lib/files";

export function Certifications() {
  const { total, totalHours, categoryCount } = getCertStats();

  const topSix = [...certifications]
    .filter((c): c is typeof c & { hours: number } => c.hours !== null)
    .sort((a, b) => b.hours - a.hours)
    .slice(0, 6);

  return (
    <section id="certifications" className="border-b border-border px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-muted">
                Certifications
              </p>
              <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                Always <span className="text-accent">learning</span>
              </h2>
              <div className="mt-5 flex flex-wrap gap-6 text-sm text-muted">
                <span>
                  <span className="font-mono text-lg font-semibold text-accent">
                    {total}
                  </span>{" "}
                  certificates
                </span>
                <span>
                  <span className="font-mono text-lg font-semibold text-accent">
                    {totalHours}
                  </span>{" "}
                  hours of learning
                </span>
                <span>
                  <span className="font-mono text-lg font-semibold text-accent">
                    {categoryCount}
                  </span>{" "}
                  categories
                </span>
              </div>
            </div>
            <Link
              href="/certifications"
              className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-accent"
            >
              See all certifications
              <ArrowUpRight size={14} />
            </Link>
          </div>
        </Reveal>

        <RevealGroup className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {topSix.map((cert) => (
            <RevealItem key={`${cert.issuer}-${cert.title}`} variants={revealItem}>
              <CertificationCard cert={cert} pdfHref={getCertificatePdf(cert.certificateUrl)} />
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
