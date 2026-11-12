import React, { useMemo } from "react";
import { pines, ridge, ridgePath, stars } from "./terrain";

const W = 400;
const H = 300;

const range = (opts) => ridge({ width: W, step: 4, ...opts });

/** Chapter one: the foundry in a Basque valley, at the hour the steel is poured. */
function Steel() {
  const art = useMemo(
    () => ({
      far: ridgePath(range({ seed: 101, base: 196, amp: 150, freq: 2.2, sharp: 0.8 }), H),
      mid: ridgePath(range({ seed: 113, base: 224, amp: 110, freq: 2.8, sharp: 0.6 }), H),
      near: ridgePath(range({ seed: 127, base: 268, amp: 46, freq: 2, sharp: 0.1 }), H),
    }),
    [],
  );
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="A foundry glowing in a mountain valley at sunset">
      <defs>
        <linearGradient id="pc-steel-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fbe2b0" />
          <stop offset="0.55" stopColor="#f4a763" />
          <stop offset="1" stopColor="#dd5a33" />
        </linearGradient>
        <radialGradient id="pc-steel-sun">
          <stop offset="0" stopColor="#fff6d8" stopOpacity="0.95" />
          <stop offset="1" stopColor="#ffd08a" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="pc-steel-pour">
          <stop offset="0" stopColor="#ffd98a" stopOpacity="0.9" />
          <stop offset="1" stopColor="#ff8a3c" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width={W} height={H} fill="url(#pc-steel-sky)" />
      <g className="pc-l1">
        <circle cx="286" cy="128" r="120" fill="url(#pc-steel-sun)" />
        <circle cx="286" cy="128" r="34" fill="#fff3d0" />
      </g>
      <path className="pc-l2" d={art.far} fill="#cf5338" />
      <path className="pc-l3" d={art.mid} fill="#9a3230" />

      {/* Smoke, drifting off the stack */}
      <g className="pc-smoke" fill="#f6c9a2">
        <circle cx="127" cy="150" r="9" opacity="0.75" />
        <circle cx="139" cy="134" r="13" opacity="0.6" />
        <circle cx="158" cy="118" r="17" opacity="0.45" />
        <circle cx="184" cy="104" r="21" opacity="0.3" />
      </g>

      {/* The works: a saw-tooth roof, a stack, and the light of the pour */}
      <circle cx="150" cy="232" r="70" fill="url(#pc-steel-pour)" />
      <g fill="#451722">
        <rect x="121" y="158" width="11" height="80" />
        <rect x="118" y="154" width="17" height="6" />
        <path d="M70,246 v-34 l26,-16 v16 l26,-16 v16 l26,-16 v16 l26,-16 v16 h34 v34 z" />
      </g>
      <g className="pc-windows" fill="#ffd27a">
        <rect x="80" y="222" width="12" height="9" />
        <rect x="106" y="222" width="12" height="9" />
        <rect x="140" y="222" width="12" height="9" />
        <rect x="166" y="222" width="12" height="9" />
        <rect x="190" y="222" width="12" height="9" />
      </g>
      <g className="pc-sparks" fill="#ffe2a0">
        <circle cx="146" cy="206" r="1.4" />
        <circle cx="154" cy="198" r="1.1" />
        <circle cx="161" cy="209" r="1.2" />
        <circle cx="138" cy="196" r="1" />
        <circle cx="168" cy="200" r="0.9" />
      </g>
      <path d={art.near} fill="#32101b" />
    </svg>
  );
}

