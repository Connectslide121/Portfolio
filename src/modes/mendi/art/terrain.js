// The terrain behind every drawing in this mode: ridgelines, pines, stars,
// contour lines and the trail. Everything is seeded, so nothing here is random
// between visits, and everything returns plain SVG path data.

import { rng } from "./rng";

const r1 = (n) => Math.round(n * 10) / 10;
const fade = (t) => t * t * (3 - 2 * t);

export const smoothstep = (a, b, x) => fade(Math.min(1, Math.max(0, (x - a) / (b - a))));

const lattice = (seed, size = 96) => Array.from({ length: size }, rng(seed));

function noise1(lat, x) {
  const n = lat.length;
  const i = Math.floor(x);
  const a = lat[((i % n) + n) % n];
  const b = lat[(((i + 1) % n) + n) % n];
  return a + (b - a) * fade(x - i);
}

/**
 * One ridgeline as a list of [x, y] points. `sharp` folds the noise over on
 * itself (ridged noise), which is what turns rolling hills into crests;
 * `gain` is how much of each finer octave is kept (more is craggier);
 * `envelope` scales the height along the width, to leave the sky open where
 * the words are.
 */
export function ridge({ seed, width = 1440, base, amp, freq = 3, octaves = 5, sharp = 0, power = 1, gain = 0.5, step = 6, envelope }) {
  const lats = Array.from({ length: octaves }, (_, o) => lattice(seed * 31 + o * 7 + 1));
  const pts = [];
  for (let x = 0; x <= width; x += step) {
    const u = x / width;
    let f = freq;
    let a = 1;
    let sum = 0;
    let norm = 0;
    for (let o = 0; o < octaves; o += 1) {
      let n = noise1(lats[o], u * f + o * 13.7);
      if (sharp) n = n * (1 - sharp) + (1 - Math.abs(2 * n - 1)) * sharp;
      sum += n * a;
      norm += a;
      f *= 2.07;
      a *= gain;
    }
    // `power` above 1 pulls the middle heights down, which leaves the summits standing.
    pts.push([x, r1(base - amp * Math.pow(sum / norm, power) * (envelope ? envelope(u) : 1))]);
  }
  return pts;
}

/** Closes a ridgeline down to `floor`, so it can be filled. */
export const ridgePath = (pts, floor) =>
  `M0,${floor}${pts.map(([x, y]) => `L${x},${y}`).join("")}L${pts[pts.length - 1][0]},${floor}Z`;

/** The ridge's height at any x, between its points. */
export function heightAt(pts, x) {
  const step = pts[1][0] - pts[0][0];
  const i = Math.min(pts.length - 2, Math.max(0, Math.floor(x / step)));
  return pts[i][1] + (pts[i + 1][1] - pts[i][1]) * ((x - pts[i][0]) / step);
}

// A spruce: three tiers, drawn from the tip down one side and back up the other.
function tree(x, y, h) {
  const w = h * 0.36;
  return (
    `M${r1(x)},${r1(y - h)}` +
    `l${r1(w * 0.5)},${r1(h * 0.45)}l${r1(-w * 0.22)},0` +
    `l${r1(w * 0.42)},${r1(h * 0.33)}l${r1(-w * 0.25)},0` +
    `l${r1(w * 0.45)},${r1(h * 0.3)}l${r1(-w * 1.8)},0` +
    `l${r1(w * 0.45)},${r1(-h * 0.3)}l${r1(-w * 0.25)},0` +
    `l${r1(w * 0.42)},${r1(-h * 0.33)}l${r1(-w * 0.22)},0Z`
  );
}

/** A forest along a ridge, as one path. `from` and `to` are fractions of the width. */
export function pines(pts, { seed, gap = 14, min = 14, max = 30, from = 0, to = 1, sink = 2 }) {
  const r = rng(seed);
  const width = pts[pts.length - 1][0];
  let d = "";
  let x = width * from + r() * gap;
  while (x < width * to) {
    d += tree(x, heightAt(pts, x) + sink, min + r() * (max - min));
    x += gap * (0.45 + r() * 1.1);
  }
  return d;
}

/** Stars, denser towards the top of the sky. */
export function stars(seed, count, width, height) {
  const r = rng(seed);
  return Array.from({ length: count }, () => ({
    x: r1(r() * width),
    y: r1(Math.pow(r(), 1.5) * height),
    r: r1(0.5 + r() * r() * 1.3),
    o: r1(0.35 + r() * 0.65),
    twinkle: r() < 0.16,
  }));
}

