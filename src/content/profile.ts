// Source of truth for who Bruce is. Every field here is a fact he gave
// directly — nothing here is inferred, estimated, or invented. Fields with
// no confirmed fact are `null`; the UI must hide whatever depends on them
// rather than render a placeholder.

// Single source of truth for the graduation year — every place that shows
// it (education list, About page prose) reads from here.
const graduationYear = 2029;

export type IntroVideo = {
  src: string;
  poster?: string;
  captions?: string;
};

export const profile = {
  name: "Bruce Nduko",
  headline: "Co-Founder & CTO, Tija Labs",
  location: "Nairobi, Kenya",
  region: "East Africa",
  timezone: "Africa/Nairobi",
  tzAbbrev: "EAT",
  utcOffset: 3,

  graduationYear,

  education: [
    {
      credential: "BSc Computer Science",
      institution: "Zetech University",
      detail: `Class of ${graduationYear}`,
    },
    {
      credential: "Masters in Artificial Intelligence",
      institution: "Udacity",
      detail: "In progress",
    },
    {
      credential: "AI Programming with Python Nanodegree",
      institution: "Udacity",
      detail: "In progress",
    },
    {
      credential: "Microsoft AI-900: Azure AI Fundamentals",
      institution: "Microsoft",
      detail: "In progress",
    },
  ],

  positioning:
    "Founder-engineer building AI productivity tools for Africa's next billion workers. I design, build, and ship end-to-end — web, mobile, payments, AI.",

  contact: {
    email: "brucenduko@tijalabs.com",
    phoneDisplay: "+254 116 602 640",
    phoneWhatsApp: "254116602640",
  },

  // Real photo, already provided. Hero/About fall back to a monogram if
  // this is ever cleared.
  photo: "/bruce-nduko.jpg" as string | null,

  // Not provided yet — sections reading these stay hidden until they are.
  whyIBuild: null as string | null,
  introVideo: null as IntroVideo | null,
};
