import React from "react";
import { BASE } from "./config";
import { logoFor } from "../data/techLogos";

// Every place is authored as coordinates — no drawing tool, no raster assets
// (D7). Each scene fits local 0..1080, to the right of the beat card.

/** Sawtooth north-light roof — the classic foundry / workshop hall. */
const sawtooth = (x, y, teeth, w, h) => {
  let d = `M ${x} ${y}`;
  for (let i = 0; i < teeth; i++) {
    d += ` L ${x + i * w} ${y - h} L ${x + (i + 1) * w} ${y}`;
  }
  return `${d} L ${x + teeth * w} ${BASE} L ${x} ${BASE} Z`;
};

/** A grid of lit windows — reused by the school and the office. */
const windows = (x, y, cols, rows, gap = 34, size = 16) =>
  Array.from({ length: cols * rows }).map((_, i) => ({
    x: x + (i % cols) * gap,
    y: y + Math.floor(i / cols) * (gap + 4),
    size,
    lit: (i * 7) % 5 !== 0,
  }));

/** 2005-2010 — the engineering school on the Basque coast. */
export function Origin({ ax }) {
  return (
    <g>
      <g fill="var(--j-mid)">
        {/* long teaching block */}
        <rect x={ax + 120} y="556" width="520" height={BASE - 556} />
        <rect x={ax + 100} y="536" width="560" height="24" />
        {/* stair tower */}
        <rect x={ax + 660} y="452" width="120" height={BASE - 452} />
        <rect x={ax + 650} y="436" width="140" height="20" />
        {/* low workshop annex with a saw roof — where the metal was */}
        <path d={sawtooth(ax + 800, 700, 3, 92, 52)} />
      </g>
      {/* lit windows: study, not industry */}
      <g fill="var(--j-streamCore)" opacity="0.34">
        {windows(ax + 156, 596, 13, 5).map(
          (w, i) => w.lit && <rect key={i} x={w.x} y={w.y} width={w.size} height="22" />
        )}
        {windows(ax + 690, 492, 2, 8).map(
          (w, i) => w.lit && <rect key={`t${i}`} x={w.x} y={w.y} width={w.size} height="20" />
        )}
      </g>
    </g>
  );
}

