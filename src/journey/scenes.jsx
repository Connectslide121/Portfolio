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

/**
 * Light spilled onto the floor in front of a source. Every accent uses one:
 * a glow with nothing under it looks pasted on, whereas light landing on the
 * ground places it in the scene.
 */
const Spill = ({ x, y, rx = 110, ry = 18, tint = "var(--j-stream)", opacity = 0.32 }) => (
  <ellipse cx={x} cy={y} rx={rx} ry={ry} fill={tint} filter="url(#jGlow)" opacity={opacity} />
);

/** The bright edge a nearby light throws along a silhouette facing it. */
const Rim = ({ d, width = 2.5, opacity = 0.7, tint = "var(--j-streamCore)" }) => (
  <path d={d} fill="none" stroke={tint} strokeWidth={width} strokeLinecap="round" opacity={opacity} />
);

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

      {/* Accent: the workshop door, open, with the forge inside. The first
          time the story meets heat — small, because this is only the start. */}
      <g className="acc">
        <Spill x={ax + 862} y={BASE + 2} rx="104" ry="17" opacity="0.26" />
        <rect
          className="acc-flicker"
          x={ax + 840}
          y="752"
          width="44"
          height={BASE - 752}
          fill="var(--j-stream)"
          filter="url(#jGlowSoft)"
        />
        <rect x={ax + 848} y="762" width="28" height={BASE - 762} fill="var(--j-streamCore)" />
        <Rim d={`M ${ax + 838} 750 L ${ax + 838} ${BASE}`} width="2.5" />
        <Rim d={`M ${ax + 886} 750 L ${ax + 886} ${BASE}`} width="2.5" opacity={0.45} />
        <Rim d={`M ${ax + 838} 750 L ${ax + 886} 750`} width="2.5" opacity={0.55} />
      </g>
    </g>
  );
}

/**
 * 2011-2023 — the steel foundry.
 *
 * The accent is the pour: a tilted ladle running molten steel into a sand
 * mould, with the stream the brightest thing in the frame.
 *
 * The technique that makes it read is RIM LIGHT. The stream is a light
 * source, so the edges facing it catch a bright line while the rest of the
 * silhouette stays dark. Without that the props were unlit cut-outs sitting
 * near a glow; with it they belong to the same scene.
 */
export function Foundry({ ax }) {
  const POUR = `M ${ax + 880} 700 C ${ax + 866} 736 ${ax + 846} 768 ${ax + 818} 800`;
  return (
    <g>
      <g fill="var(--j-mid)">
        {/* chimney + cap */}
        <polygon points={`${ax + 40},${BASE} ${ax + 56},262 ${ax + 112},262 ${ax + 128},${BASE}`} />
        <rect x={ax + 28} y="240" width="112" height="26" />
        {/* main hall with north-light roof */}
        <path d={sawtooth(ax + 176, 576, 4, 118, 76)} />
        {/* annex */}
        <rect x={ax + 640} y="648" width="150" height={BASE - 648} />
        <rect x={ax + 624} y="620" width="184" height="18" />
        {/* the ladle, tilted to pour, hung on its trunnion post */}
        <polygon
          points={`${ax + 880},700 ${ax + 1024},652 ${ax + 1010},754 ${ax + 908},790`}
        />
        <rect x={ax + 1030} y="672" width="16" height={BASE - 672} />
        <rect x={ax + 1004} y="678" width="34" height="16" />
        {/* the sand mould receiving it */}
        <path
          d={`M ${ax + 760} ${BASE} L ${ax + 772} 796 L ${ax + 872} 796 L ${ax + 884} ${BASE} Z`}
        />
      </g>

      {/* --- the accent ------------------------------------------------- */}
      <g className="fy-pour">
        {/* light thrown onto the floor around the mould */}
        <ellipse
          cx={ax + 820}
          cy={BASE - 4}
          rx="170"
          ry="26"
          fill="var(--j-stream)"
          filter="url(#jGlow)"
          opacity="0.3"
        />

        {/* rim light: the edges facing the stream catch it */}
        <g
          fill="none"
          stroke="var(--j-streamCore)"
          strokeLinecap="round"
          opacity="0.75"
        >
          <path d={`M ${ax + 880} 700 L ${ax + 908} 790`} strokeWidth="3" />
          <path d={`M ${ax + 880} 700 L ${ax + 1024} 652`} strokeWidth="2" opacity="0.5" />
          <path d={`M ${ax + 772} 796 L ${ax + 872} 796`} strokeWidth="3" />
          <path d={`M ${ax + 760} ${BASE} L ${ax + 772} 796`} strokeWidth="2" opacity="0.6" />
        </g>

        <path
          d={POUR}
          fill="none"
          stroke="var(--j-stream)"
          strokeWidth="24"
          strokeLinecap="round"
          filter="url(#jGlow)"
          opacity="0.8"
        />
        <path
          d={POUR}
          fill="none"
          stroke="var(--j-stream)"
          strokeWidth="8"
          strokeLinecap="round"
          filter="url(#jGlowSoft)"
        />
        <path
          d={POUR}
          fill="none"
          stroke="var(--j-streamCore)"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        {/* a brighter slug running down, so the stream reads as flowing */}
        <path
          className="fy-pour-run"
          d={POUR}
          fill="none"
          stroke="#ffffff"
          strokeWidth="5"
          strokeLinecap="round"
        />

        {/* molten pool in the mould, and the glow off the ladle's lip */}
        <ellipse
          className="fy-pool"
          cx={ax + 820}
          cy="796"
          rx="54"
          ry="11"
          fill="var(--j-stream)"
          filter="url(#jGlowSoft)"
        />
        <ellipse cx={ax + 820} cy="796" rx="40" ry="6.5" fill="var(--j-streamCore)" />
        <ellipse
          cx={ax + 886}
          cy="698"
          rx="20"
          ry="10"
          fill="var(--j-streamCore)"
          filter="url(#jGlowSoft)"
          opacity="0.9"
        />
      </g>
    </g>
  );
}

