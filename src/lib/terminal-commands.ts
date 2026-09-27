// Pure command engine for /terminal — every line of output is built from
// the same /content files the rest of the site reads from. Nothing here
// is hard-coded or invented; if a fact isn't in /content, the command
// simply doesn't print it.

import { profile } from "@/content/profile";
import { projects, statusLabel } from "@/content/projects";
import { certifications, getCertStats, formatCertMonth } from "@/content/certifications";
import { hackathons } from "@/content/hackathons";
import { skills } from "@/content/skills";
import { links } from "@/content/links";

export type TerminalLine = {
  text: string;
  tone?: "muted" | "accent" | "error";
};

export type CommandResult = {
  lines: TerminalLine[];
  action?: "clear" | "exit" | "open";
  openUrl?: string;
};

export const COMMAND_NAMES = [
  "help",
  "whoami",
  "projects",
  "project",
  "certs",
  "hackathons",
  "stack",
  "cv",
  "contact",
  "socials",
  "clear",
  "exit",
  "sudo",
] as const;

export function runCommand(raw: string, opts: { hasCv: boolean }): CommandResult {
  const trimmed = raw.trim();
  if (!trimmed) return { lines: [] };

  const [cmd, ...rest] = trimmed.split(/\s+/);
  const arg = rest.join(" ");
  const lower = cmd.toLowerCase();

  switch (lower) {
    case "help":
      return { lines: helpLines() };
    case "whoami":
      return { lines: whoamiLines() };
    case "projects":
      return { lines: projectsLines() };
    case "project":
      return { lines: projectDetailLines(arg) };
    case "certs":
      return { lines: certsLines() };
    case "hackathons":
      return { lines: hackathonsLines() };
    case "stack":
      return { lines: stackLines() };
    case "cv":
      return cvResult(opts.hasCv);
    case "contact":
      return { lines: contactLines() };
    case "socials":
      return { lines: socialsLines() };
    case "clear":
      return { lines: [], action: "clear" };
    case "exit":
      return { lines: [{ text: "Goodbye." }], action: "exit" };
    case "sudo":
      if (arg.toLowerCase() === "hire-bruce") return sudoHireBruce();
      return {
        lines: [{ text: `sudo: ${arg || "(no argument)"}: command not found`, tone: "error" }],
      };
    default:
      return {
        lines: [
          {
            text: `command not found: ${cmd}. Type 'help' for a list of commands.`,
            tone: "error",
          },
        ],
      };
  }
}

function helpLines(): TerminalLine[] {
  const rows: [string, string][] = [
    ["help", "list available commands"],
    ["whoami", "who I am"],
    ["projects", "list all projects"],
    ["project <name>", "show details for one project"],
    ["certs", "certifications — stats and full list"],
    ["hackathons", "hackathons and competitions"],
    ["stack", "tech stack and skills"],
    ["cv", "open my CV"],
    ["contact", "how to reach me"],
    ["socials", "social links"],
    ["clear", "clear the screen"],
    ["exit", "back to the site"],
  ];
  return rows.map(([c, d]) => ({ text: `  ${c.padEnd(18)} ${d}` }));
}

function whoamiLines(): TerminalLine[] {
  return [
    { text: profile.name, tone: "accent" },
    { text: profile.headline },
    { text: profile.location },
    { text: "" },
    { text: profile.positioning, tone: "muted" },
  ];
}

function projectsLines(): TerminalLine[] {
  const header: TerminalLine = {
    text: `${projects.length} projects — type 'project <name>' for details`,
    tone: "muted",
  };
  const rows = projects.map((p) => ({
    text: `  ${p.name.padEnd(24)} ${statusLabel[p.status].padEnd(10)} ${p.oneLiner}`,
  }));
  return [header, { text: "" }, ...rows];
}

