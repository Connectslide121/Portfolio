import { PALETTE } from "./config";

const hex = (h) => [
  parseInt(h.slice(1, 3), 16),
  parseInt(h.slice(3, 5), 16),
  parseInt(h.slice(5, 7), 16),
];

const toHex = ([r, g, b]) =>
  "#" +
  [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, "0")).join("");

const lerp = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);

// Pre-parse so the render loop does no string work.
const POLES = Object.keys(PALETTE.hot).reduce((acc, key) => {
  acc[key] = [hex(PALETTE.cold[key]), hex(PALETTE.hot[key])];
  return acc;
}, {});

/**
 * Heat is one number (see 4.3 in the plan). Everything visual derives from it
 * via CSS custom properties, so the whole scene recolours in one pass and the
 * existing design system's variables keep working.
 */
export function applyHeat(root, heat) {
  const t = Math.max(0, Math.min(1, heat));
  root.style.setProperty("--jHeat", t.toFixed(3));
  for (const key in POLES) {
    const [cold, hot] = POLES[key];
    root.style.setProperty(`--j-${key}`, toHex(lerp(cold, hot, t)));
  }
}
