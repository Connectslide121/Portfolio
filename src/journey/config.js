// Journey prototype — geometry + beat data.
// Phase 1 slice: foundry -> india -> sweden. See docs/JOURNEY_PLAN.md.

// The SVG viewBox is the camera window. World content is authored wider than
// it and slid horizontally, so the camera is a single number (see 4.2 in plan).
export const SCENE_W = 1800;
export const VIEW_H = 1080;

// Parallax depth table. `k` is how much of the camera's travel a layer takes.
export const LAYERS = [
  { id: "far", k: 0.22 }, // ambient ridgeline only — never scene-specific
  { id: "type", k: 0.38 }, // giant year numerals
  { id: "mid", k: 0.55 }, // abstract bands
  { id: "scene", k: 0.9 }, // the place-defining props
  { id: "ground", k: 1.0 }, // continuous floor + the stream
  { id: "fore", k: 1.35 }, // scrub, particles
];

// A layer moving at rate k must have its scene clusters authored at k-scaled
// positions, otherwise scenes drift out of alignment as the camera travels.
export const anchor = (i, k) => i * SCENE_W * k;

// Consequence of the above: on a slow layer, scene spacing (SCENE_W * k) is
// narrower than the viewport, so neighbouring scenes bleed into frame. Anything
// scene-specific therefore lives on a fast layer AND gets crossfaded per beat
// via data-atmos. Slow layers carry only ambient, repeating content.

// Card occupies the left third, so scene focal content belongs to the right of
// this offset.
export const FOCAL = 700;

export const BEATS = [
  {
    id: "foundry",
    level: 1,
    year: "2011 — 2023",
    place: "Basque Country, Spain",
    org: "AML SA",
    role: "Plant Manager / Product Designer",
    material: "steel",
    constraint: "Sand casting steel foundry. Make-to-order, no margin for scrap.",
    objective: "Run production end to end — MTO planning, CAD design, process simulation.",
    heat: 1.0,
  },
  {
    id: "india",
    level: 2,
    year: "2017",
    place: "India",
    org: "AML SA",
    role: "International Expansion",
    material: "steel + CAD",
    constraint: "No facility, no team, no local process. Greenfield, 8000 km from home.",
    objective: "Stand up a second production plant from the ground up and train the team.",
    heat: 0.82,
  },
  {
    id: "sweden",
    level: 3,
    year: "2023 — 2024",
    place: "Växjö, Sweden",
    org: "Lexicon",
    role: ".NET Full-stack Developer",
    material: "C#",
    constraint: "New country, new language, career reset at the deep end.",
    objective: "Retrain as a developer. C#, .NET, React, SQL Server, from zero.",
    heat: 0.06,
  },
];

// Heat 1 -> 0 interpolates every colour in the scene between these poles.
export const PALETTE = {
  hot: {
    accent: "#ff6a00",
    sky0: "#2b0f06",
    sky1: "#7a2f0d",
    far: "#3d1a0d",
    mid: "#25100a",
    ground: "#150805",
    stream: "#ffd08a",
    streamCore: "#fff3d6",
  },
  cold: {
    accent: "#3b82f6",
    sky0: "#0b1220",
    sky1: "#1e3a5f",
    far: "#16283d",
    mid: "#0f1c2c",
    ground: "#080e17",
    stream: "#9ec5ff",
    streamCore: "#eaf2ff",
  },
};