/** Chapter two: the way north, drawn like a line on a chart. */
function Reset() {
  const art = useMemo(() => {
    const south = range({ seed: 201, base: 190, amp: 70, freq: 2.4, sharp: 0.6 });
    const north = range({ seed: 223, base: 176, amp: 34, freq: 3, sharp: 0.1 });
    // Closed below the waterline, so the coasts can slide a little without lifting off the sea.
    return { south: ridgePath(south, 216), north: ridgePath(north, 216), trees: pines(north, { seed: 4, gap: 5, min: 6, max: 13, from: 0.62 }) };
  }, []);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="A dashed route across the sea, from a warm coast to a northern shore of pines">
      <defs>
        <linearGradient id="pc-reset-sky" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f8dcc0" />
          <stop offset="0.5" stopColor="#e9b9b4" />
          <stop offset="1" stopColor="#a7a2cf" />
        </linearGradient>
        <linearGradient id="pc-reset-sea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8f9ac8" />
          <stop offset="1" stopColor="#47548a" />
        </linearGradient>
        <linearGradient id="pc-reset-route" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#e2602f" />
          <stop offset="1" stopColor="#d9f3ee" />
        </linearGradient>
        <clipPath id="pc-reset-west">
          <rect width="150" height={H} />
        </clipPath>
        <clipPath id="pc-reset-east">
          <rect x="236" width="164" height={H} />
        </clipPath>
      </defs>
      <rect width={W} height={H} fill="url(#pc-reset-sky)" />
      <g clipPath="url(#pc-reset-west)">
        <path className="pc-l2" d={art.south} fill="#b45d4d" />
      </g>
      <g clipPath="url(#pc-reset-east)" fill="#2e4d63">
        <g className="pc-l3">
          <path d={art.trees} />
          <path d={art.north} />
        </g>
      </g>
      <rect y="196" width={W} height="104" fill="url(#pc-reset-sea)" />
      <g className="pc-water" stroke="#f6e6d8" strokeLinecap="round" opacity="0.45">
        <path d="M24,214 h70 M130,226 h110 M270,216 h96 M60,244 h130 M230,252 h120 M36,272 h90 M180,280 h150" strokeWidth="1.2" />
      </g>

      {/* The route, and the latitudes at either end */}
      <path className="pc-route" d="M62,178 Q196,22 338,162" fill="none" stroke="url(#pc-reset-route)" strokeWidth="2" strokeLinecap="round" strokeDasharray="1 7" />
      <circle cx="62" cy="178" r="4.5" fill="#e2602f" stroke="#fff6ea" strokeWidth="1.5" />
      <circle cx="338" cy="162" r="4.5" fill="#2f8f96" stroke="#fff6ea" strokeWidth="1.5" />
      <g className="pc-label" fill="#3a2f4d">
        <text x="62" y="162" textAnchor="middle">43° N</text>
        <text x="338" y="146" textAnchor="middle">57° N</text>
      </g>
      {/* The plane flies the route (art.css); where it cannot, it sits part of the way along. */}
      <path className="pc-plane" fill="#fff6ea" d="M0,-7 l2.2,5 l7,3.4 v2 l-7,-1.6 l-0.7,4 l2.2,1.6 v1.4 l-3.7,-1 l-3.7,1 v-1.4 l2.2,-1.6 l-0.7,-4 l-7,1.6 v-2 l7,-3.4 z" />

      {/* A compass rose */}
      <g transform="translate(356 44)" fill="none" stroke="#3a2f4d" strokeWidth="1" opacity="0.7">
        <circle r="15" />
        <path d="M0,-21 L3.4,0 L0,21 L-3.4,0 Z M-21,0 L0,-3.4 L21,0 L0,3.4 Z" fill="#3a2f4d" stroke="none" opacity="0.55" />
        <path d="M0,-21 L3.4,0 L-3.4,0 Z" fill="#e2602f" stroke="none" />
      </g>
    </svg>
  );
}

