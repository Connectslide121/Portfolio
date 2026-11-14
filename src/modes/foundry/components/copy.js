import { chapters, education, experience, profile } from "../../../data/journey";

// The blurb is one paragraph in the data. The hero has room for its first
// sentence; the process carries the rest.
const cut = profile.blurb.indexOf(". ");
export const blurbOpening = cut > 0 ? profile.blurb.slice(0, cut + 1) : profile.blurb;
export const blurbRest = cut > 0 ? profile.blurb.slice(cut + 2) : "";

const byId = Object.fromEntries([...experience, ...education].map((e) => [e.id, e]));

/**
 * The career as a process sheet: each chapter is a step in making a part.
 * `heat` and `open` are what the billet shows while the step is read; the
 * entries are where the step happened, linking down to the record.
 */
const STEPS = {
  // A shade under white-hot, so the bar has somewhere to cool from.
  steel: { verb: "Cast", heat: 0.85, open: 0, entries: ["exp-aml", "edu-leartik", "edu-polymers"] },
  reset: { verb: "Quench", open: 0.3, entries: ["edu-lexicon"] },
  software: { verb: "Machine", open: 1, entries: ["exp-sprinta-ai", "exp-sprinta-lead"] },
};

export const processSteps = chapters.map((c) => ({
  ...c,
  ...STEPS[c.id],
  entries: (STEPS[c.id]?.entries || []).map((id) => byId[id]).filter(Boolean),
}));

/** The billet's state at the top of the page, before any step is read. */
export const START = { heat: 1, open: 0 };
