// Every card in the game, built from the content in src/data and
// src/components/projectList.js. Nothing here is written twice: a new
// project, tool or role becomes a new card on its own.

import { profile, experience, education, chapters, beats, projectBlurbs } from "../data/journey";
import { featuredProjects, allProjects } from "../components/projectList";
import { toolCategories } from "../data/tools";
import { techFor } from "../data/projectTech";

export const RARITY = {
  common: { label: "Common", mark: "●", rank: 0 },
  uncommon: { label: "Uncommon", mark: "◆", rank: 1 },
  rare: { label: "Rare", mark: "★", rank: 2 },
  holo: { label: "Holo rare", mark: "★", rank: 3 },
  legendary: { label: "Legendary", mark: "✦", rank: 4 },
};

export const SETS = [
  {
    id: "career",
    name: "Career",
    code: "CAR",
    packSize: 4,
    blurb: "Twenty years in eleven cards: the degrees, the foundry, the reset and the software.",
  },
  {
    id: "projects",
    name: "Projects",
    code: "PRJ",
    packSize: 5,
    blurb: "Apps, games and packages, with the code and a live demo behind most of them.",
  },
  {
    id: "tools",
    name: "Toolbox",
    code: "TLS",
    packSize: 7,
    blurb: "The technologies and tools, and where each one has been used.",
  },
];

