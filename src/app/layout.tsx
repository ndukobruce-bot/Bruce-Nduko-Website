import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/nav";
import { CodeBackground } from "@/components/code-background";
import { profile } from "@/content/profile";
import { links } from "@/content/links";
import { SiteFooter } from "@/components/site-footer";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = links.siteUrl;

export const metadata: Metadata = {
  title: {
    default: `${profile.name} — ${profile.headline}`,
    template: `%s | ${profile.name}`,
  },
  description: profile.positioning,
  metadataBase: new URL(siteUrl),
  applicationName: profile.name,
  authors: [{ name: profile.name, url: siteUrl }],
  creator: profile.name,
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    title: `${profile.name} — ${profile.headline}`,
    description: profile.positioning,
    type: "website",
    url: siteUrl,
    siteName: profile.name,
    locale: "en_KE",
  },
  twitter: { card: "summary_large_image" },
};

const sameAs = [
  links.social.github,
  links.social.linkedin,
  links.social.x,
  "https://play.google.com/store/apps/details?id=com.leveragex.leveragex",
].filter(Boolean);

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${siteUrl}/#person`,
      name: profile.name,
      url: siteUrl,
      image: `${siteUrl}${profile.photo ?? "/bruce-nduko.jpg"}`,
      jobTitle: "Co-Founder & CTO",
      description: profile.positioning,
      email: `mailto:${profile.contact.email}`,
      worksFor: { "@type": "Organization", name: "Tija Labs", url: "https://tijalabs.com" },
      alumniOf: { "@type": "CollegeOrUniversity", name: "Zetech University" },
      address: { "@type": "PostalAddress", addressLocality: "Nairobi", addressCountry: "KE" },
      knowsAbout: ["Software engineering", "Artificial intelligence", "Product development", "Python", "Mobile apps"],
      sameAs,
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: profile.name,
      publisher: { "@id": `${siteUrl}/#person` },
    },
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      style={{ colorScheme: "dark" }}
      className={`${jakarta.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg text-text selection:bg-accent-rich selection:text-accent-ink">
        <CodeBackground />
        <Nav />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
        <main className="relative z-10 flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