function projectDetailLines(arg: string): TerminalLine[] {
  if (!arg) return [{ text: "usage: project <name>", tone: "error" }];
  const needle = arg.toLowerCase();
  const found = projects.find(
    (p) =>
      p.slug.toLowerCase() === needle ||
      p.name.toLowerCase() === needle ||
      p.name.toLowerCase().includes(needle)
  );
  if (!found) {
    return [
      { text: `project not found: ${arg}. Type 'projects' to list them.`, tone: "error" },
    ];
  }

  const lines: TerminalLine[] = [
    { text: found.name, tone: "accent" },
    { text: found.oneLiner },
    { text: "" },
    { text: `status: ${statusLabel[found.status]}` },
    { text: `categories: ${found.categories.join(", ")}` },
    { text: `stack: ${found.stack.join(", ")}` },
  ];
  if (found.problem) {
    lines.push({ text: "" }, { text: `problem: ${found.problem}`, tone: "muted" });
  }
  lines.push({ text: "" }, { text: found.whatIBuilt, tone: "muted" });
  if (found.link) {
    lines.push({ text: "" }, { text: `link: ${found.link}`, tone: "accent" });
  }
  return lines;
}

function certsLines(): TerminalLine[] {
  const { total, totalHours, categoryCount } = getCertStats();
  const header: TerminalLine[] = [
    { text: `${total} certificates · ${totalHours} hours · ${categoryCount} categories`, tone: "accent" },
    { text: "" },
  ];

  const byCategory = new Map<string, typeof certifications>();
  for (const c of certifications) {
    const list = byCategory.get(c.category) ?? [];
    list.push(c);
    byCategory.set(c.category, list);
  }

  const body: TerminalLine[] = [];
  for (const [category, list] of byCategory) {
    body.push({ text: category, tone: "muted" });
    for (const c of list) {
      const hrs = c.hours !== null ? `${c.hours}h` : "—";
      body.push({
        text: `  ${c.title.padEnd(50)} ${hrs.padEnd(6)} ${formatCertMonth(c.issued)}`,
      });
    }
    body.push({ text: "" });
  }
  return [...header, ...body];
}

function hackathonsLines(): TerminalLine[] {
  return hackathons.flatMap((h) => {
    const lines: TerminalLine[] = [
      { text: `${h.name}${h.badge ? ` ${h.badge}` : ""} (${h.year})`, tone: "accent" },
      { text: h.description, tone: "muted" },
    ];
    if (h.result) lines.push({ text: h.result });
    if (h.link) lines.push({ text: h.link, tone: "muted" });
    lines.push({ text: "" });
    return lines;
  });
}

function stackLines(): TerminalLine[] {
  return skills.flatMap((g) => [
    { text: g.label, tone: "accent" },
    { text: `  ${g.items.join(", ")}`, tone: "muted" },
    { text: "" },
  ]);
}

function cvResult(hasCv: boolean): CommandResult {
  if (!hasCv) return { lines: [{ text: "CV not available yet.", tone: "error" }] };
  return {
    lines: [{ text: "Opening CV…", tone: "accent" }],
    action: "open",
    openUrl: links.cvPath,
  };
}

function contactLines(): TerminalLine[] {
  return [
    { text: `email: ${profile.contact.email}`, tone: "accent" },
    { text: `phone: ${profile.contact.phoneDisplay}` },
    { text: `whatsapp: https://wa.me/${profile.contact.phoneWhatsApp}` },
  ];
}

function socialsLines(): TerminalLine[] {
  const lines: TerminalLine[] = [];
  if (links.social.github) lines.push({ text: `github: ${links.social.github}` });
  if (links.social.linkedin) lines.push({ text: `linkedin: ${links.social.linkedin}` });
  if (links.social.x) lines.push({ text: `x: ${links.social.x}` });
  if (lines.length === 0) return [{ text: "No social links yet.", tone: "muted" }];
  return lines;
}

function sudoHireBruce(): CommandResult {
  return {
    lines: [
      { text: "Permission granted.", tone: "accent" },
      { text: "Initiating hire sequence for Bruce Nduko..." },
      { text: "Opening email client..." },
    ],
    action: "open",
    openUrl: `mailto:${profile.contact.email}?subject=${encodeURIComponent("Let's work together")}`,
  };
}
