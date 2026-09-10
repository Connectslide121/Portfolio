// Organisation marks, used by both Résumé mode's timeline cards and Journey
// mode's beat cards.
//
// `tone` describes the ARTWORK, not the surface it sits on:
//   "dark"   — dark ink on transparent (needs a light plate)
//   "light"  — light ink on transparent (needs a dark plate)
//   "colour" — full-colour, legible on a light plate
//
// Every mark is drawn on a plate chosen from its tone, so the same component
// works on the journey's dark scenes and the CV's light theme without any
// filter trickery or per-theme assets.

import aml from "../images/orgs/aml.webp";
import leaArtibai from "../images/orgs/lea-artibai.webp";
import sprinta from "../images/orgs/sprinta.webp";
import lexicon from "../images/orgs/lexicon.svg";
import londonMet from "../images/orgs/london-met.svg";
import github from "../images/tools/github.webp";

export const ORGS = {
  aml: { src: aml, tone: "light", label: "AML SA — Aceros Moldeados de Lacunza" },
  "lea-artibai": { src: leaArtibai, tone: "colour", label: "Lea-Artibai Ikastetxea" },
  "london-met": { src: londonMet, tone: "dark", label: "London Metropolitan University" },
  lexicon: { src: lexicon, tone: "colour", label: "Lexicon" },
  sprinta: { src: sprinta, tone: "dark", label: "Sprinta Consulting AB" },
  github: { src: github, tone: "dark", label: "GitHub" },
};

export const orgById = (id) => ORGS[id];
