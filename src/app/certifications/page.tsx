import type { Metadata } from "next";
import { CertificationsGrid } from "@/components/certifications-grid";
import { certifications, getCertStats } from "@/content/certifications";
import { getCertificatePdf } from "@/lib/files";

export const metadata: Metadata = {
  title: "Certifications — Bruce Nduko",
  description:
    "Certifications and completed coursework from Codecademy and Udacity.",
};

export default function CertificationsPage() {
  const { total, totalHours, categoryCount } = getCertStats();

  const pdfHrefs = Object.fromEntries(
    certifications.map((c) => [c.title, getCertificatePdf(c.certificateUrl)])
  );

  return (
    <div className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div data-code-clear>
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-muted">
            Coursework &amp; credentials
          </p>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Certifications
          </h1>
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

        <div className="mt-12">
          <CertificationsGrid pdfHrefs={pdfHrefs} />
        </div>
      </div>
    </div>
  );
}
