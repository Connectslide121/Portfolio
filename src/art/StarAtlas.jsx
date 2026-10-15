import React, { useMemo, useState } from "react";
import { rng } from "./rng";
import { toolCategories } from "../data/tools";

/**
 * The tools as a planisphere. Every category is a constellation with a
 * Latin name, every tool one of its stars — the first ones listed the
 * brightest. Stars are laid out from a fixed seed, so the sky is the same
 * every visit. Hover or focus a star to read it.
 */

const SIZE = 760;
const C = SIZE / 2;
const R = 340;

const LATIN = {
  "AI & Machine Learning": "Machina",
  "Frontend Development": "Interfacies",
  "Backend Development": "Servitor",
  "Cloud & DevOps": "Nubes",
  "Game Development": "Ludus",
};

// Where each constellation sits on the wheel: [angle in degrees, distance].
const PLACES = [
  [-125, 0.6],
  [-20, 0.62],
  [70, 0.6],
  [160, 0.62],
  [0, 0],
];

const MIN = 26;
const farEnough = (points, p) => points.every((q) => Math.hypot(q.x - p.x, q.y - p.y) >= MIN);
const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

export const constellations = toolCategories.map((cat, ci) => {
  const r = rng(1121 + ci * 97);
  const [deg, away] = PLACES[ci] || [ci * 70, 0.5];
  const a = (deg * Math.PI) / 180;
  const cx = C + Math.cos(a) * R * away;
  const cy = C + Math.sin(a) * R * away;
  const spread = Math.min(92, 30 + cat.tools.length * 9);

  // Scatter the stars around the constellation's home, never closer than
  // MIN to each other...
  const points = [];
  for (let i = 0; i < cat.tools.length; i++) {
    let p;
    for (let tries = 0; tries < 60; tries++) {
      const ang = r() * Math.PI * 2;
      const rad = i === 0 ? 0 : spread * (0.3 + 0.7 * Math.sqrt(r()));
      p = { x: cx + Math.cos(ang) * rad, y: cy + Math.sin(ang) * rad * 0.8 };
      if (farEnough(points, p)) break;
    }
    points.push(p);
  }

  // ...then draw the figure the way the eye would: from the brightest star,
  // always on to the nearest one not yet joined.
  const order = [0];
  const left = new Set(points.map((_, i) => i).slice(1));
  while (left.size) {
    const last = points[order[order.length - 1]];
    let best = null;
    for (const i of left) {
      if (best === null || dist(points[i], last) < dist(points[best], last)) best = i;
    }
    order.push(best);
    left.delete(best);
  }

  const stars = cat.tools.map((tool, i) => ({ tool, ...points[i], mag: Math.max(2.2, 6.4 - i * 0.55) }));
  const figure = order.map((i) => stars[i]);
  return { name: cat.name, latin: LATIN[cat.name] || cat.name, cx, cy, stars, figure };
});

export default function StarAtlas() {
  const [hot, setHot] = useState(null); // { ci, si }
  const ticks = useMemo(() => Array.from({ length: 72 }, (_, i) => i), []);

  const star = hot && constellations[hot.ci].stars[hot.si];

  return (
    <svg className="atlas" viewBox={`0 0 ${SIZE} ${SIZE}`} role="group" aria-label="The tools as constellations">
      <defs>
        <radialGradient id="atlas-glow">
          <stop offset="0" stopColor="var(--star)" stopOpacity="0.9" />
          <stop offset="1" stopColor="var(--star)" stopOpacity="0" />
        </radialGradient>
        <clipPath id="atlas-clip">
          <circle cx={C} cy={C} r={R} />
        </clipPath>
      </defs>

      {/* The wheel: rim, degree ticks, graticule. */}
      <circle className="atlas-disc" cx={C} cy={C} r={R} />
      {[0.25, 0.5, 0.75].map((f) => (
        <circle key={f} className="atlas-ring" cx={C} cy={C} r={R * f} />
      ))}
      {[0, 30, 60, 90, 120, 150].map((d) => (
        <line
          key={d}
          className="atlas-ring"
          x1={C + Math.cos((d * Math.PI) / 180) * R}
          y1={C + Math.sin((d * Math.PI) / 180) * R}
          x2={C - Math.cos((d * Math.PI) / 180) * R}
          y2={C - Math.sin((d * Math.PI) / 180) * R}
        />
      ))}
      <ellipse className="atlas-ecliptic" cx={C} cy={C} rx={R * 0.92} ry={R * 0.34} transform={`rotate(-23.4 ${C} ${C})`} clipPath="url(#atlas-clip)" />
      <circle className="atlas-rim" cx={C} cy={C} r={R + 10} />
      {ticks.map((i) => {
        const a = (i / 72) * Math.PI * 2;
        const long = i % 6 === 0;
        return (
          <line
            key={i}
            className="atlas-tick"
            x1={C + Math.cos(a) * (R + 10)}
            y1={C + Math.sin(a) * (R + 10)}
            x2={C + Math.cos(a) * (R + (long ? 22 : 16))}
            y2={C + Math.sin(a) * (R + (long ? 22 : 16))}
          />
        );
      })}

      {/* Constellations. */}
      {constellations.map((con, ci) => (
        <g key={con.name} className={`constellation${hot?.ci === ci ? " is-hot" : ""}`}>
          <polyline className="figure" points={con.figure.map((s) => `${s.x},${s.y}`).join(" ")} />
          <text className="con-name" x={con.cx} y={Math.max(...con.stars.map((s) => s.y)) + 30}>
            {con.latin}
          </text>
          <text className="con-sub" x={con.cx} y={Math.max(...con.stars.map((s) => s.y)) + 46}>
            {con.name}
          </text>
          {con.stars.map((s, si) => (
            <g
              key={s.tool.name}
              className="star"
              tabIndex={0}
              role="img"
              aria-label={`${s.tool.name}, in ${con.latin} (${con.name})`}
              onMouseEnter={() => setHot({ ci, si })}
              onMouseLeave={() => setHot(null)}
              onFocus={() => setHot({ ci, si })}
              onBlur={() => setHot(null)}
            >
              <circle className="star-glow" cx={s.x} cy={s.y} r={s.mag * 3} fill="url(#atlas-glow)" />
              <circle className="star-core" cx={s.x} cy={s.y} r={s.mag / 1.6} />
              <circle className="star-hit" cx={s.x} cy={s.y} r="14" />
            </g>
          ))}
        </g>
      ))}

      {star && (
        <g className="star-label" pointerEvents="none">
          <line x1={star.x} y1={star.y} x2={star.x + 18} y2={star.y - 18} />
          <text x={star.x + 22} y={star.y - 20}>
            {star.tool.name}
          </text>
        </g>
      )}
    </svg>
  );
}
