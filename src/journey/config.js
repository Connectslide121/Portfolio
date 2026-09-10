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
export const SCENE_ANCHOR = { x: FOCAL + SCENE_SPAN / 2, y: BASE };
export const CURRENT_ANCHOR = { x: 1420, y: BASE };
export const CURRENT_SCALE = 0.82;
export const VANISH = { x: 330, y: 690 };
export const DEPTH = 0.85; // how fast the past shrinks — bigger recedes faster
export const PAST_MIN_OPACITY = 0.2;

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
