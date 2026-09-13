// Orthographic globe maths for JourneyGlobe.jsx.
//
// No three.js and no model: an orthographic globe is a sphere seen from
// infinitely far away, which is four lines of trigonometry. Meridians and
// parallels are pure maths, so the whole thing ships as code rather than as
// an asset — the same bargain the rest of the journey's art makes (D7).
//
// EVERY SAMPLE POINT IS PRECOMPUTED. A point's own latitude and longitude
// never change; only the viewpoint does. So each point carries the sines and
// cosines of its own position, and a frame resolves sin/cos of (lon - lon0)
// by angle subtraction rather than by calling Math.sin again. That turns
// ~650 trig pairs per frame into ~650 multiply-adds, which is what makes it
// affordable to drive this straight from the journey's render loop.

const RAD = Math.PI / 180;

/** A point on the sphere, with its own trig resolved once. */
export const point = (lat, lon) => ({
  lat,
  lon,
  sinP: Math.sin(lat * RAD),
  cosP: Math.cos(lat * RAD),
  sinL: Math.sin(lon * RAD),
  cosL: Math.cos(lon * RAD),
});

/** The viewpoint, likewise resolved once per frame rather than per point. */
export const view = (lat0, lon0) => ({
  sinP0: Math.sin(lat0 * RAD),
  cosP0: Math.cos(lat0 * RAD),
  sinL0: Math.sin(lon0 * RAD),
  cosL0: Math.cos(lon0 * RAD),
});

/**
 * Project a point, or return null when it is on the far side.
 *
 * `cosc` is the cosine of the angular distance from the point to the centre
 * of the visible disc; it going negative IS the horizon, which is why the
 * test is free rather than a separate clip.
 */
export const project = (pt, v, r) => {
  const dSin = pt.sinL * v.cosL0 - pt.cosL * v.sinL0; // sin(lon - lon0)
  const dCos = pt.cosL * v.cosL0 + pt.sinL * v.sinL0; // cos(lon - lon0)
  const cosc = v.sinP0 * pt.sinP + v.cosP0 * pt.cosP * dCos;
  if (cosc <= 0) return null;
  return {
    x: r * pt.cosP * dSin,
    y: -r * (v.cosP0 * pt.sinP - v.sinP0 * pt.cosP * dCos),
    z: cosc, // 1 facing the viewer, 0 at the limb — doubles as a fade
  };
};

/**
 * A run of points as one path, broken wherever it goes over the horizon.
 *
 * The pen lifts instead of the strand being clipped, so a meridian that
 * disappears round the back and comes out the other side draws as two
 * segments rather than one line across the disc.
 *
 * `count` draws a prefix of the run, for the route arc that is still being
 * travelled — cheaper than slicing the array to the same effect.
 */
// Math.round rather than toFixed: this runs a few hundred times a frame and
// toFixed is an order of magnitude slower for the same one decimal place.
const r1 = (v) => Math.round(v * 10) / 10;

export const strand = (pts, v, r, count = pts.length) => {
  let d = "";
  let pen = false;
  for (let i = 0; i < count; i++) {
    const q = project(pts[i], v, r);
    if (!q) {
      pen = false;
      continue;
    }
    d += (pen ? "L" : "M") + r1(q.x) + " " + r1(q.y);
    pen = true;
  }
  return d;
};

/** Meridians and parallels, as arrays of precomputed points. */
/**
 * Meridians and parallels, as arrays of precomputed points.
 *
 * `step` is the sampling in degrees, and 8 is not a compromise: at this
 * radius the chord error of an 8-degree step is about half a pixel, while the
 * sample count is what the per-frame cost is made of.
 */
export const graticule = ({ meridians = 10, parallels = 5, step = 8 } = {}) => {
  const lines = [];
  for (let m = 0; m < meridians; m++) {
    const lon = -180 + (360 / meridians) * m;
    const pts = [];
    for (let lat = -84; lat <= 84; lat += step) pts.push(point(lat, lon));
    lines.push(pts);
  }
  for (let p = 1; p <= parallels; p++) {
    const lat = -90 + (180 / (parallels + 1)) * p;
    const pts = [];
    for (let lon = -180; lon <= 180; lon += step) pts.push(point(lat, lon));
    lines.push(pts);
  }
  return lines;
};

const toVec = (lat, lon) => {
  const p = lat * RAD;
  const l = lon * RAD;
  return [Math.cos(p) * Math.cos(l), Math.cos(p) * Math.sin(l), Math.sin(p)];
};

/**
 * The great-circle route between two places, sampled.
 *
 * Slerp between the two unit vectors — the shortest path over a sphere is an
 * arc, and drawing a straight line in lat/lon instead is the thing that makes
 * flight-path graphics look wrong.
 */
export const arc = (a, b, steps = 48) => {
  const va = toVec(a.lat, a.lon);
  const vb = toVec(b.lat, b.lon);
  const dot = Math.min(1, Math.max(-1, va[0] * vb[0] + va[1] * vb[1] + va[2] * vb[2]));
  const omega = Math.acos(dot);
  const out = [];
  // Coincident endpoints (three consecutive Swedish beats) have no arc and
  // no defined direction to interpolate along.
  if (omega < 1e-6) return out;
  const sinOmega = Math.sin(omega);
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const ka = Math.sin((1 - t) * omega) / sinOmega;
    const kb = Math.sin(t * omega) / sinOmega;
    const x = ka * va[0] + kb * vb[0];
    const y = ka * va[1] + kb * vb[1];
    const z = ka * va[2] + kb * vb[2];
    out.push(point(Math.asin(z) / RAD, Math.atan2(y, x) / RAD));
  }
  return out;
};

/** Shortest signed way round from a to b, so a spin never takes the long way. */
export const shortestLon = (a, b) => {
  let d = ((b - a + 540) % 360) - 180;
  return a + d;
};
