export type ProjectStatus = "live" | "beta" | "in-build" | "concept";
export type ProjectCategory = "Web" | "Mobile" | "AI" | "Payments";

export type Project = {
  slug: string;
  name: string;
  oneLiner: string;
  problem: string | null;
  whatIBuilt: string;
  stack: string[];
  status: ProjectStatus;
  categories: ProjectCategory[];
  link?: string;
  isWebsite: boolean;
  // Lessons are only written when Bruce has actually written them.
  // Left as TODO rather than invented reflection.
  lessons?: string;
};

export const statusLabel: Record<ProjectStatus, string> = {
  live: "Live",
  beta: "Beta",
  "in-build": "In build",
  concept: "Concept",
};

export const projects: Project[] = [
  {
    slug: "allama",
    name: "Allama",
    oneLiner:
      "Productivity Passport — verifiable work records for informal-economy workers.",
    problem:
      "Informal-economy workers in Kenya have no verifiable record of the work they've actually done, which locks them out of loans, gigs, and formal opportunities.",
    whatIBuilt:
      "Allama turns M-Pesa SMS, job photos, and voice notes into a verifiable work record — a \"productivity passport.\" I led the build, security hardening, and deployment.",
    stack: ["Next.js", "Vercel", "GitHub Actions"],
    status: "live",
    categories: ["Web", "AI", "Payments"],
    link: "https://allama-theta.vercel.app",
    isWebsite: true,
  },
  {
    slug: "studysphere",
    name: "StudySphere",
    oneLiner:
      "Student productivity platform with an AI assistant, autopilot planner, and focus tools.",
    problem:
      "Students juggle deadlines, revision, and focus with scattered tools that don't talk to each other.",
    whatIBuilt:
      "A student productivity platform combining an AI assistant (\"Sage\"), an autopilot planner, a focus timer, and an exam mode. Shipped on both web and Android.",
    stack: ["Web", "Android", "AI assistant"],
    status: "live",
    categories: ["Web", "Mobile", "AI"],
    link: "https://studysphere.it.com",
    isWebsite: true,
  },
  {
    slug: "leveragex",
    name: "LeverageX",
    oneLiner: "Productivity and goal-tracking Android app, live on Google Play.",
    problem:
      "Most goal-tracking apps are either too rigid or too shallow to keep people accountable day to day.",
    whatIBuilt:
      "A productivity and goal-tracking Android app. I took it through Google Play Console closed testing all the way to production.",
    stack: ["Android", "Google Play Console"],
    status: "live",
    categories: ["Mobile"],
    link: "https://play.google.com/store/apps/details?id=com.leveragex.leveragex",
    isWebsite: false,
  },
  {
    slug: "ledger",
    name: "Ledger",
    oneLiner: "Chat-first AI career copilot.",
    problem: null, // not written up yet — Problem section hides until it is
    whatIBuilt: "A chat-first AI career copilot, currently in build.",
    stack: ["AI"],
    status: "in-build",
    categories: ["AI"],
    isWebsite: false,
  },
  {
    slug: "hali",
    name: "Hali",
    oneLiner:
      "Venue discovery and experience platform with personalized taste matching.",
    problem:
      "Finding a venue that actually fits your taste — not just what's popular — is hard, and existing apps don't learn what you like.",
    whatIBuilt:
      "A venue discovery and experience platform built around \"Taste DNA\" personalization and live venue intelligence (\"Hali Pulse\"). I wrote a full 21-section product requirements document and am building the Nairobi alpha.",
    stack: ["Next.js", "AI personalization"],
    status: "in-build",
    categories: ["Web", "AI"],
    isWebsite: false,
  },
  {
    slug: "a-inya",
    name: "A-Inya",
    oneLiner: "Nutrition app that helps you decide what to eat.",
    problem:
      "Deciding what to eat, every day, factoring in allergies and preferences, is a small but constant source of friction.",
    whatIBuilt:
      "A nutrition app that helps you decide what to eat based on a personal profile — favourite meals, allergies, and preferences.",
    stack: ["Mobile"],
    status: "in-build",
    categories: ["Mobile", "AI"],
    isWebsite: false,
  },
  {
    slug: "tija-billing-engine",
    name: "Tija Labs Billing Engine",
    oneLiner: "Full subscription invoicing and billing system.",
    problem:
      "Tija Labs needed to bill subscriptions and issue invoices without relying on a third-party SaaS billing platform.",
    whatIBuilt:
      "A complete subscription invoicing and billing system: Node.js/Express backend, SQLite storage, Pesapal API v3 for payments, PDF invoice generation with pdfkit, and email delivery via nodemailer. I evaluated payment gateway availability in Kenya and chose Pesapal.",
    stack: ["Node.js", "Express", "SQLite", "Pesapal API v3", "pdfkit", "nodemailer"],
    status: "live",
    categories: ["Payments", "Web"],
    isWebsite: false,
  },
  {
    slug: "tijalabs-site",
    name: "tijalabs.com",
    oneLiner: "Tija Labs' company website.",
    problem: "Tija Labs needed a public home with a working contact channel.",
    whatIBuilt:
      "The company website, on a custom domain, with contact form delivery and a blog.",
    stack: ["Web", "Custom domain"],
    status: "live",
    categories: ["Web"],
    link: "https://tijalabs.com",
    isWebsite: true,
  },
];

export const liveCheckTargets = projects
  .filter((p) => p.status === "live" && p.link)
  .map((p) => ({ slug: p.slug, url: p.link! }));