/**
 * Contour lines of a noise field (marching squares), one path per level, the
 * way a topographic map draws a mountain.
 */
export function contours({ seed, width = 1440, height = 600, cols = 72, rows = 30, levels = 7, scale = 3.2 }) {
  const G = 24;
  const rand = rng(seed);
  const grid = Array.from({ length: G * G }, rand);
  const at = (i, j) => grid[(((j % G) + G) % G) * G + (((i % G) + G) % G)];
  const noise2 = (x, y) => {
    const i = Math.floor(x);
    const j = Math.floor(y);
    const tx = fade(x - i);
    const ty = fade(y - j);
    const top = at(i, j) + (at(i + 1, j) - at(i, j)) * tx;
    const bottom = at(i, j + 1) + (at(i + 1, j + 1) - at(i, j + 1)) * tx;
    return top + (bottom - top) * ty;
  };
  const aspect = height / width;
  const field = [];
  let lo = Infinity;
  let hi = -Infinity;
  for (let j = 0; j <= rows; j += 1) {
    for (let i = 0; i <= cols; i += 1) {
      const u = (i / cols) * scale;
      const v = (j / rows) * scale * aspect;
      const n = noise2(u, v) * 0.62 + noise2(u * 2.1 + 5.3, v * 2.1 + 1.7) * 0.28 + noise2(u * 4.3 + 9.1, v * 4.3 + 4.2) * 0.1;
      field.push(n);
      lo = Math.min(lo, n);
      hi = Math.max(hi, n);
    }
  }
  const cw = width / cols;
  const ch = height / rows;
  // Which two edges a line crosses, for each of the sixteen corner cases.
  const CASES = { 1: ["lb"], 2: ["br"], 3: ["lr"], 4: ["tr"], 5: ["tl", "br"], 6: ["tb"], 7: ["tl"], 8: ["tl"], 9: ["tb"], 10: ["tr", "lb"], 11: ["tr"], 12: ["lr"], 13: ["br"], 14: ["lb"] };
  return Array.from({ length: levels }, (_, k) => {
    const th = lo + ((k + 1) / (levels + 1)) * (hi - lo);
    let d = "";
    for (let j = 0; j < rows; j += 1) {
      for (let i = 0; i < cols; i += 1) {
        const a = field[j * (cols + 1) + i];
        const b = field[j * (cols + 1) + i + 1];
        const c = field[(j + 1) * (cols + 1) + i + 1];
        const e = field[(j + 1) * (cols + 1) + i];
        const key = (a > th ? 8 : 0) | (b > th ? 4 : 0) | (c > th ? 2 : 0) | (e > th ? 1 : 0);
        const segs = CASES[key];
        if (!segs) continue;
        const x0 = i * cw;
        const y0 = j * ch;
        const edge = {
          t: () => `${r1(x0 + ((th - a) / (b - a)) * cw)} ${r1(y0)}`,
          r: () => `${r1(x0 + cw)} ${r1(y0 + ((th - b) / (c - b)) * ch)}`,
          b: () => `${r1(x0 + ((th - e) / (c - e)) * cw)} ${r1(y0 + ch)}`,
          l: () => `${r1(x0)} ${r1(y0 + ((th - a) / (e - a)) * ch)}`,
        };
        for (const s of segs) d += `M${edge[s[0]]()}L${edge[s[1]]()}`;
      }
    }
    return d;
  });
}

/** A smooth curve through points (Catmull-Rom, as cubic Béziers). */
export function smoothPath(pts) {
  let d = `M${r1(pts[0][0])},${r1(pts[0][1])}`;
  for (let i = 0; i < pts.length - 1; i += 1) {
    const p0 = pts[i - 1] || pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] || p2;
    d +=
      `C${r1(p1[0] + (p2[0] - p0[0]) / 6)},${r1(p1[1] + (p2[1] - p0[1]) / 6)} ` +
      `${r1(p2[0] - (p3[0] - p1[0]) / 6)},${r1(p2[1] - (p3[1] - p1[1]) / 6)} ${r1(p2[0])},${r1(p2[1])}`;
  }
  return d;
}

/**
 * The colour of an entry's `heat` (1 = the foundry, 0 = today): ember, through
 * the grey of cooling steel, to glacier. The three colours are theme tokens.
 */
export const heatTone = (heat) =>
  heat >= 0.5
    ? `color-mix(in oklab, var(--ember) ${Math.round((heat - 0.5) * 200)}%, var(--steel))`
    : `color-mix(in oklab, var(--steel) ${Math.round(heat * 200)}%, var(--glacier))`;
