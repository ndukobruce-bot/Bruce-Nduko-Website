export type Hackathon = {
  slug: string;
  name: string;
  year: string;
  description: string;
  items: string[];
  result?: string;
  link?: string;
  badge?: string;
};

export const hackathons: Hackathon[] = [
  {
    slug: "aws-trainium-frontier-competition",
    name: "AWS Trainium Frontier Competition",
    year: "2026",
    description:
      "Co-designing ML models and custom kernels on AWS Trainium2 chips, hosted by AWS Annapurna Labs.",
    items: [],
    result: "Ranked 14th on the Phase 1 public leaderboard",
    link: "https://trainium-frontier.devpost.com/",
    badge: "#14",
  },
  {
    slug: "build-with-gemini-xprize",
    name: "Build with Gemini XPRIZE",
    year: "2026",
    description: "Ten original productivity product concepts.",
    items: [
      "Stakes",
      "Sema Kazi",
      "Alongside",
      "Reflow",
      "Productivity Passport",
      // TODO: remaining 5 concepts from this hackathon
    ],
  },
  {
    slug: "qwen-cloud-hackathon",
    name: "Qwen Cloud Hackathon",
    year: "2026",
    description:
      "Build specs for Kenya's informal economy, written for Qwen Cloud.",
    items: [
      "Productivity Passport",
      "SHA Claims Pre-Check Agent",
      "Skill Verification Agent",
    ],
  },
];
