import React from "react";
import { BEATS, SCENE_W, VIEW_H, FOCAL, anchor } from "./config";
import { JourneyDefs, Sky, Stream, Ground, Particles } from "./parts";

// Art style B — recognisable places, every shape authored as coordinates.
// A factory is three polygons; pines are triangles; a dome is an arc. No
// drawing tool, no raster assets (D7).

const KINDS = ["spark", "dust", "snow"];
const BASE = 848; // where scene props meet the ground

/** Ambient ridgeline for a whole layer — seeded so it stays stable per render. */
const ridge = (y, amp, step, seed) => {
  const pts = [];
  let n = seed;
  const rnd = () => ((n = (n * 9301 + 49297) % 233280) / 233280);
  for (let x = -200; x <= 5800; x += step) {
    pts.push(`${x},${(y - rnd() * amp).toFixed(0)}`);
  }
  return `M ${pts.join(" L ")} L 5800 1080 L -200 1080 Z`;
};

/** Sawtooth factory roof — the classic north-light foundry hall. */
const sawtooth = (x, y, teeth, w, h) => {
  let d = `M ${x} ${y}`;
  for (let i = 0; i < teeth; i++) {
    d += ` L ${x + i * w} ${y - h} L ${x + (i + 1) * w} ${y}`;
  }
  return `${d} L ${x + teeth * w} ${BASE} L ${x} ${BASE} Z`;
};

// Scene props must fit the window left over beside the card: local 0..1080.

function Foundry({ ax }) {
  return (
    <g fill="var(--j-mid)">
      {/* chimney + cap */}
      <polygon points={`${ax + 40},${BASE} ${ax + 56},262 ${ax + 112},262 ${ax + 128},${BASE}`} />
      <rect x={ax + 28} y="240" width="112" height="26" />
      {/* main hall with north-light roof */}
      <path d={sawtooth(ax + 176, 576, 4, 118, 76)} />
      {/* annex + gantry crane */}
      <rect x={ax + 676} y="648" width="196" height={BASE - 648} />
      <rect x={ax + 658} y="620" width="232" height="18" />
      {/* ladle on its stand, tipped toward the stream */}
      <polygon points={`${ax + 916},688 ${ax + 1028},688 ${ax + 1006},798 ${ax + 938},798`} />
      <rect x={ax + 962} y="798" width="20" height="42" />
      <rect x={ax + 926} y={BASE - 14} width="92" height="16" />
    </g>
  );
}

function IndiaCity({ ax }) {
  const towers = [
    [20, 566, 108],
    [148, 624, 84],
    [258, 512, 98],
    [860, 592, 122],
    [1000, 544, 88],
  ];
  return (
    <g fill="var(--j-mid)">
      {towers.map(([x, y, w], i) => (
        <rect key={i} x={ax + x} y={y} width={w} height={BASE - y} />
      ))}
      {/* domed hall — arc + drum + finial */}
      <path d={`M ${ax + 420} 664 A 170 170 0 0 1 ${ax + 760} 664 Z`} />
      <rect x={ax + 420} y="664" width="340" height={BASE - 664} />
      <rect x={ax + 582} y="470" width="16" height="52" />
      {/* flanking minarets */}
      <rect x={ax + 386} y="596" width="26" height={BASE - 596} />
      <rect x={ax + 768} y="596" width="26" height={BASE - 596} />
      <path d={`M ${ax + 386} 596 A 13 13 0 0 1 ${ax + 412} 596 Z`} />
      <path d={`M ${ax + 768} 596 A 13 13 0 0 1 ${ax + 794} 596 Z`} />
    </g>
  );
}

function SwedenForest({ ax }) {
  // Overlapping wide triangles read as a forest; narrow ones read as obelisks.
  const pines = Array.from({ length: 9 }).map((_, i) => {
    const x = ax + 10 + i * 104;
    const h = 200 + ((i * 53) % 150);
    return { x, h, w: 118 + ((i * 29) % 46) };
  });
  return (
    <g>
      <g fill="var(--j-mid)">
        {pines.map((p, i) => (
          <g key={i}>
            <polygon
              points={`${p.x},${BASE} ${p.x + p.w / 2},${BASE - p.h} ${p.x + p.w},${BASE}`}
            />
            {/* upper tier, tucked in — a conifer, not a spire */}
            <polygon
              points={`${p.x + p.w * 0.17},${BASE - p.h * 0.58} ${p.x + p.w / 2},${
                BASE - p.h * 1.02
              } ${p.x + p.w * 0.83},${BASE - p.h * 0.58}`}
            />
          </g>
        ))}
      </g>
      {/* falu-red cottage — the one warm note left in the cold, kept muted so
          it reads as a lit window at dusk rather than a toy */}
      <g opacity="0.86">
        <polygon points={`${ax + 812},706 ${ax + 900},640 ${ax + 988},706`} fill="#5c2018" />
        <rect x={ax + 828} y="706" width="144" height={BASE - 706} fill="#6b271e" />
        <rect x={ax + 866} y="742" width="38" height="38" fill="#d8c48a" opacity="0.75" />
        <rect x={ax + 922} y="760" width="30" height={BASE - 760} fill="#c9d5e6" opacity="0.6" />
      </g>
    </g>
  );
}

const SCENES = [Foundry, IndiaCity, SwedenForest];

export default function WorldSilhouette() {
  return (
    <svg
      className="j-world"
      viewBox={`0 0 ${SCENE_W} ${VIEW_H}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <JourneyDefs />
      <Sky />

      {/* far — ambient ridgeline only, never scene-specific */}
      <g data-layer="far">
        <path d={ridge(660, 150, 240, 7)} fill="var(--j-far)" />
      </g>

      {/* mid — a second, nearer ridge for depth */}
      <g data-layer="mid">
        <path d={ridge(778, 70, 180, 31)} fill="var(--j-far)" opacity="0.6" />
      </g>

      {/* scene — the places, crossfaded per beat */}
      <g data-layer="scene">
        {BEATS.map((beat, i) => {
          const Scene = SCENES[i];
          const ax = anchor(i, 0.9) + FOCAL;
          return (
            <g key={beat.id} data-atmos={beat.id}>
              {/* the Indian sun, behind its skyline */}
              {i === 1 && (
                <circle cx={ax + 590} cy="316" r="236" fill="var(--j-accent)" opacity="0.2" />
              )}
              <Scene ax={ax} />
            </g>
          );
        })}
      </g>

      {/* ground — the continuous floor and the stream */}
      <g data-layer="ground">
        <Ground />
        <Stream />
      </g>

      {/* fore — scrub and particles */}
      <g data-layer="fore">
        {BEATS.map((beat, i) => (
          <g key={beat.id} data-atmos={beat.id} fill="var(--j-ground)">
            {Array.from({ length: 12 }).map((_, r) => (
              <ellipse
                key={r}
                cx={anchor(i, 1.35) + 90 + r * 156}
                cy={944 + (r % 4) * 16}
                rx={38 + (r % 3) * 18}
                ry={12}
              />
            ))}
          </g>
        ))}
        {BEATS.map((beat, i) => (
          <Particles key={beat.id} scene={{ id: beat.id, i }} kind={KINDS[i]} />
        ))}
      </g>
    </svg>
  );
}