export const setById = (id) => SETS.find((s) => s.id === id);

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const yearOf = (label) => Number(String(label).match(/\d{4}/)?.[0]);
const short = (y) => (y ? `’${String(y).slice(2)}` : "");
const span = (label) => {
  const [a, b] = String(label).split(/\s*[-—]\s*/);
  const from = yearOf(a);
  const to = /present/i.test(b || "") ? new Date().getFullYear() : yearOf(b) || from;
  return { from, to, years: Math.max(1, to - from) };
};
const firstSentence = (s) => (s.match(/^.*?[.!?](\s|$)/)?.[0] || s).trim();
const norm = (s) => String(s).toLowerCase().replace(/[^a-z0-9#]/g, "");

/** Which frame a role or degree is printed in, by where it happened. */
const FRAME = { "london-met": "campus", "lea-artibai": "campus", aml: "ember", lexicon: "frost", sprinta: "circuit" };
const CHAPTER_FRAME = { steel: "ember", reset: "frost", software: "circuit" };
// Chapters open their era, so they sort just before its first entry; the
// software chapter starts the same year as the course, but after it.
const CHAPTER_SORT = { steel: -0.5, reset: -0.5, software: 0.5 };
const TOOL_FRAME = {
  "AI & Machine Learning": "neural",
  "Frontend Development": "prism",
  "Backend Development": "core",
  "Cloud & DevOps": "sky",
  "Game Development": "arcade",
};

/* ---- Career ------------------------------------------------------------ */

function entryCard(e, kind) {
  const s = span(e.dateLabel);
  const current = /present/i.test(e.dateLabel);
  return {
    id: e.id,
    set: "career",
    kind,
    name: e.quest.name,
    subtitle: e.title,
    type: `${kind === "role" ? "Role" : "Education"} — ${e.org}`,
    text: firstSentence(e.summary.replace(/[{}]/g, "")),
    flavour: e.quest.objective,
    rarity: current ? "legendary" : kind === "role" ? "holo" : "rare",
    cost: short(s.from),
    sort: s.from,
    stats: [
      { icon: "⌛", value: s.years, label: s.years === 1 ? "year" : "years" },
      { icon: "◆", value: e.tech.length, label: "skills" },
    ],
    frame: FRAME[e.orgId] || "campus",
    art: { kind: "material", material: e.material, org: e.orgId },
    entry: e,
  };
}

const chapterCards = chapters.map((c) => ({
  id: `ch-${c.id}`,
  set: "career",
  kind: "chapter",
  name: c.title,
  subtitle: c.span,
  type: `Chapter — ${c.span}`,
  text: c.detail,
  rarity: "uncommon",
  cost: short(yearOf(c.span)),
  sort: yearOf(c.span) + (CHAPTER_SORT[c.id] ?? -0.5),
  stats: [],
  frame: CHAPTER_FRAME[c.id],
  art: { kind: "chapter", id: c.id },
  chapter: c,
}));

const india = beats.find((b) => b.id === "india");
const indiaCard = {
  id: "ev-india",
  set: "career",
  kind: "event",
  name: india.headline.join(" "),
  subtitle: india.place,
  type: `Event — ${india.place}`,
  text: india.constraint,
  flavour: india.objective,
  rarity: "rare",
  cost: short(yearOf(india.year)),
  sort: yearOf(india.year),
  stats: [{ icon: "✈", value: "8000", label: "km" }],
  frame: "ember",
  art: { kind: "india" },
  beat: india,
};

const careerYears = new Date().getFullYear() - Math.min(...education.map((e) => span(e.dateLabel).from));

const heroCard = {
  id: "hero",
  set: "career",
  kind: "hero",
  name: profile.name,
  subtitle: profile.title,
  type: `Hero — ${profile.title}`,
  text: profile.lede,
  rarity: "legendary",
  cost: "✦",
  sort: -Infinity,
  stats: [{ icon: "⌛", value: careerYears, label: "years" }],
  frame: "gold",
  art: { kind: "hero" },
};

const career = [
  heroCard,
  ...[...education.map((e) => entryCard(e, "degree")), ...experience.map((e) => entryCard(e, "role")), ...chapterCards, indiaCard].sort(
    (a, b) => a.sort - b.sort,
  ),
];

/* ---- Projects ---------------------------------------------------------- */

const dateValue = (d) => {
  const [m, y] = String(d).split(" ");
  return Number(y) * 12 + Math.max(0, MONTHS.indexOf(m));
};

const projectList = [
  ...featuredProjects.map((p) => ({ ...p, featured: true })).sort((a, b) => dateValue(b.date) - dateValue(a.date)),
  ...[...allProjects].sort((a, b) => dateValue(b.date) - dateValue(a.date)),
];

const LINK_KEYS = ["livedemo", "repository", "npm", "play"];

const projects = projectList.map((p) => {
  const tech = (p.technologies || []).map((t) => techFor(t)?.name || t);
  const links = LINK_KEYS.filter((k) => p[k]).length;
  const year = yearOf(p.date);
  return {
    id: `prj-${norm(p.title)}`,
    set: "projects",
    kind: "project",
    name: p.title,
    subtitle: p.date,
    type: `Project — ${p.category || "Web App"}`,
    text: projectBlurbs[p.title] || firstSentence(p.description.trim()),
    rarity: p.featured ? (year >= 2025 ? "legendary" : "holo") : p.media === "video" ? "uncommon" : "common",
    cost: short(year),
    stats: [
      { icon: "⚙", value: tech.length, label: "tech" },
      { icon: "↗", value: links, label: links === 1 ? "link" : "links" },
    ],
    frame: "arcade",
    art: { kind: "project", title: p.title, category: p.category || "Web App" },
    tech,
    project: p,
  };
});

/* ---- Toolbox ----------------------------------------------------------- */

// Names the CV writes differently for the same thing ("React" in a course,
// "React.js" in the toolbox). Keyed by the toolbox name, normalised.
const ALIASES = {
  reactjs: ["react"],
  openaiapi: ["openai"],
  tailwind: ["tailwindcss"],
  azureaifoundry: ["azureai"],
  angular: ["angular21"],
};

const careerEntries = [...experience, ...education];

const tools = toolCategories.flatMap((cat) =>
  cat.tools.map((t) => {
    const keys = [norm(t.name), ...(ALIASES[norm(t.name)] || [])];
    const hit = (label) => keys.includes(norm(label));
    const users = [
      ...careerEntries.filter((e) => e.tech.some(hit)).map((e) => ({ id: e.id, name: e.quest.name })),
      ...projects.filter((p) => p.tech.some(hit)).map((p) => ({ id: p.id, name: p.name })),
    ];
    const usedIn = users.map((u) => u.id);
    const more = users.length - 3;
    return {
      id: `tool-${norm(t.name).replace("#", "sharp")}`,
      set: "tools",
      kind: "tool",
      name: t.name,
      subtitle: cat.name,
      type: `Tool — ${cat.name}`,
      text: users.length
        ? `Used in ${users
            .slice(0, 3)
            .map((u) => u.name)
            .join(", ")}${more > 0 ? ` and ${more} more` : ""}.`
        : "Part of the everyday toolbox.",
      rarity: cat.name === "AI & Machine Learning" || cat.tools.length === 1 ? "uncommon" : "common",
      cost: "",
      stats: [{ icon: "⚑", value: usedIn.length, label: "used in" }],
      frame: TOOL_FRAME[cat.name] || "core",
      art: { kind: "tool", image: t.image, alt: t.alt },
      usedIn,
      category: cat.name,
    };
  }),
);

/* ---- The whole collection --------------------------------------------- */

const numbered = (cards) => cards.map((c, i) => ({ ...c, no: i + 1, of: cards.length }));

export const CARDS = [...numbered(career), ...numbered(projects), ...numbered(tools)];
export const cardById = Object.fromEntries(CARDS.map((c) => [c.id, c]));
export const cardsOf = (setId) => CARDS.filter((c) => c.set === setId);

/** Cards that list this one: the roles and projects that use a tool. */
export const usersOf = (card) => (card.usedIn || []).map((id) => cardById[id]).filter(Boolean);

/** The tool card for a tech name, if the toolbox has one. */
export const toolFor = (label) => {
  const t = tools.find((x) => [norm(x.name), ...(ALIASES[norm(x.name)] || [])].includes(norm(label)));
  return t && cardById[t.id];
};

/** "007/011" */
export const collectorNo = (c) => `${String(c.no).padStart(3, "0")}/${String(c.of).padStart(3, "0")}`;
