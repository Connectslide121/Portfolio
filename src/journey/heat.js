import { LIGHT_PALETTE, PALETTE } from "./config";

const hex = (h) => [
  parseInt(h.slice(1, 3), 16),
  parseInt(h.slice(3, 5), 16),
  parseInt(h.slice(5, 7), 16),
];

const toHex = ([r, g, b]) =>
  "#" +
  [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, "0")).join("");

const lerp = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);

// Pre-parse so the render loop does no colour conversion work.
const parsePoles = (palette) =>
  Object.keys(palette.hot).reduce((acc, key) => {
    acc[key] = [hex(palette.cold[key]), hex(palette.warm[key]), hex(palette.hot[key])];
    return acc;
  }, {});

const DARK_POLES = parsePoles(PALETTE);
const LIGHT_POLES = parsePoles(LIGHT_PALETTE);

const MID = 0.5;
const STYLE_CACHE = new WeakMap();

/**
 * The same cold -> warm -> hot ramp as a value, for anything that needs a
 * single colour rather than CSS variables on a root — the overview tints each
 * beat by its own heat, all seven visible at once.
 */
export function heatColor(heat, key = "accent") {
  const t = Math.max(0, Math.min(1, heat));
  const lower = t <= MID;
  const local = lower ? t / MID : (t - MID) / (1 - MID);
  const [cold, warm, hot] = DARK_POLES[key];
  return toHex(lerp(lower ? cold : warm, lower ? warm : hot, local));
}

/**
 * The whole palette at a given heat, as unconverted RGB triples.
 *
 * `applyHeat` ramps ONE heat across the whole stage, which is right while the
 * camera is travelling — a receding place should sit in the current evening's
 * light. From above it is wrong: the recap lays six places out at once, and a
 * single heat painted all of them in whichever atmosphere the last beat had,
 * so twelve years of molten steel arrived looking like a cold Swedish
 * afternoon. The lift blends each place back toward its own heat instead.
 *
 * Triples rather than hex because the caller interpolates before converting;
 * going through hex per key per frame would be pure waste.
 */
export function heatPalette(heat, dark = true) {
  const t = Math.max(0, Math.min(1, heat));
  const lower = t <= MID;
  const local = lower ? t / MID : (t - MID) / (1 - MID);
  const poles = dark ? DARK_POLES : LIGHT_POLES;
  const out = {};
  for (const key in poles) {
    const [cold, warm, hot] = poles[key];
    out[key] = lerp(lower ? cold : warm, lower ? warm : hot, local);
  }
  return out;
}

/** Two palette entries mixed and converted once, for inline style writes. */
export const mixChannels = (a, b, t) => toHex(lerp(a, b, t));

/**
 * The same mix, left as channels so it can be chained.
 *
 * A scene can be under two colour effects at once — blended back toward its
 * own heat by the overview lift, and hazed toward the sky by depth — and
 * going through hex between them would round twice and cost a parse for a
 * value nothing reads.
 */
export const lerpChannels = lerp;

/** The single conversion at the end of a chain. */
export const channelsToHex = toHex;

/**
 * Heat is one number (see 4.3 in the plan). Everything visual derives from it
 * via CSS custom properties, so the whole scene recolours in one pass and the
 * existing design system's variables keep working.
 *
 * Ramps cold -> warm -> hot rather than cold -> hot directly, so the middle of
 * the journey lands on an amber dusk instead of desaturated grey.
 */
export function applyHeat(root, heat) {
  const t = Math.max(0, Math.min(1, heat));
  let cache = STYLE_CACHE.get(root);
  if (!cache) {
    cache = {};
    STYLE_CACHE.set(root, cache);
  }

  const heatValue = t.toFixed(3);
  if (cache.heat !== heatValue) {
    root.style.setProperty("--jHeat", heatValue);
    cache.heat = heatValue;
  }

  const lower = t <= MID;
  const local = lower ? t / MID : (t - MID) / (1 - MID);

  const dark = document.body.classList.contains("dark-theme");
  const poles = dark ? DARK_POLES : LIGHT_POLES;
  if (cache.dark !== dark) {
    cache.dark = dark;
    cache.colors = {};
  }
  for (const key in poles) {
    const [cold, warm, hot] = poles[key];
    const from = lower ? cold : warm;
    const to = lower ? warm : hot;
    const value = toHex(lerp(from, to, local));
    if (cache.colors[key] !== value) {
      root.style.setProperty(`--j-${key}`, value);
      cache.colors[key] = value;
    }
  }
}
