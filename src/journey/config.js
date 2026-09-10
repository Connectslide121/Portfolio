// Journey geometry. Story data lives in src/data/journey.js (D9).
// See docs/JOURNEY_PLAN.md for the design this implements.
import { beats } from "../data/journey";

export const BEATS = beats;

// The SVG viewBox is the camera window. World content is authored wider than
// it and slid horizontally, so the camera is a single number (4.2 in plan).
export const SCENE_W = 1800;
export const VIEW_H = 1080;

// Parallax depth table. `k` is how much of the camera's travel a layer takes.
export const LAYERS = [
  { id: "far", k: 0.22 }, // ambient ridgeline only — never scene-specific
  { id: "type", k: 0.38 }, // giant year numerals
  { id: "mid", k: 0.55 }, // second ridge
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

// The beat card covers roughly the left third, so scene props are authored in
// local 0..1080 to the right of this offset.
export const FOCAL = 700;
export const SCENE_SPAN = 1080;

// Ground contact line for scene props.
export const BASE = 848;

// The final beat pulls the camera back, so full-width shapes overdraw past the
// nominal frame or the world's own edges come into view.
export const OVERDRAW = 1400;
export const FLOOR = 1600;

// Past beats are not panned off to the side — they recede toward a vanishing
// point near the horizon, staying faintly visible behind the current scene.
//
// For that to be visible at all, the current scene has to leave room: it is
// drawn at CURRENT_SCALE and anchored right of centre (CURRENT_ANCHOR), which
// opens a corridor between the beat card and the current place.
//
// VANISH is back and to the LEFT, roughly behind the beat card. The effect is
// a line of places trailing off that way: the beat you just left sits clearly
// in the corridor, the one before it half-peeks past the card's edge, and
// anything older is a ghost behind the card, which is 78% opaque so they
// still register.
//
// A scene's ground-contact point (SCENE_ANCHOR) is what travels toward VANISH,
// so a receding scene keeps sitting ON the ground rather than floating.
//
// CURRENT_ANCHOR/CURRENT_SCALE are also what keep the active scene inside the
// frame. preserveAspectRatio="slice" crops the SIDES hard on a tall window —
// a 1704x1290 viewport only shows viewBox x 186..1613, not the full 0..1800 —
// so the scene is placed and sized to survive that band, not the 16:9 one.
export const SCENE_ANCHOR = { x: FOCAL + SCENE_SPAN / 2, y: BASE };
export const CURRENT_ANCHOR = { x: 1150, y: BASE };
export const CURRENT_SCALE = 0.76;
export const VANISH = { x: 120, y: 686 };
export const DEPTH = 0.85; // how fast the past shrinks — bigger recedes faster
export const PAST_MIN_OPACITY = 0.2;

// A receding scene is softened at its extreme edges so it melts into the
// distance rather than ending abruptly. This is deliberately WIDER than the
// scene itself (which spans FOCAL..FOCAL+SCENE_SPAN): the fade only touches
// the outermost sliver, so nothing is actually cut away. An earlier version
// narrowed scenes to a single landmark, which read as slicing them in half.
export const FADE_X0 = FOCAL - 90;
export const FADE_W = SCENE_SPAN + 180;
export const FADE_EDGE = 0.11; // fraction of the span spent fading, each side

// Bird's-eye overview. The camera lifts and the real silhouettes are laid out
// across the ground, still standing upright, so you see the actual journey
// from above rather than an abstract map of it.
//
// Deliberately IRREGULAR: hand-placed with uneven spacing and height so it
// meanders like ground that was walked, not a tidy arc. Each entry is where
// that scene's ground-contact point lands, plus how small it gets — the
// variation in scale is what gives the plane its depth.
// Only the six career beats are laid out — neither the landing card nor the
// recap itself is a place. Keyed by beat id, never by index: an index-keyed
// table silently breaks the moment a beat is inserted.
// They sit in the LOWER half: the recap slide puts the project wall above
// them, so the closing frame is the work and the road that led to it.
export const OVERVIEW = [
  { id: "origin", x: 240, y: 660, s: 0.195 },
  { id: "foundry", x: 466, y: 792, s: 0.235 },
  { id: "india", x: 722, y: 710, s: 0.21 },
  { id: "sweden", x: 972, y: 836, s: 0.245 },
  { id: "sprinta", x: 1230, y: 678, s: 0.2 },
  { id: "architect", x: 1512, y: 800, s: 0.235 },
];

export const OVERVIEW_BY_ID = Object.fromEntries(
  OVERVIEW.map((spot) => [spot.id, spot])
);

// Total world width, and where full-width paths start/end.
export const WORLD_W = SCENE_W * BEATS.length;
export const PATH_START = -OVERDRAW;
export const PATH_SPAN = WORLD_W + OVERDRAW * 2;

// Heat ramps through THREE poles, not two. A straight cold->hot RGB lerp
// passes through grey mud at the midpoint, which made the middle beats look
// washed out; the warm pole turns that midpoint into an amber dusk instead.
export const PALETTE = {
  warm: {
    accent: "#e0872e",
    sky0: "#1d1320",
    sky1: "#5b3033",
    far: "#33212a",
    mid: "#1d1520",
    ground: "#110b11",
    stream: "#ffc78a",
    streamCore: "#fff0d2",
  },
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
