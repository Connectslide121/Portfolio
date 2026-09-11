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
 * Heat is one number (see 4.3 in the plan). Everything visual derives from it
 * via CSS custom properties, so the whole scene recolours in one pass and the
 * existing design system's variables keep working.
 *
 * Ramps cold -> warm -> hot rather than cold -> hot directly, so the middle of
 * the journey lands on an amber dusk instead of desaturated grey.
 */
export function applyHeat(root, heat) {
  const t = Math.max(0, Math.min(1, heat));
  root.style.setProperty("--jHeat", t.toFixed(3));

  const lower = t <= MID;
  const local = lower ? t / MID : (t - MID) / (1 - MID);

  const poles = document.body.classList.contains("dark-theme") ? DARK_POLES : LIGHT_POLES;
  for (const key in poles) {
    const [cold, warm, hot] = poles[key];
    const from = lower ? cold : warm;
    const to = lower ? warm : hot;
    root.style.setProperty(`--j-${key}`, toHex(lerp(from, to, local)));
  }
}
