import Image from "next/image";
import { ArrowDown, Mail } from "lucide-react";
import { profile } from "@/content/profile";
import { NairobiClock } from "@/components/nairobi-clock";
import { GrainGradient } from "@/components/grain-gradient";
import { MagneticButton } from "@/components/magnetic-button";
import { Monogram } from "@/components/monogram";
import { fileExistsInPublic } from "@/lib/files";

export function Hero() {
  const hasPhoto =
    profile.photo && fileExistsInPublic(profile.photo.replace(/^\//, ""));

  return (
    <section className="relative flex min-h-[88svh] flex-col justify-center overflow-hidden border-b border-border px-6 py-24">
      <GrainGradient />

      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div data-code-clear>
          <div className="mb-8">
            <NairobiClock />
          </div>

          <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-muted">
            {profile.headline}
          </p>

          <h1 className="shimmer-text max-w-4xl text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl">
            {profile.name}
          </h1>

          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted sm:text-xl">
            {profile.positioning}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <MagneticButton href="#work">
              See the work <ArrowDown size={15} />
            </MagneticButton>
            <MagneticButton href={`mailto:${profile.contact.email}`} variant="ghost">
              <Mail size={15} /> Get in touch
            </MagneticButton>
          </div>

          <p className="mt-6 text-sm text-muted">
            {profile.location} · {profile.region}
          </p>
        </div>

        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border">
          {hasPhoto ? (
            <Image
              src={profile.photo!}
              alt={profile.name}
              fill
              priority
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover"
            />
          ) : (
            <Monogram initials="BN" className="h-full w-full" />
          )}
        </div>
      </div>
    </section>
  );
}
