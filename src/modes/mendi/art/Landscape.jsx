import React, { useMemo } from "react";
import { rng } from "./rng";
import { pines, ridge, ridgePath, smoothstep, stars } from "./terrain";

const W = 1440;
const H = 640;

// The far ranges stay low on the left, where the headline sits, and rise
// towards the sun on the right.
const rise = (u) => 0.34 + 0.66 * smoothstep(0.16, 0.74, u);
const swell = (u) => 0.6 + 0.4 * smoothstep(0.1, 0.8, u);

// Far to near. The last one is the colour of the page, so the page seems to
// begin on the nearest hill.
const LAYERS = [
  { seed: 7, base: 404, amp: 420, freq: 3.3, sharp: 0.9, power: 1.4, gain: 0.55, envelope: rise },
  { seed: 19, base: 440, amp: 350, freq: 4.1, sharp: 0.8, power: 1.3, gain: 0.55, envelope: rise },
  { seed: 31, base: 478, amp: 270, freq: 4.4, sharp: 0.6, power: 1.15, envelope: swell },
  { seed: 43, base: 522, amp: 210, freq: 4.8, sharp: 0.45, envelope: swell },
  { seed: 57, base: 566, amp: 150, freq: 4.6, sharp: 0.25, trees: { seed: 5, gap: 9, min: 9, max: 19 } },
  { seed: 69, base: 612, amp: 120, freq: 2.6, sharp: 0.1, trees: { seed: 9, gap: 15, min: 20, max: 44 } },
  { seed: 83, base: 604, amp: 52, freq: 1.5, sharp: 0, octaves: 3 },
];

const BIRDS = [
  [0, 0, 1],
  [26, 12, 0.8],
  [-22, 16, 0.85],
  [54, 28, 0.7],
  [-48, 34, 0.75],
  [18, 40, 0.6],
];

// Specks in the air over the forest: dust in the morning light by day,
// fireflies by night. Where each one starts, how big it is, how long it
// takes to rise and which way it drifts.
const MOTES = (() => {
  const r = rng(29);
  return Array.from({ length: 16 }, () => ({
    "--x": `${(3 + r() * 94).toFixed(1)}%`,
    "--y": `${(3 + r() * 30).toFixed(1)}%`,
    "--s": `${(2 + r() * 2.4).toFixed(1)}px`,
    "--t": `${(9 + r() * 11).toFixed(1)}s`,
    "--w": `${(-r() * 20).toFixed(1)}s`,
    "--dx": `${Math.round(-36 + r() * 72)}px`,
  }));
})();

/**
 * The hero: a mountain range at dawn (light) or under the northern lights
 * (dark). Every range is its own layer, so they can drift apart: the hero
 * sets --sy (its scroll) and --mx / --my (the pointer), and each layer
 * takes its own share of them. The far ranges keep most of the scroll and
 * little of the pointer; the near ones the other way round.
 */
export default function Landscape() {
  const { layers, sun } = useMemo(() => {
    const ranges = LAYERS.map((l) => ridge({ ...l, width: W }));
    // The sun comes up in the lowest saddle of the farthest range, right of
    // centre, with its lower edge still behind the ridge.
    const saddle = ranges[0].filter(([x]) => x > 800 && x < 1230).reduce((low, p) => (p[1] > low[1] ? p : low));
    return {
      sun: { x: saddle[0], y: saddle[1] - 22 },
      layers: ranges.map((pts, i) => ({ d: ridgePath(pts, H + 40), trees: LAYERS[i].trees ? pines(pts, LAYERS[i].trees) : "" })),
    };
  }, []);
  const sky = useMemo(() => stars(3, 150, W, 620), []);

  return (
    <div className="landscape" aria-hidden="true">
      <svg className="land-stars" viewBox={`0 0 ${W} 900`} preserveAspectRatio="xMidYMin slice">
        {sky.map((s, i) => (
          <circle key={i} className={s.twinkle ? "star twinkle" : "star"} cx={s.x} cy={s.y} r={s.r} opacity={s.o} style={s.twinkle ? { "--i": i % 7 } : undefined} />
        ))}
      </svg>

      <div className="aurora">
        <span />
        <span />
        <span />
      </div>
      <span className="shooting" />
      <span className="shooting" />

      <div className="clouds">
        <span />
        <span />
        <span />
        <span />
      </div>

      <div className="land-art">
        <svg className="land-layer land-sun" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMax slice">
          <defs>
            <radialGradient id="mendi-glow">
              <stop offset="0" className="glow-in" />
              <stop offset="1" className="glow-out" />
            </radialGradient>
          </defs>
          {/* The sun by day; by night it lifts clear of the ridge and thins to a crescent. */}
          <g className="sky-body">
            <circle className="sky-glow" cx={sun.x} cy={sun.y} r="320" fill="url(#mendi-glow)" />
            <circle className="sun-disc" cx={sun.x} cy={sun.y} r="50" />
            <path className="moon" transform={`rotate(-32 ${sun.x} ${sun.y})`} d={`M${sun.x},${sun.y - 42}A42,42 0 0 0 ${sun.x},${sun.y + 42}A27,42 0 0 1 ${sun.x},${sun.y - 42}Z`} />
          </g>
          <g className="birds">
            {BIRDS.map(([x, y, s], i) => (
              <g key={i} transform={`translate(${sun.x + 210 + x} ${sun.y - 200 + y}) scale(${s})`}>
                <path style={{ "--i": i }} d="M-9,0 q4.5,-6 9,0 q4.5,-6 9,0" />
              </g>
            ))}
          </g>
        </svg>

        {layers.map((l, i) => (
          <React.Fragment key={i}>
            {(i === 2 || i === 4 || i === 5) && <span className={`mist mist-${i}`} />}
            {i === LAYERS.length - 1 && (
              <div className="motes">
                {MOTES.map((style, n) => (
                  <span key={n} style={style} />
                ))}
              </div>
            )}
            <svg className={`land-layer ridge-${i + 1}`} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMax slice">
              {l.trees && <path d={l.trees} />}
              <path d={l.d} />
            </svg>
          </React.Fragment>
        ))}
      </div>

      <div className="grain" />
    </div>
  );
}
