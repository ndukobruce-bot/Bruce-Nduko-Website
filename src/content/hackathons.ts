export type Hackathon = {
  slug: string;
  name: string;
  year: string;
  description: string;
  items: string[];
};

export const hackathons: Hackathon[] = [
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
