// Only confirmed tools go here. A section with nothing confirmed yet is
// left out of the array entirely (filtered below) rather than shown with
// placeholder items — same convention as the rest of /content.

export type UsesItem = { name: string; note?: string };
export type UsesSection = { label: string; items: UsesItem[] };

const allSections: UsesSection[] = [
  {
    label: "Hardware",
    items: [{ name: "Windows", note: "OS" }],
  },
  {
    label: "Editor & terminal",
    items: [{ name: "VS Code" }],
  },
  {
    label: "AI tools",
    items: [{ name: "Claude" }, { name: "Codex" }],
  },
  {
    label: "Stack",
    items: [
      { name: "Next.js" },
      { name: "TypeScript" },
      { name: "Node.js" },
      { name: "Python" },
    ],
  },
  {
    label: "Deploy & infra",
    items: [{ name: "Vercel" }, { name: "GitHub" }, { name: "Namecheap" }],
  },
];

export const uses: UsesSection[] = allSections.filter((s) => s.items.length > 0);
