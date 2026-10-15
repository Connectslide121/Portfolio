import React, { useEffect, useState } from "react";
import { box, disc, iso, pts } from "./iso";
import { stack, experience } from "../data/journey";
import "../styles/art.css";

/**
 * General arrangement: the stack as an exploded isometric assembly.
 *
 * Five plates, bottom to top — the foundry years as a hatched steel
 * foundation, then data, backend, AI and the frontend people actually see.
 * Each plate carries a small drawing of what it holds and a numbered
 * balloon calling out its parts. It assembles on load, then explodes; the
 * button (or a click on the drawing) puts it back together.
 */

const W = 200; // plate size
const T = 12; // plate thickness
const GAP = { assembled: 52, exploded: 104 };

const foundry = experience.find((e) => e.material === "steel");

// Bottom to top. Labels come from the stack in src/data/journey.js.
const byId = Object.fromEntries(stack.map((s) => [s.id, s]));
const LAYERS = [
  { id: "foundation", label: "Foundation", items: ["Steel", ...foundry.tech.slice(0, 2)] },
  byId.data,
  byId.backend,
  byId.ai,
  byId.frontend,
];

const Plate = ({ hatch }) => {
  const b = box(0, 0, 0, W, W, T);
  return (
    <g className="iso-plate">
      <polygon className="face-l" points={b.left} pathLength="1" />
      <polygon className="face-r" points={b.right} pathLength="1" />
      <polygon className={hatch ? "face-t hatched" : "face-t"} points={b.top} pathLength="1" />
    </g>
  );
};

function Cylinder({ x, y, r, h }) {
  const top = disc(x, y, T + h, r);
  const bot = disc(x, y, T, r);
  const band = (z) => {
    const d = disc(x, y, T + z, r);
    return `M${d.cx - d.rx} ${d.cy} A${d.rx} ${d.ry} 0 0 0 ${d.cx + d.rx} ${d.cy}`;
  };
  return (
    <g className="iso-detail">
      <path
        className="face-l"
        d={`M${top.cx - top.rx} ${top.cy} L${bot.cx - bot.rx} ${bot.cy} A${bot.rx} ${bot.ry} 0 0 0 ${bot.cx + bot.rx} ${bot.cy} L${top.cx + top.rx} ${top.cy} Z`}
        pathLength="1"
      />
      <path className="thin" d={band(h / 3)} />
      <path className="thin" d={band((2 * h) / 3)} />
      <ellipse className="face-t" cx={top.cx} cy={top.cy} rx={top.rx} ry={top.ry} pathLength="1" />
    </g>
  );
}

function Cube({ x, y, s, h }) {
  const b = box(x, y, T, s, s, h);
  return (
    <g className="iso-detail">
      <polygon className="face-l" points={b.left} pathLength="1" />
      <polygon className="face-r" points={b.right} pathLength="1" />
      <polygon className="face-t" points={b.top} pathLength="1" />
    </g>
  );
}

function Panel({ x, y, w, h }) {
  // An upright screen standing on the plate, facing front-left.
  const z = T;
  const frame = pts([
    [x, y, z],
    [x + w, y, z],
    [x + w, y, z + h],
    [x, y, z + h],
  ]);
  const line = (fx1, fz1, fx2, fz2, cls = "thin") => {
    const [a, b] = iso(x + fx1 * w, y, z + fz1 * h);
    const [c, d] = iso(x + fx2 * w, y, z + fz2 * h);
    return <line className={cls} x1={a} y1={b} x2={c} y2={d} />;
  };
  return (
    <g className="iso-detail">
      <polygon className="face-l" points={frame} pathLength="1" />
      {line(0, 0.86, 1, 0.86)}
      {line(0.08, 0.66, 0.6, 0.66, "thin strong")}
      {line(0.08, 0.5, 0.85, 0.5)}
      {line(0.08, 0.38, 0.75, 0.38)}
      {line(0.08, 0.2, 0.4, 0.2, "thin strong")}
    </g>
  );
}

const NODES = [
  [40, 50],
  [100, 36],
  [160, 60],
  [70, 110],
  [130, 120],
  [50, 165],
  [150, 165],
  [100, 90],
];
const EDGES = [
  [7, 0],
  [7, 1],
  [7, 2],
  [7, 3],
  [7, 4],
  [3, 5],
  [4, 6],
  [0, 3],
  [2, 4],
  [5, 6],
];

function Graph() {
  const z = T + 1;
  return (
    <g className="iso-detail">
      {EDGES.map(([a, b], i) => {
        const [x1, y1] = iso(NODES[a][0], NODES[a][1], z);
        const [x2, y2] = iso(NODES[b][0], NODES[b][1], z);
        return <line key={i} className="thin strong" x1={x1} y1={y1} x2={x2} y2={y2} pathLength="1" />;
      })}
      {NODES.map(([x, y], i) => {
        const d = disc(x, y, z, i === 7 ? 12 : 7);
        return <ellipse key={i} className={i === 7 ? "node node-core" : "node"} cx={d.cx} cy={d.cy} rx={d.rx} ry={d.ry} />;
      })}
    </g>
  );
}

