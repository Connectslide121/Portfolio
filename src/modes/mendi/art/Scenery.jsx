import React, { useMemo } from "react";
import { contours, pines, ridge, ridgePath, stars } from "./terrain";

/**
 * The fold between two sections: a low ridge in the colour of the section
 * below, sitting on the bottom edge of the one above.
 */
export function Fold({ seed = 1, to = "paper" }) {
  const d = useMemo(
    () => [
      ridgePath(ridge({ seed, base: 92, amp: 120, freq: 2.2, sharp: 0.45, step: 8 }), 121),
      ridgePath(ridge({ seed: seed + 50, base: 112, amp: 90, freq: 1.7, sharp: 0.15, step: 8 }), 121),
    ],
    [seed],
  );
  return (
    <svg className={`fold fold-to-${to}`} viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true">
      <path className="fold-back" d={d[0]} />
      <path className="fold-front" d={d[1]} />
    </svg>
  );
}

/** Contour lines, as on a topographic map. Every third line is an index contour. */
export function Contours({ seed = 5 }) {
  const lines = useMemo(() => contours({ seed, width: 1440, height: 640, cols: 96, rows: 42, levels: 11, scale: 5.2 }), [seed]);
  return (
    <svg className="contours" viewBox="0 0 1440 640" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      {lines.map((d, i) => (
        <path key={i} className={i % 3 === 1 ? "is-index" : undefined} d={d} />
      ))}
    </svg>
  );
}

const W = 1440;
const H = 380;
const RANGES = [
  { seed: 401, base: 250, amp: 260, freq: 2.2, sharp: 0.75 },
  { seed: 419, base: 290, amp: 220, freq: 2.8, sharp: 0.55 },
  { seed: 433, base: 326, amp: 170, freq: 3.3, sharp: 0.3, trees: { seed: 21, gap: 9, min: 9, max: 18 } },
  { seed: 457, base: 372, amp: 130, freq: 2.4, sharp: 0.1, trees: { seed: 27, gap: 14, min: 18, max: 40 } },
];

/** Where the page ends: the same mountains, cold now. */
export function Dusk() {
  const layers = useMemo(
    () =>
      RANGES.map((l) => {
        const pts = ridge({ ...l, width: W });
        return { d: ridgePath(pts, H + 2), trees: l.trees ? pines(pts, l.trees) : "" };
      }),
    [],
  );
  const sky = useMemo(() => stars(41, 70, W, 220), []);
  return (
    <svg className="dusk" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      <g className="dusk-stars">
        {sky.map((s, i) => (
          <circle key={i} cx={s.x} cy={s.y} r={s.r} opacity={s.o} />
        ))}
      </g>
      {layers.map((l, i) => (
        <g key={i} className={`dusk-${i + 1}`}>
          {l.trees && <path d={l.trees} />}
          <path d={l.d} />
        </g>
      ))}
    </svg>
  );
}

/** The mark: two peaks and a sun. */
export function Mark() {
  return (
    <svg className="mark" viewBox="0 0 32 32" aria-hidden="true">
      <circle className="mark-sun" cx="22.5" cy="10" r="4.5" />
      <path className="mark-far" d="M2,27 L12,9.5 L17.5,18 L21,13.5 L30,27 Z" />
      <path className="mark-near" d="M2,27 L9.5,17 L14,22 L18.5,16.5 L30,27 Z" />
    </svg>
  );
}
