// Shape helpers for the printed look.
//
// A risograph or screen print never lands a perfect circle: the ink spreads a
// little and the plate is a hair out of true, and that irregularity is most of
// why a print reads as made rather than generated. The obvious way to get it
// in SVG is a displacement filter — and on art that the camera scales and
// moves every frame, a filter is re-rasterised every frame. These bake the
// wobble into the path data instead, once, at render: same look, zero cost.
//
// Everything here is deterministic (seeded), so a shape never shifts between
// renders or between a theme switch and the next frame.

const TAU = Math.PI * 2;

/** A smooth radius jitter: a few low harmonics with seeded phases. */
const jitter = (seed, amount) => {
  const p1 = (seed * 1.7) % TAU;
  const p2 = (seed * 3.1) % TAU;
  const p3 = (seed * 5.3) % TAU;
  return (a) =>
    1 +
    amount *
      (0.55 * Math.sin(2 * a + p1) +
        0.3 * Math.sin(3 * a + p2) +
        0.15 * Math.sin(5 * a + p3));
};

/** Closed Catmull-Rom spline through points, as cubic Béziers. */
const closedSpline = (pts) => {
  const n = pts.length;
  const f = (v) => v.toFixed(1);
  let d = `M ${f(pts[0][0])} ${f(pts[0][1])}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n];
    const p1 = pts[i];
    const p2 = pts[(i + 1) % n];
    const p3 = pts[(i + 2) % n];
    d +=
      ` C ${f(p1[0] + (p2[0] - p0[0]) / 6)} ${f(p1[1] + (p2[1] - p0[1]) / 6)}` +
      ` ${f(p2[0] - (p3[0] - p1[0]) / 6)} ${f(p2[1] - (p3[1] - p1[1]) / 6)}` +
      ` ${f(p2[0])} ${f(p2[1])}`;
  }
  return `${d} Z`;
};

/**
 * A disc as a print would land it — round, but not a compass circle.
 * `amount` is the radius jitter as a fraction; 0.03 is barely-there.
 */
export const blob = (cx, cy, r, seed = 1, amount = 0.03, ry = r) => {
  const n = 24;
  const j = jitter(seed, amount);
  const pts = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * TAU;
    const k = j(a);
    pts.push([cx + Math.cos(a) * r * k, cy + Math.sin(a) * ry * k]);
  }
  return closedSpline(pts);
};

/**
 * A soft, rolling hill filled down to `base`. `pts` are [x, y] crests from
 * left to right; the outline is smoothed through them.
 */
export const hill = (pts, base) => {
  const f = (v) => v.toFixed(1);
  let d = `M ${f(pts[0][0])} ${f(base)} L ${f(pts[0][0])} ${f(pts[0][1])}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] || p2;
    d +=
      ` C ${f(p1[0] + (p2[0] - p0[0]) / 6)} ${f(p1[1] + (p2[1] - p0[1]) / 6)}` +
      ` ${f(p2[0] - (p3[0] - p1[0]) / 6)} ${f(p2[1] - (p3[1] - p1[1]) / 6)}` +
      ` ${f(p2[0])} ${f(p2[1])}`;
  }
  const last = pts[pts.length - 1];
  return `${d} L ${f(last[0])} ${f(base)} Z`;
};

/** Stable pseudo-random in [0, 1) — scattered dots that never jump. */
export const scatter = (i, salt = 0) => {
  const v = Math.sin((i + 1) * 12.9898 + salt * 78.233) * 43758.5453;
  return v - Math.floor(v);
};
