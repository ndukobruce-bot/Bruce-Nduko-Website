import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { CommandPalette } from "@/components/command-palette";
import { CodeBackground } from "@/components/code-background";
import { profile } from "@/content/profile";

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

// Vercel sets this to the current production domain — a custom domain
// connected later is picked up automatically with no code change needed.
const siteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  title: `${profile.name} — ${profile.headline}`,
  description: profile.positioning,
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: `${profile.name} — ${profile.headline}`,
    description: profile.positioning,
    type: "website",
  },
};

export default function RootLayout({
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
        <main className="relative z-10 flex-1">{children}</main>
        <Footer />
        <CommandPalette />
      </body>
    </html>
  );
}