const DETAILS = {
  foundation: () => null,
  data: () => (
    <>
      <Cylinder x={55} y={55} r={24} h={34} />
      <Cylinder x={140} y={60} r={24} h={34} />
      <Cylinder x={70} y={140} r={24} h={34} />
      <Cylinder x={150} y={145} r={24} h={34} />
    </>
  ),
  backend: () => (
    <>
      {[20, 80, 140].flatMap((x) =>
        [30, 110].map((y) => <Cube key={`${x}-${y}`} x={x} y={y} s={40} h={x === 80 && y === 30 ? 36 : 22} />),
      )}
    </>
  ),
  ai: () => <Graph />,
  frontend: () => (
    <>
      <Panel x={28} y={70} w={150} h={96} />
      <Panel x={60} y={150} w={80} h={58} />
    </>
  ),
};

/** Splits a list of names into lines of about `n` characters. */
const lines = (items, n = 34) =>
  items.reduce((out, item) => {
    const last = out[out.length - 1];
    if (last && (last + " · " + item).length <= n) out[out.length - 1] = `${last} · ${item}`;
    else out.push(item);
    return out;
  }, []);

export default function IsoStack() {
  const [exploded, setExploded] = useState(false);
  const [hot, setHot] = useState(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const id = window.setTimeout(() => setExploded(true), reduce ? 0 : 1400);
    return () => window.clearTimeout(id);
  }, []);

  const gap = exploded ? GAP.exploded : GAP.assembled;
  const [rx] = iso(W, 0, 0); // right-hand corner, where the leaders start
  const top = -(LAYERS.length - 1) * GAP.exploded - 130;

  return (
    <figure className="iso-figure">
      <svg
        className={`iso-stack${exploded ? " is-exploded" : ""}`}
        viewBox={`-190 ${top} 660 ${W + T + 40 - top}`}
        style={{ "--gap": gap }}
        role="img"
        aria-labelledby="iso-title"
        onClick={() => setExploded((e) => !e)}
      >
        <title id="iso-title">
          Exploded view of the stack, bottom to top:{" "}
          {LAYERS.map((l) => `${l.label} (${l.items.join(", ")})`).join("; ")}
        </title>
        <defs>
          <pattern id="hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="7" className="hatch-line" />
          </pattern>
        </defs>

        {/* Centre line through the assembly. */}
        <line className="centre-line" x1="0" y1={top + 40} x2="0" y2={W + T + 20} />

        {LAYERS.map((layer, i) => {
          const Detail = DETAILS[layer.id];
          const num = LAYERS.length - i;
          const ly = W * 0.5 - T; // leader height: the right-hand corner, top edge
          return (
            <g
              key={layer.id}
              className={`iso-layer layer-${layer.id}${hot === layer.id ? " is-hot" : ""}`}
              style={{ "--i": i }}
              onMouseEnter={() => setHot(layer.id)}
              onMouseLeave={() => setHot(null)}
            >
              <Plate hatch={layer.id === "foundation"} />
              <Detail />
              <g className="callout">
                <polyline className="leader" points={`${rx + 4},${ly} ${rx + 40},${ly} ${rx + 52},${ly - 14}`} />
                <circle className="balloon" cx={rx + 66} cy={ly - 24} r="14" />
                <text className="balloon-num" x={rx + 66} y={ly - 20}>
                  {num}
                </text>
                <text className="callout-label" x={rx + 90} y={ly - 26}>
                  {layer.label.toUpperCase()}
                </text>
                {lines(layer.items).map((l, li) => (
                  <text key={li} className="callout-items" x={rx + 90} y={ly - 10 + li * 14}>
                    {l}
                  </text>
                ))}
              </g>
            </g>
          );
        })}

        {/* Axis triad, bottom left. */}
        <g className="triad" transform={`translate(-160 ${W + T})`}>
          {[
            ["x", iso(26, 0, 0)],
            ["y", iso(0, 26, 0)],
            ["z", iso(0, 0, 26)],
          ].map(([k, [x, y]]) => (
            <g key={k}>
              <line x1="0" y1="0" x2={x} y2={y} />
              <text x={x * 1.35} y={y * 1.35 + 4}>
                {k.toUpperCase()}
              </text>
            </g>
          ))}
        </g>
      </svg>
      <figcaption>
        <span>Fig. 1 — The stack, {exploded ? "exploded" : "assembled"} view</span>
        <button type="button" className="text-btn" onClick={() => setExploded((e) => !e)} aria-pressed={exploded}>
          [ {exploded ? "Assemble" : "Explode"} ]
        </button>
      </figcaption>
    </figure>
  );
}
