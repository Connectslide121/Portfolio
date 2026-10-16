// The nine designs. Each one is a complete site of its own in src/modes/<id>,
// loaded only when it is picked, so its global styles never meet another's.
// They all read the same content from src/data and src/components.

const FONTS = "https://fonts.googleapis.com/css2?";

export const MODES = [
  {
    id: "swiss",
    name: "Swiss",
    kind: "Editorial",
    blurb: "International Typographic Style: one typeface, a twelve-column grid and generative posters.",
    font: "family=Archivo:ital,wdth,wght@0,62..125,100..900;1,62..125,100..900",
    themeColor: "#f3f3ef",
    load: () => import("./swiss/main"),
  },
  {
    id: "blueprint",
    name: "Blueprint",
    kind: "Editorial",
    blurb: "An engineering drawing set on cyanotype blue: title blocks, a parts list, revisions.",
    font: "family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans+Condensed:wght@400;500;600;700",
    themeColor: "#0b3361",
    darkByDefault: true,
    load: () => import("./blueprint/main"),
  },
  {
    id: "jonos",
    name: "JonOS",
    kind: "Desktop",
    blurb: "A 90s desktop: boot screen, pixel icons, draggable windows and a setup wizard.",
    font: "family=Pixelify+Sans:wght@400..700&family=VT323",
    themeColor: "#008080",
    switchAt: "top-right",
    load: () => import("./jonos/main"),
  },
  {
    id: "newspaper",
    name: "Chronicle",
    kind: "Editorial",
    blurb: "The Mendizabal Chronicle: a broadsheet with live halftones and a playable crossword.",
    font: "family=UnifrakturMaguntia&family=Playfair+Display:ital,wght@0,700;0,900;1,700;1,900&family=Libre+Caslon+Text:ital,wght@0,400;0,700;1,400&family=Oswald:wght@400;500;600",
    themeColor: "#f0ebdf",
    load: () => import("./newspaper/main"),
  },
  {
    id: "constellation",
    name: "Constellation",
    kind: "Atmospheric",
    blurb: "The career in the night sky: an orrery of projects, tools as constellations.",
    font: "family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Jost:wght@300..600",
    themeColor: "#05060f",
    darkByDefault: true,
    load: () => import("./constellation/main"),
  },
  {
    id: "stickers",
    name: "Stickers",
    kind: "Playful",
    blurb: "Neo-brutalist and loud: thick outlines, flat colour and stickers you can move.",
    font: "family=Bricolage+Grotesque:opsz,wght@12..96,400..800&family=DM+Sans:opsz,wght@9..40,400..700&family=Caveat:wght@500",
    themeColor: "#fff4e0",
    load: () => import("./stickers/main"),
  },
  {
    id: "quest",
    name: "Quest",
    kind: "Game",
    blurb: "A top-down pixel RPG: walk from Spain to Sweden and talk to people.",
    font: "family=Press+Start+2P&family=Pixelify+Sans:wght@400..700",
    themeColor: "#14223a",
    load: () => import("./quest/main"),
  },
  {
    id: "run",
    name: "Run",
    kind: "Game",
    blurb: "A side-scrolling platformer from 2005 to today. Mind the molten steel.",
    font: "family=Press+Start+2P",
    themeColor: "#8fd3ff",
    load: () => import("./run/main"),
  },
  {
    id: "collect",
    name: "Collect",
    kind: "Game",
    blurb: "A trading card game: rip open boosters, pull holo rares, fill the album.",
    font: "family=Cinzel:wght@600;800&family=Inter:wght@400..700",
    themeColor: "#efe5d0",
    load: () => import("./collect/main"),
  },
];

export const modeById = (id) => MODES.find((m) => m.id === id);
export const fontsHref = (m) => `${FONTS}${m.font}&display=swap`;

/** The mode in the address bar (?mode=quest), if there is one. */
export const currentModeId = () => new URLSearchParams(window.location.search).get("mode");

/** Where a mode lives: same page, its id in the query, any #cv hash dropped. */
export const hrefFor = (id) => `${window.location.pathname}?mode=${id}`;
export const pickerHref = () => window.location.pathname;
