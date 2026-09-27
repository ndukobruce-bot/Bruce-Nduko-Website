// FLAGGED FOR REVIEW: these Kiswahili translations were drafted by Claude,
// not by a native speaker. Please have someone fluent check wording, tone,
// and idiom before treating this as final — especially the longer About
// page paragraphs and the hero bio.
//
// Scope: nav, footer, section headings/kickers, buttons, stat labels, the
// hero bio, and the About page prose. Project names, tech/stack names,
// certificate titles, and content taxonomy (categories, statuses) are
// intentionally left in English throughout the site.

export type Lang = "en" | "sw";

export const LANG_COOKIE = "lang";

type Pair = { en: string; sw: string };

export const i18n = {
  nav: {
    work: { en: "Work", sw: "Kazi" } as Pair,
    tijaLabs: { en: "Tija Labs", sw: "Tija Labs" } as Pair,
    about: { en: "About", sw: "Kuhusu" } as Pair,
    now: { en: "Now", sw: "Sasa" } as Pair,
    certifications: { en: "Certifications", sw: "Vyeti" } as Pair,
    terminal: { en: "Terminal", sw: "Terminal" } as Pair,
    principles: { en: "Principles", sw: "Kanuni" } as Pair,
    contact: { en: "Contact", sw: "Wasiliana" } as Pair,
  },
  footer: {
    projects: { en: "Projects", sw: "Miradi" } as Pair,
    certifications: { en: "Certifications", sw: "Vyeti" } as Pair,
    about: { en: "About", sw: "Kuhusu" } as Pair,
    now: { en: "Now", sw: "Sasa" } as Pair,
    terminal: { en: "Terminal", sw: "Terminal" } as Pair,
    principles: { en: "Principles", sw: "Kanuni" } as Pair,
    uses: { en: "Uses", sw: "Zana" } as Pair,
    email: { en: "Email", sw: "Barua pepe" } as Pair,
  },
  hero: {
    ctaWork: { en: "See the work", sw: "Angalia kazi yangu" } as Pair,
    ctaContact: { en: "Get in touch", sw: "Wasiliana nami" } as Pair,
    // The bio itself — mirrors profile.positioning in meaning, not a literal
    // word-for-word translation.
    bio: {
      en: "Founder-engineer building AI productivity tools for Africa's next billion workers. I design, build, and ship end-to-end — web, mobile, payments, AI.",
      sw: "Mjasiriamali na mhandisi ninayejenga zana za tija za AI kwa kizazi kijacho cha wafanyakazi bilioni moja barani Afrika. Ninabuni, kujenga, na kuzindua kikamilifu — mtandao, simu, malipo, na AI.",
    } as Pair,
  },
  tijaSpotlight: {
    kicker: { en: "The main thing", sw: "Jambo kuu" } as Pair,
    myRole: { en: "My role", sw: "Nafasi yangu" } as Pair,
    cofounder: { en: "Co-founder", sw: "Mwanzilishi mwenzangu" } as Pair,
    stage: { en: "Stage", sw: "Hatua" } as Pair,
  },
  selectedWork: {
    kicker: { en: "Selected work", sw: "Kazi zilizochaguliwa" } as Pair,
    headingPrefix: { en: "Things I've ", sw: "Vitu ambavyo " } as Pair,
    headingEmphasis: { en: "shipped", sw: "nimezindua" } as Pair,
    ctaAll: { en: "All projects", sw: "Miradi yote" } as Pair,
  },
  websitesStrip: {
    kicker: { en: "Websites I've built", sw: "Tovuti nilizojenga" } as Pair,
  },
  certifications: {
    kicker: { en: "Certifications", sw: "Vyeti" } as Pair,
    headingPrefix: { en: "Always ", sw: "Ninaendelea " } as Pair,
    headingEmphasis: { en: "learning", sw: "kujifunza" } as Pair,
    statCertificates: { en: "certificates", sw: "vyeti" } as Pair,
    statHours: { en: "hours of learning", sw: "masaa ya kujifunza" } as Pair,
    statCategories: { en: "categories", sw: "makundi" } as Pair,
    ctaSeeAll: { en: "See all certifications", sw: "Tazama vyeti vyote" } as Pair,
    pageKicker: { en: "Coursework & credentials", sw: "Masomo na vyeti" } as Pair,
    pageH1: { en: "Certifications", sw: "Vyeti" } as Pair,
    filterAll: { en: "All", sw: "Vyote" } as Pair,
    emptyState: {
      en: "No certifications match that filter.",
      sw: "Hakuna vyeti vinavyolingana na kichujio hicho.",
    } as Pair,
    verify: { en: "Verify", sw: "Thibitisha" } as Pair,
    viewCertificate: { en: "View certificate", sw: "Tazama cheti" } as Pair,
  },
  projects: {
    pageKicker: { en: "Everything I've built", sw: "Kila kitu ambacho nimejenga" } as Pair,
    pageH1: { en: "Projects", sw: "Miradi" } as Pair,
    filterAllStatuses: { en: "All statuses", sw: "Hali zote" } as Pair,
    filterAllCategories: { en: "All categories", sw: "Makundi yote" } as Pair,
    emptyState: {
      en: "No projects match those filters.",
      sw: "Hakuna miradi inayolingana na vichujio hivyo.",
    } as Pair,
  },
  hackathons: {
    kicker: { en: "Hackathons & build sprints", sw: "Mashindano ya hackathon" } as Pair,
  },
  about: {
    kicker: { en: "About", sw: "Kuhusu" } as Pair,
    education: { en: "Education", sw: "Elimu" } as Pair,
    skills: { en: "Skills", sw: "Ujuzi" } as Pair,
    emailMe: { en: "Email me", sw: "Nitumie barua pepe" } as Pair,
    downloadCv: { en: "Download CV", sw: "Pakua CV" } as Pair,
    // {location}/{credential}/{institution}/{detail}/{credential2}/{institution2}/
    // {detail2}/{tijaName}/{role} are substituted in from profile/tija data —
    // never invented, always the same facts as the English version.
    paragraph1: {
      en: "I'm a student and founder based in {location}. I'm reading {credential} at {institution} ({detail}), and separately working through {institution2}'s {credential2} ({detail2}).",
      sw: "Mimi ni mwanafunzi na mjasiriamali ninayeishi {location}. Ninasoma {credential} katika {institution} ({detail}), na kwa upande mwingine ninasomea {credential2} kupitia {institution2} ({detail2}).",
    } as Pair,
    paragraph2: {
      en: "I care about the informal economy and productivity because that's where most of the work in Kenya actually happens, and it's the part of the economy that has the least tooling built for it. At {tijaName} I'm {role}",
      sw: "Ninajali kuhusu uchumi wa kawaida na tija kwa sababu hapo ndipo kazi nyingi nchini Kenya hufanyika, na ni sehemu ya uchumi iliyo na zana chache zilizojengwa kwa ajili yake. Katika {tijaName} mimi ni {role}",
    } as Pair,
    paragraph3: {
      en: "I design, build, and ship end-to-end: product decisions, engineering, infrastructure, and deployment. I work AI-assisted — pairing with tools like Claude and Codex to move fast — but I own the architecture, the security, and the decisions myself.",
      sw: "Ninabuni, kujenga, na kuzindua kutoka mwanzo hadi mwisho: maamuzi ya bidhaa, uhandisi, miundombinu, na uzinduzi. Ninafanya kazi kwa msaada wa AI — nikitumia zana kama Claude na Codex ili kwenda kwa kasi — lakini ninamiliki muundo, usalama, na maamuzi mwenyewe.",
    } as Pair,
  },
  aboutTeaser: {
    kicker: { en: "About", sw: "Kuhusu" } as Pair,
    ctaMore: { en: "More about how I work", sw: "Zaidi kuhusu jinsi ninavyofanya kazi" } as Pair,
    // {location}/{credential}/{institution}/{detail} substituted from profile.
    bio: {
      en: "I'm a founder-engineer based in {location}, studying {credential} at {institution} ({detail}), and building AI productivity tools for Africa's next billion workers.",
      sw: "Mimi ni mjasiriamali na mhandisi ninayeishi {location}, ninasoma {credential} katika {institution} ({detail}), na kujenga zana za tija za AI kwa kizazi kijacho cha wafanyakazi bilioni moja barani Afrika.",
    } as Pair,
  },
  shipLog: {
    kicker: { en: "Ship log", sw: "Rekodi ya uzinduzi" } as Pair,
    heading: { en: "Dated milestones", sw: "Matukio muhimu" } as Pair,
    earlier: { en: "Earlier", sw: "Hapo awali" } as Pair,
    viewProject: { en: "View project", sw: "Tazama mradi" } as Pair,
  },
  contact: {
    kicker: { en: "Get in touch", sw: "Wasiliana nami" } as Pair,
    headingPrefix: { en: "Let's ", sw: "" } as Pair,
    headingEmphasis: { en: "talk.", sw: "Tuongee." } as Pair,
    emailMe: { en: "Email me", sw: "Nitumie barua pepe" } as Pair,
    whatsapp: { en: "WhatsApp", sw: "WhatsApp" } as Pair,
    copyEmail: { en: "Copy email", sw: "Nakili barua pepe" } as Pair,
    copied: { en: "Copied", sw: "Imenakiliwa" } as Pair,
  },
  languageToggle: {
    label: { en: "Language", sw: "Lugha" } as Pair,
  },
} as const;

export function pick(lang: Lang, pair: Pair): string {
  return pair[lang] ?? pair.en;
}

// Substitutes {token} placeholders in a translated string with plain
// values — used for the About/AboutTeaser sentences that interpolate
// profile facts into the translated template.
export function fill(template: string, values: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (match, key) =>
    key in values ? values[key] : match
  );
}
