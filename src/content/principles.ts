// FLAGGED FOR REVIEW: the 6 principle titles were given by Bruce directly.
// The one-line subtext under each was drafted by Claude to match his voice
// elsewhere on the site (About page, profile.positioning) — please read
// through and edit before treating these as final.

export type Principle = {
  title: string;
  subtext: string;
};

export const principles: Principle[] = [
  {
    title: "Ship before it's perfect.",
    subtext: "A live product beats a polished plan — ship it, then improve it in public.",
  },
  {
    title: "Build for the person with the cheapest phone.",
    subtext: "If it's slow on a low-end Android over patchy network, it isn't done yet.",
  },
  {
    title: "Own the whole stack.",
    subtext: "Product, engineering, infrastructure, security — one person accountable end to end.",
  },
  {
    title: "Security is not a later problem.",
    subtext: "Hardening and secrets handling happen before launch, not after an incident.",
  },
  {
    title: "Proof beats promises.",
    subtext: "A working link, a leaderboard rank, a shipped feature — not a roadmap slide.",
  },
  {
    title: "Time is the product.",
    subtext: "Every tool I build should give someone back time they didn't have.",
  },
];
