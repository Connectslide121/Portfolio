import { experience, education, beats, chapters, profile } from "../../../data/journey";
import { orgById } from "../../../data/orgLogos";

/**
 * Dialogue scripts, written from the CV data. A script is a list of pages:
 *   { speaker, text, links?: [{ label, href }], choices?: [{ label, script }] }
 * Rich text markers in the data ({Label} links, *bold*) become plain words
 * here, with the links offered as buttons under the page.
 */

const plain = (text) => text.replace(/\{([^}]+)\}/g, "$1").replace(/\*([^*]+)\*/g, "$1");
const linksIn = (text, links = {}) =>
  [...text.matchAll(/\{([^}]+)\}/g)].map((m) => m[1]).filter((l) => links[l]).map((l) => ({ label: l, href: links[l] }));

const ENTRIES = Object.fromEntries([...experience, ...education].map((e) => [e.id, e]));

export function entryScript(id) {
  const e = ENTRIES[id];
  const org = orgById(e.orgId);
  const speaker = e.org;
  const pages = [
    { speaker, text: `${e.title}\n${e.org}\n${e.dateLabel} · ${e.location}`, mark: e.orgId },
  ];
  if (e.quest) {
    pages.push({ speaker, text: `QUEST: “${e.quest.name}”  [${e.quest.status}]\n\nConstraint: ${e.quest.constraint}` });
    pages.push({ speaker, text: `Objective: ${e.quest.objective}` });
  }
  pages.push({ speaker, text: plain(e.summary), links: linksIn(e.summary, e.summaryLinks) });
  for (const b of e.bullets || []) pages.push({ speaker, text: `★ ${plain(b.text)}`, links: linksIn(b.text, b.links) });
  pages.push({
    speaker,
    text: `Skills gained: ${e.tech.join(", ")}.\nMaterial: ${e.material}.`,
    links: org?.url ? [{ label: `Visit ${org.label.split(" — ")[0]}`, href: org.url }] : [],
  });
  return pages;
}

export function indiaScript() {
  const b = beats.find((x) => x.id === "india");
  const aml = ENTRIES["exp-aml"];
  const bullet = aml.bullets.find((x) => /India/.test(x.text));
  const atpl = orgById("atpl");
  return [
    { speaker: b.org, text: `${b.role}\n${b.place} · ${b.year}`, mark: "atpl" },
    { speaker: b.org, text: `Constraint: ${b.constraint}` },
    { speaker: b.org, text: `Objective: ${b.objective}` },
    { speaker: b.org, text: `★ ${plain(bullet.text)}`, links: atpl?.url ? [{ label: "Visit Arihant Technocast", href: atpl.url }] : [] },
  ];
}

export function chapterScript(id) {
  const c = chapters.find((x) => x.id === id);
  return [{ speaker: "Signpost", text: `${c.title.toUpperCase()}\n${c.span}\n\n${c.detail}` }];
}

export function signScript(text) {
  if (text === "india") {
    const b = beats.find((x) => x.id === "india");
    return [{ speaker: "Signpost", text: `→ ${b.place}\n${b.year}\n\n${b.headline.join(" ")}` }];
  }
  return [{ speaker: "Signpost", text }];
}

export function startScript() {
  return [
    { speaker: "Signpost", text: `Welcome! This is the career of ${profile.name}, ${profile.title}.` },
    { speaker: "Signpost", text: `“${profile.lede}”` },
    { speaker: "Signpost", text: profile.blurb },
    {
      speaker: "Signpost",
      text: "Walk east to follow the story. Arrows or WASD to walk, or tap the map. Walk into doors and signs. Q: quests · I: bag · M: map.",
    },
  ];
}

export function sprintaScript() {
  const lead = ENTRIES["exp-sprinta-lead"];
  const ai = ENTRIES["exp-sprinta-ai"];
  return [
    {
      speaker: lead.org,
      text: "Two chapters of the story happened in this building. Which one do you want to hear?",
      mark: "sprinta",
      choices: [
        { label: `${ai.title} · ${ai.dateLabel}`, script: () => entryScript(ai.id) },
        { label: `${lead.title} · ${lead.dateLabel}`, script: () => entryScript(lead.id) },
      ],
    },
  ];
}

export const HINTS = [
  "The Workshop keeps every tool he works with. Have a look in the bag.",
  "The Arcade has every project he has made. Some of them are games!",
  "Lost? Press M for the map — you can travel anywhere from there.",
  "Want it all on one page? There is a Read as CV button up top.",
  "The Post Office sends letters straight to his inbox.",
  "Follow the road east: the story goes Spain, India, then Sweden.",
];