/** Chapter three: a red cabin by a Småland lake, under the northern lights. */
function Software() {
  const art = useMemo(() => {
    const far = range({ seed: 307, base: 190, amp: 44, freq: 2.6, sharp: 0.3 });
    const shore = range({ seed: 331, base: 204, amp: 26, freq: 3.4, sharp: 0 });
    return {
      far: ridgePath(far, 216),
      farMirror: ridgePath(far, 200),
      farTrees: pines(far, { seed: 6, gap: 5, min: 5, max: 11 }),
      shore: ridgePath(shore, 208),
      shoreTrees: pines(shore, { seed: 8, gap: 8, min: 12, max: 30, from: 0, to: 0.56 }),
      shoreTrees2: pines(shore, { seed: 12, gap: 9, min: 14, max: 34, from: 0.78, to: 1 }),
      sky: stars(17, 46, W, 130),
    };
  }, []);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="A red cabin with a lit window by a lake, under the northern lights">
      <defs>
        <linearGradient id="pc-soft-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0c1d33" />
          <stop offset="0.6" stopColor="#1c4a5e" />
          <stop offset="1" stopColor="#5cab9f" />
        </linearGradient>
        <linearGradient id="pc-soft-lake" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3a8a8b" />
          <stop offset="1" stopColor="#0e2838" />
        </linearGradient>
        <linearGradient id="pc-soft-aurora" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8ff0c8" stopOpacity="0" />
          <stop offset="0.5" stopColor="#8ff0c8" stopOpacity="0.55" />
          <stop offset="1" stopColor="#5cc7d8" stopOpacity="0" />
        </linearGradient>
        <filter id="pc-soft-blur" x="-20%" y="-40%" width="140%" height="180%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
      </defs>
      <rect width={W} height={H} fill="url(#pc-soft-sky)" />
      <g className="pc-l1">
        {art.sky.map((s, i) => (
          <circle key={i} cx={s.x} cy={s.y} r={s.r * 0.7} fill="#eaf6ff" opacity={s.o} />
        ))}
        <g className="pc-aurora" filter="url(#pc-soft-blur)" fill="url(#pc-soft-aurora)">
          <path d="M-10,96 C70,20 150,120 232,58 S360,20 420,70 V120 C350,80 300,110 232,118 S80,150 -10,150 Z" />
          <path d="M120,60 C190,10 260,70 330,30 S400,40 420,30 V70 C380,60 330,80 260,88 S170,100 120,104 Z" opacity="0.7" />
        </g>
        <circle cx="78" cy="56" r="13" fill="#f3f0e4" />
        <circle cx="84" cy="52" r="12" fill="#12283f" />
      </g>

      <g className="pc-l3" fill="#1b4558">
        <path d={art.farTrees} />
        <path d={art.far} />
      </g>
      <rect y="198" width={W} height="102" fill="url(#pc-soft-lake)" />
      {/* The far shore, mirrored in the water */}
      <g fill="#0e2838" opacity="0.28" transform="translate(0 398) scale(1 -1)">
        <path d={art.farTrees} />
        <path d={art.farMirror} />
      </g>
      <g className="pc-water" stroke="#bfeee2" strokeLinecap="round" opacity="0.35">
        <path d="M40,222 h90 M190,214 h70 M300,228 h80 M90,246 h150 M260,256 h110 M20,270 h110 M170,282 h160" strokeWidth="1" />
      </g>

      {/* The cabin, in Falu red, and its window on the water */}
      <path className="pc-glow" d="M262,214 h10 l4,60 h-18 z" fill="#ffd98a" opacity="0.4" />
      <g fill="#0a1e2c">
        <path d={art.shoreTrees} />
        <path d={art.shoreTrees2} />
        <path d={art.shore} />
      </g>
      <g className="pc-smoke" fill="#cfe6e4">
        <circle cx="283" cy="143" r="3" opacity="0.5" />
        <circle cx="287" cy="134" r="4.5" opacity="0.34" />
        <circle cx="293" cy="123" r="6.5" opacity="0.2" />
      </g>
      <g>
        <path d="M240,178 l28,-17 l28,17 v24 h-56 z" fill="#b23a2e" />
        <path d="M236,180 l32,-20 l32,20 l-3,3 l-29,-18 l-29,18 z" fill="#f4ede0" />
        <rect x="280" y="150" width="6" height="14" fill="#f4ede0" />
        <rect className="pc-window" x="261" y="183" width="12" height="11" fill="#ffd98a" stroke="#f4ede0" strokeWidth="1.5" />
        <rect x="244" y="185" width="8" height="17" fill="#f4ede0" opacity="0.9" />
      </g>
    </svg>
  );
}

const SCENES = { steel: Steel, reset: Reset, software: Software };

/** A chapter's scene, framed like a postcard. */
export default function Postcard({ id }) {
  const Scene = SCENES[id];
  return (
    <div className={`postcard postcard-${id}`}>
      {Scene && <Scene />}
      <span className="grain" aria-hidden="true" />
    </div>
  );
}
