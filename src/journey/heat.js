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
  acc[key] = [
    hex(PALETTE.cold[key]),
    hex(PALETTE.warm[key]),
    hex(PALETTE.hot[key]),
  ];
  return acc;
}, {});

const MID = 0.5;

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

  for (const key in POLES) {
    const [cold, warm, hot] = POLES[key];
    const from = lower ? cold : warm;
    const to = lower ? warm : hot;
    root.style.setProperty(`--j-${key}`, toHex(lerp(from, to, local)));
  }
}
