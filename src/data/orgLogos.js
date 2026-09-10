// Organisation marks, used by both Résumé mode's timeline cards and Journey
// mode's beat cards.
//
// `url` is the canonical site for the organisation, and the single source for
// every link to it — both the CV's "Visit site" button and the logo marks in
// Journey mode read it from here.
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
import atpl from "../images/orgs/atpl.webp";
import github from "../images/tools/github.webp";

export const ORGS = {
  aml: {
    src: aml,
    tone: "light",
    label: "AML SA — Aceros Moldeados de Lacunza",
    url: "https://www.amlsa.com/?lang=eng",
  },
  "lea-artibai": {
    src: leaArtibai,
    tone: "colour",
    label: "Lea-Artibai Ikastetxea",
    url: "https://www.leartik.eus/",
  },
  // Opaque, with a white background baked in, so a white plate is seamless.
  // Note the luminance test misreads files like this — see the caveat in
  // docs/JOURNEY_PLAN.md §8b.
  atpl: {
    src: atpl,
    tone: "dark",
    label: "Arihant Technocast Private Limited (ATPL)",
    url: "https://arihanttechnocastindia.com/",
  },
  "london-met": {
    src: londonMet,
    tone: "dark",
    label: "London Metropolitan University",
    url: "https://www.londonmet.ac.uk/",
  },
  lexicon: {
    src: lexicon,
    tone: "colour",
    label: "Lexicon",
    url: "https://www.lexicon.se/",
  },
  sprinta: {
    src: sprinta,
    tone: "dark",
    label: "Sprinta Consulting AB",
    url: "https://sprinta.se",
  },
  github: {
    src: github,
    tone: "dark",
    label: "GitHub",
    url: "https://github.com/Connectslide121",
  },
};

export const orgById = (id) => ORGS[id];
