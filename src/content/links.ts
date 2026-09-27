// Central place for the few things that aren't confirmed yet.
// Fill these in and the corresponding UI sections switch on automatically —
// nothing renders a fabricated value in the meantime.

export const links = {
  // GitHub username used to pull public activity (contributions, top
  // languages, recent pushes). Leave empty to hide the GitHub section
  // entirely rather than show fake or wrong data.
  githubUsername: "ndukobruce-bot",

  social: {
    github: "https://github.com/ndukobruce-bot",
    linkedin: "https://www.linkedin.com/in/brucenduko",
    x: "", // TODO: X / Twitter profile URL
  },

  // If /public/cv.pdf exists at build time, the CV link renders. If not,
  // it's hidden. Drop a real PDF at that path when ready.
  cvPath: "/cv.pdf",
} as const;
