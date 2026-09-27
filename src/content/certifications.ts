// Certification data — every fact below (title, issuer, hours, issue date,
// category, verify link) is exactly as confirmed. Hours are null where no
// hour count was given; verifyUrl is null where no verification link
// exists yet — never invented.

export type CertIssuer = "Codecademy" | "Udacity";
export type CertCategory =
  | "AI & Data"
  | "Engineering"
  | "Security & Cloud"
  | "Languages";

export type Certification = {
  title: string;
  issuer: CertIssuer;
  hours: number | null;
  issued: string; // ISO date, YYYY-MM-DD
  category: CertCategory;
  verifyUrl: string | null;
  // Path under /public to a certificate PDF, when one exists to link —
  // separate from verifyUrl, which is an online verification page.
  certificateUrl?: string | null;
};

const allCertifications: Certification[] = [
  {
    title:
      "AWS AI Practitioner Challenge — Verified Certificate of Course Completion",
    issuer: "Udacity",
    hours: null,
    issued: "2026-06-18",
    category: "AI & Data",
    verifyUrl: null, // TODO: add once available
    certificateUrl: "/certificates/aws-ai-practitioner-challenge.pdf",
  },
  // AI & Data — Codecademy
  {
    title: "Data Scientist: Natural Language Processing Specialist",
    issuer: "Codecademy",
    hours: null,
    issued: "2026-07-31",
    category: "AI & Data",
    verifyUrl: null,
  },
  {
    title: "Data Scientist: Machine Learning Specialist",
    issuer: "Codecademy",
    hours: 90,
    issued: "2026-06-15",
    category: "AI & Data",
    verifyUrl: null,
  },
  {
    title: "Deep Learning & Neural Networks",
    issuer: "Codecademy",
    hours: 50,
    issued: "2026-05-12",
    category: "AI & Data",
    verifyUrl: null,
  },
  {
    title: "Prompt Engineering Specialist",
    issuer: "Codecademy",
    hours: 20,
    issued: "2026-04-10",
    category: "AI & Data",
    verifyUrl: null,
  },
  {
    title: "Data Analyst",
    issuer: "Codecademy",
    hours: 70,
    issued: "2026-06-28",
    category: "AI & Data",
    verifyUrl: null,
  },
  {
    title: "Business Intelligence Analytics",
    issuer: "Codecademy",
    hours: 45,
    issued: "2026-07-10",
    category: "AI & Data",
    verifyUrl: null,
  },
  {
    title: "Analyze Financial Data with Python",
    issuer: "Codecademy",
    hours: 26,
    issued: "2026-05-31",
    category: "AI & Data",
    verifyUrl: null,
  },
  // Engineering — Codecademy
  {
    title: "Full-Stack Engineer",
    issuer: "Codecademy",
    hours: 140,
    issued: "2026-09-15",
    category: "Engineering",
    verifyUrl: null,
  },
  {
    title: "Front-End Engineer",
    issuer: "Codecademy",
    hours: 115,
    issued: "2026-08-14",
    category: "Engineering",
    verifyUrl: null,
  },
  {
    title: "Back-End Engineer",
    issuer: "Codecademy",
    hours: 105,
    issued: "2026-08-30",
    category: "Engineering",
    verifyUrl: null,
  },
  {
    title: "DevOps Engineer",
    issuer: "Codecademy",
    hours: 75,
    issued: "2026-04-28",
    category: "Engineering",
    verifyUrl: null,
  },
  // Security & Cloud — Codecademy
  {
    title: "Cloud Architecture - AWS Specialist",
    issuer: "Codecademy",
    hours: 65,
    issued: "2026-03-22",
    category: "Security & Cloud",
    verifyUrl: null,
  },
  {
    title: "Ethical Hacking & Penetration Testing",
    issuer: "Codecademy",
    hours: 55,
    issued: "2026-02-14",
    category: "Security & Cloud",
    verifyUrl: null,
  },
  {
    title: "Systems & Linux Administration",
    issuer: "Codecademy",
    hours: 40,
    issued: "2026-03-05",
    category: "Security & Cloud",
    verifyUrl: null,
  },
  {
    title: "Cybersecurity Fundamentals",
    issuer: "Codecademy",
    hours: 35,
    issued: "2026-01-18",
    category: "Security & Cloud",
    verifyUrl: null,
  },
  // Languages — Codecademy
  {
    title: "Learn Python 3",
    issuer: "Codecademy",
    hours: 25,
    issued: "2026-01-10",
    category: "Languages",
    verifyUrl: null,
  },
  {
    title: "Learn JavaScript",
    issuer: "Codecademy",
    hours: 30,
    issued: "2026-01-25",
    category: "Languages",
    verifyUrl: null,
  },
  {
    title: "Learn C++",
    issuer: "Codecademy",
    hours: 35,
    issued: "2026-02-28",
    category: "Languages",
    verifyUrl: null,
  },
  {
    title: "Learn SQL & Relational Databases",
    issuer: "Codecademy",
    hours: 20,
    issued: "2026-03-15",
    category: "Languages",
    verifyUrl: null,
  },
  {
    title: "Learn Go",
    issuer: "Codecademy",
    hours: 30,
    issued: "2026-05-02",
    category: "Languages",
    verifyUrl: null,
  },
  {
    title: "Learn TypeScript",
    issuer: "Codecademy",
    hours: 22,
    issued: "2026-05-18",
    category: "Languages",
    verifyUrl: null,
  },
];

function formatIsoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

// Safety rule: never render a future-dated certificate, no matter what
// gets added above.
const today = formatIsoDate(new Date());
export const certifications: Certification[] = allCertifications.filter(
  (c) => c.issued <= today
);

export function formatCertMonth(issued: string): string {
  const [year, month] = issued.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, 1));
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export function getCertStats(list: Certification[] = certifications) {
  return {
    total: list.length,
    totalHours: list.reduce((sum, c) => sum + (c.hours ?? 0), 0),
    categoryCount: new Set(list.map((c) => c.category)).size,
  };
}