/** 2017 — the second plant, India. */
export function IndiaCity({ ax }) {
  return (
    <g>
      <IndiaSilhouette ax={ax} />
      <IndiaAccent ax={ax} />
    </g>
  );
}

function IndiaSilhouette({ ax }) {
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

/** India's accent, kept separate so the silhouette group stays one fill. */
function IndiaAccent({ ax }) {
  const TAP = `M ${ax + 612} 792 C ${ax + 624} 812 ${ax + 636} 826 ${ax + 650} 838`;
  return (
    <g className="acc">
      <Spill x={ax + 646} y={BASE + 2} rx="126" ry="19" opacity="0.3" />
      {/* the furnace mouth, and the tap running out of it */}
      <rect
        className="acc-flicker"
        x={ax + 566}
        y="778"
        width="52"
        height={BASE - 778}
        fill="var(--j-stream)"
        filter="url(#jGlowSoft)"
      />
      <rect x={ax + 574} y="788" width="36" height={BASE - 788} fill="var(--j-streamCore)" />
      <path d={TAP} fill="none" stroke="var(--j-stream)" strokeWidth="14" strokeLinecap="round" filter="url(#jGlow)" opacity="0.7" />
      <path d={TAP} fill="none" stroke="var(--j-streamCore)" strokeWidth="3" strokeLinecap="round" />
      <path className="acc-run" d={TAP} fill="none" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" />
      <ellipse cx={ax + 652} cy={BASE - 6} rx="34" ry="6" fill="var(--j-streamCore)" />
      <Rim d={`M ${ax + 564} 776 L ${ax + 620} 776`} width="2.5" />
      <Rim d={`M ${ax + 420} ${BASE} L ${ax + 560} ${BASE}`} width="2" opacity={0.4} />
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
        <rect x={ax + 922} y="760" width="30" height={BASE - 760} fill="#c9d5e6" opacity="0.6" />
      </g>

      {/* Accent: the window is lit by a SCREEN, not a hearth — the one cold
          light in a cold scene, which is the whole point of this beat. */}
      <g className="acc">
        <Spill x={ax + 886} y={BASE - 2} rx="118" ry="18" tint="var(--j-streamCore)" opacity="0.22" />
        <rect
          className="acc-flicker"
          x={ax + 862}
          y="738"
          width="46"
          height="46"
          fill="var(--j-streamCore)"
          filter="url(#jGlowSoft)"
        />
        <rect x={ax + 868} y="744" width="34" height="34" fill="#eaf2ff" />
        <Rim d={`M ${ax + 860} 736 L ${ax + 860} 786`} width="2.5" tint="#eaf2ff" opacity={0.7} />
        <Rim d={`M ${ax + 860} 736 L ${ax + 910} 736`} width="2" tint="#eaf2ff" opacity={0.5} />
        <Rim d={`M ${ax + 812} 706 L ${ax + 900} 640`} width="2" tint="#eaf2ff" opacity={0.32} />
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

      {/* Accent: one window far brighter than the rest, and a beacon on the
          mast. Someone is still working. */}
      <g className="acc">
        <rect
          className="acc-flicker"
          x={ax + 724}
          y="474"
          width="44"
          height="52"
          fill="var(--j-streamCore)"
          filter="url(#jGlowSoft)"
        />
        <rect x={ax + 732} y="482" width="28" height="36" fill="#eaf2ff" />
        <Rim d={`M ${ax + 722} 472 L ${ax + 722} 528`} width="2.5" tint="#eaf2ff" opacity={0.65} />
        <Rim d={`M ${ax + 700} 430 L ${ax + 868} 430`} width="2" tint="#eaf2ff" opacity={0.3} />
        <circle
          className="acc-beacon"
          cx={ax + 937}
          cy="238"
          r="6"
          fill="var(--j-streamCore)"
          filter="url(#jGlowSoft)"
        />
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

/** Keyed by beat id, so adding or reordering beats cannot shift the mapping. */
export const SCENE_BY_BEAT = {
  origin: Origin,
  foundry: Foundry,
  india: IndiaCity,
  sweden: SwedenForest,
  sprinta: Office,
  architect: Office, // same office as 2024; the stack sits over it
  recap: null, // the closing slide is the lifted overview + the work wall
};