/** 2011-2023 — the steel foundry. */
export function Foundry({ ax }) {
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

/** 2017 — the second plant, India. */
export function IndiaCity({ ax }) {
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

/** 2023 — Växjö. Arrival, and the cold. */
export function SwedenForest({ ax }) {
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
            <polygon points={`${p.x},${BASE} ${p.x + p.w / 2},${BASE - p.h} ${p.x + p.w},${BASE}`} />
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

/** 2024 — Sprinta. The city at night; the work is inside now. */
export function Office({ ax }) {
  const blocks = [
    [40, 470, 150],
    [210, 396, 130],
    [356, 520, 116],
    [700, 430, 168],
    [890, 340, 142],
    [1050, 500, 30],
  ];
  return (
    <g>
      <g fill="var(--j-mid)">
        {blocks.map(([x, y, w], i) => (
          <rect key={i} x={ax + x} y={y} width={w} height={BASE - y} />
        ))}
        {/* rooftop plant + mast */}
        <rect x={ax + 916} y="300" width="42" height="44" />
        <rect x={ax + 934} y="238" width="6" height="66" />
      </g>
      {/* lit windows — the only warmth in the frame */}
      <g fill="var(--j-streamCore)" opacity="0.3">
        {[
          ...windows(ax + 62, 500, 4, 8),
          ...windows(ax + 232, 428, 3, 10),
          ...windows(ax + 722, 462, 4, 9),
          ...windows(ax + 912, 372, 3, 11),
        ].map((w, i) => w.lit && <rect key={i} x={w.x} y={w.y} width="14" height="18" />)}
      </g>
    </g>
  );
}

export const TINTS = {
  client: "#7dd3fc",
  compute: "#93c5fd",
  data: "#86efac",
  ai: "#fca5a5",
};

const PILL_H = 48;
const PILL_R = PILL_H / 2; // fully rounded — no square corners anywhere
const LOGO = 24; // logo box inside the pill
const LOGO_R = 17; // the light disc behind it

// Local layout. Frontend converges into the backend, which then branches two
// ways: data one side, AI the other. AI is a sibling of the data layer, not
// something downstream of it.
const COLUMNS = {
  frontend: { x: 0, w: 234, gap: 74, mid: 390 },
  backend: { x: 400, w: 238, gap: 74, mid: 390 },
  data: { x: 844, w: 260, gap: 74, mid: 196 },
  ai: { x: 844, w: 260, gap: 74, mid: 604 },
};

const J1 = [328, 390]; // frontend -> backend waist
const J2 = [702, 390]; // backend exit
const J3 = [784, 196]; // into the data branch
const J4 = [784, 604]; // into the AI branch

const laidOut = (group) => {
  const col = COLUMNS[group.id];
  const n = group.items.length;
  const top = col.mid - ((n - 1) * col.gap) / 2;
  return group.items.map((label, i) => ({
    label,
    tint: group.tint,
    x: col.x,
    w: col.w,
    cy: top + i * col.gap,
  }));
};

/** Smooth S-curve between two points — the connector shape from the study. */
const link = ([x1, y1], [x2, y2]) => {
  const mx = x1 + (x2 - x1) / 2;
  return `M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`;
};

/**
 * 2025 — the pull-back. The journey stops being a line and becomes the stack
 * that came out of it: recognisable names rather than internal architecture
 * (see the note on `stack` in src/data/journey.js), wired as a flow rather
 * than laid out as a table.
 */
export function StackGraph({ ax, oy = 70, groups }) {
  const byId = Object.fromEntries(groups.map((g) => [g.id, laidOut(g)]));
  const { frontend = [], backend = [], data = [], ai = [] } = byId;

  const edges = [
    ...frontend.map((p) => link([p.x + p.w, p.cy], J1)),
    ...backend.map((p) => link(J1, [p.x, p.cy])),
    ...backend.map((p) => link([p.x + p.w, p.cy], J2)),
    link(J2, J3),
    link(J2, J4),
    ...data.map((p) => link(J3, [p.x, p.cy])),
    ...ai.map((p) => link(J4, [p.x, p.cy])),
  ];

  const pills = [...frontend, ...backend, ...data, ...ai];

  return (
    <g transform={`translate(${ax},${oy})`}>
      <g
        data-arch-edge
        fill="none"
        stroke="var(--j-stream)"
        strokeWidth="1.6"
        opacity="0.45"
      >
        {edges.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </g>

      {/* junction dots, where the flow gathers and splits */}
      <g fill="var(--j-stream)" opacity="0.5">
        {[J1, J2, J3, J4].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="4" />
        ))}
      </g>

      {pills.map((pill) => {
        const logo = logoFor(pill.label);
        return (
          <g key={pill.label} data-arch-node>
            <rect
              x={pill.x}
              y={pill.cy - PILL_H / 2}
              width={pill.w}
              height={PILL_H}
              rx={PILL_R}
              fill="var(--j-ground)"
              stroke={TINTS[pill.tint]}
              strokeWidth="1.5"
              opacity="0.95"
            />
            {/* Logo sits in a disc whose colour is chosen from the artwork's
                tone, so both near-white and near-black marks stay legible
                (see src/data/techLogos.js). Label reads left-aligned beside
                it. */}
            {logo && (
              <>
                <circle
                  cx={pill.x + PILL_H / 2}
                  cy={pill.cy}
                  r={LOGO_R}
                  fill={logo.tone === "light" ? "#111827" : "#ffffff"}
                  stroke={TINTS[pill.tint]}
                  strokeOpacity="0.35"
                  strokeWidth="1"
                  opacity="0.96"
                />
                <image
                  href={logo.src}
                  x={pill.x + PILL_H / 2 - LOGO / 2}
                  y={pill.cy - LOGO / 2}
                  width={LOGO}
                  height={LOGO}
                  preserveAspectRatio="xMidYMid meet"
                />
              </>
            )}
            <text
              x={logo ? pill.x + PILL_H + 4 : pill.x + pill.w / 2}
              y={pill.cy + 7}
              textAnchor={logo ? "start" : "middle"}
              fill={TINTS[pill.tint]}
              fontSize="20"
              fontWeight="600"
            >
              {pill.label}
            </text>
          </g>
        );
      })}
    </g>
  );
}

/**
 * The one shape that identifies each place, as a local-x centre. A receding
 * scene is clipped to a narrow slice around this point: a full 1080-wide
 * composition shrunk into the distance still sprawls across the current
 * scene and disappears behind it, whereas a single landmark reads clearly.
 */
export const LANDMARK_X = {
  origin: 700, // the stair tower
  foundry: 300, // chimney and the sawtooth hall
  india: 590, // the dome
  sweden: 400, // the pines
  sprinta: 880, // the tallest block
};

export const LANDMARK_W = 460;

/** Keyed by beat id, so adding or reordering beats cannot shift the mapping. */
export const SCENE_BY_BEAT = {
  origin: Origin,
  foundry: Foundry,
  india: IndiaCity,
  sweden: SwedenForest,
  sprinta: Office,
  architect: null, // the stack diagram is drawn from data instead
  work: null, // the closing gallery is real DOM — see ProjectGallery.jsx
};
