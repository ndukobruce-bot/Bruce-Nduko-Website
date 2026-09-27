// Dated milestones, newest first. Only entries with a real, known date are
// shown as "dated" — entries with date: null are real (they happened) but
// the exact date isn't confirmed yet, so they render grouped under
// "Earlier" instead of a guessed date.

export type ShipLogEntry = {
  date: string | null; // ISO date, a bare year, or null if the date isn't confirmed yet
  title: string;
  description: string;
  link?: string;
  projectSlug?: string;
};

export const shiplog: ShipLogEntry[] = [
  {
    date: "2026",
    title: "Qwen Cloud Hackathon",
    description:
      "Wrote build specs for Productivity Passport, a SHA Claims Pre-Check Agent, and a Skill Verification Agent — all targeting Kenya's informal economy.",
  },
  {
    date: "2026",
    title: "Build with Gemini XPRIZE",
    description:
      "Shipped ten original productivity product concepts, including Stakes, Sema Kazi, Alongside, Reflow, and Productivity Passport.",
  },
  {
    date: null,
    title: "LeverageX live on Google Play",
    description:
      "Took LeverageX through Play Console closed testing to full production access.",
    link: "https://play.google.com/store/apps/details?id=com.leveragex.leveragex",
    projectSlug: "leveragex",
  },
  {
    date: null,
    title: "StudySphere launched",
    description: "Shipped at studysphere.it.com, on Vercel with a custom domain.",
    link: "https://studysphere.it.com",
    projectSlug: "studysphere",
  },
  {
    date: null,
    title: "Allama deployed",
    description: "Shipped at allama-theta.vercel.app.",
    link: "https://allama-theta.vercel.app",
    projectSlug: "allama",
  },
  {
    date: null,
    title: "tijalabs.com launched",
    description: "Tija Labs' company site went live on a custom domain.",
    link: "https://tijalabs.com",
    projectSlug: "tijalabs-site",
  },
  {
    date: null,
    title: "Tija Labs Billing Engine built",
    description:
      "Shipped the company's own subscription invoicing and billing system — Node.js/Express, SQLite, Pesapal API v3, PDF invoicing, automated email.",
    projectSlug: "tija-billing-engine",
  },
];
