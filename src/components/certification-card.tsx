import { ArrowUpRight } from "lucide-react";
import { formatCertMonth, type Certification } from "@/content/certifications";

export function CertificationCard({
  cert,
  pdfHref,
}: {
  cert: Certification;
  pdfHref?: string;
}) {
  return (
    <div className="group flex h-full flex-col justify-between rounded-2xl border border-border bg-surface p-6 transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:border-accent/50 hover:shadow-[0_16px_40px_-16px_var(--color-accent-rich)]">
      <div>
        <div className="flex items-center justify-between gap-3">
          <span className="font-mono text-xs uppercase tracking-[0.15em] text-muted">
            {cert.issuer}
          </span>
          <span className="rounded-full bg-surface-2 px-2 py-0.5 text-[11px] text-muted">
            {cert.category}
          </span>
        </div>
        <h3 className="mt-3 text-lg font-semibold tracking-tight">
          {cert.title}
        </h3>
      </div>

      <div className="mt-6 flex items-end justify-between gap-3">
        <p className="text-sm text-muted">
          {cert.hours !== null && <>{cert.hours} hrs &middot; </>}
          {formatCertMonth(cert.issued)}
        </p>
        {cert.verifyUrl ? (
          <a
            href={cert.verifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-accent transition-colors hover:underline"
          >
            Verify
            <ArrowUpRight size={13} />
          </a>
        ) : (
          pdfHref && (
            <a
              href={pdfHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-accent transition-colors hover:underline"
            >
              View certificate
              <ArrowUpRight size={13} />
            </a>
          )
        )}
      </div>
    </div>
  );
}
