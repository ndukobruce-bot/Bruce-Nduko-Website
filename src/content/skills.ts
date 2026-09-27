// Skills, grouped the way Bruce listed them. Every entry is a fact he gave
// directly (CV or chat) — nothing here is inferred, estimated, or invented.

export type SkillGroup = {
  label: string;
  items: string[];
};

export const skills: SkillGroup[] = [
  {
    label: "Languages",
    items: ["Python", "JavaScript", "C++", "CSS"],
  },
  {
    label: "Engineering",
    items: [
      "Node.js",
      "Express",
      "SQLite",
      "REST APIs",
      "Pesapal payments integration",
      "PDF & email automation",
    ],
  },
  {
    label: "AI",
    items: [
      "LLM-powered features",
      "ML fundamentals",
      "Computer vision",
      "AI-assisted development (Claude, Codex)",
    ],
  },
  {
    label: "Mobile & Web",
    items: ["Android app publishing (Google Play Console)", "Responsive web platforms"],
  },
  {
    label: "Infra & Security",
    items: [
      "Vercel",
      "GitHub Pages",
      "DNS & domains",
      "Secrets management",
      "Security hardening",
      "Kali Linux",
    ],
  },
  {
    label: "Product",
    items: ["PRDs", "Product concepting", "Engineering hiring specs", "Brand identity"],
  },
];
