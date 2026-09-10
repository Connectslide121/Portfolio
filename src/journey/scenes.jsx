import React from "react";
import { BASE } from "./config";

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

/**
 * 2025 — the pull-back. The stream stops being a line and becomes a system:
 * the architecture actually shipped. This is the payoff of the whole journey.
 */
export function ArchitectSystem({ ax, nodes, edges }) {
  const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));
  const tint = {
    client: "#7dd3fc",
    shared: "#a5b4fc",
    compute: "#93c5fd",
    data: "#86efac",
    ai: "#fca5a5",
  };
  return (
    <g>
      {/* edges first, so nodes sit on top */}
      <g data-arch-edge stroke="var(--j-stream)" strokeWidth="2.5" opacity="0.55" fill="none">
        {edges.map(([a, b], i) => {
          const from = byId[a];
          const to = byId[b];
          const mx = (from.x + to.x) / 2;
          return (
            <path
              key={i}
              d={`M ${ax + from.x + 82} ${from.y} C ${ax + mx} ${from.y}, ${ax + mx} ${to.y}, ${
                ax + to.x - 82
              } ${to.y}`}
            />
          );
        })}
      </g>
      {nodes.map((n) => (
        <g key={n.id} data-arch-node>
          <rect
            x={ax + n.x - 82}
            y={n.y - 27}
            width="164"
            height="54"
            rx="10"
            fill="var(--j-ground)"
            stroke={tint[n.kind]}
            strokeWidth="1.6"
            opacity="0.95"
          />
          <text
            x={ax + n.x}
            y={n.y + 5}
            textAnchor="middle"
            fill={tint[n.kind]}
            fontSize="19"
            fontWeight="600"
          >
            {n.label}
          </text>
        </g>
      ))}
    </g>
  );
}

export const SCENES = [Origin, Foundry, IndiaCity, SwedenForest, Office, null];
