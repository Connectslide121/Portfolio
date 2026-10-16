import React from "react";
import { experience, education, beats } from "../../../data/journey";
import "../styles/art.css";

/**
 * The career dimensioned like a part: one chain of dimensions per lane,
 * each span with extension lines, arrowheads and its length in years, over
 * a scale bar. Metal years are drawn with section hatching under the
 * dimension line, software years with a solid bar.
 */

const NOW = new Date();
const NOW_Y = NOW.getFullYear() + NOW.getMonth() / 12;
const START = 2005;
const END = Math.ceil(NOW_Y);

const X0 = 120;
const X1 = 980;
const x = (year) => X0 + ((year - START) / (END - START)) * (X1 - X0);

const span = (e) => {
  const [a, b] = e.dateLabel.split(/\s*[-—]\s*/);
  const from = Number(a);
  const to = b === "Present" ? NOW_Y : Number(b);
  return { from, to, open: b === "Present" };
};

const yearsLabel = (from, to) => {
  const n = Math.round(to - from);
  return n < 1 ? "<1 YR" : `${n} YR${n === 1 ? "" : "S"}`;
};

const short = (org) => org.replace(/\s*\(.*\)/, "").replace(" Consulting AB", "").replace("London Metropolitan University", "London Met");

const LANES = [
  { id: "edu", label: "EDUCATION", entries: education, y: 70 },
  { id: "work", label: "WORK", entries: experience, y: 170 },
];

const india = beats.find((b) => b.id === "india");

function Dimension({ entry, y, stagger }) {
  const { from, to, open } = span(entry);
  const a = x(from);
  const b = x(to);
  const metal = entry.heat >= 0.4;
  const dy = y; // one row per lane; spans never overlap within a lane
  // Short neighbouring spans would print their names over each other.
  const drop = b - a < 90 && stagger ? 14 : 0;
  return (
    <g className={`dim${metal ? " is-metal" : ""}${open ? " is-open" : ""}`}>
      <line className="ext" x1={a} y1={dy - 26} x2={a} y2={dy + 22} />
      <line className="ext" x1={b} y1={dy - 26} x2={b} y2={dy + 22} />
      <line className="dim-line" x1={a + 1} y1={dy} x2={b - 1} y2={dy} markerStart="url(#arrow)" markerEnd={open ? undefined : "url(#arrow)"} />
      <rect className={metal ? "bar hatched" : "bar"} x={a} y={dy + 6} width={Math.max(b - a, 2)} height="9" />
      <text className="dim-text" x={(a + b) / 2} y={dy - 7}>
        {yearsLabel(from, to)}
      </text>
      <text className="dim-org" x={(a + b) / 2} y={dy + 32 + drop}>
        {short(entry.org)}
      </text>
    </g>
  );
}

export default function CareerChain() {
  const ticks = [];
  for (let yr = START; yr <= END; yr++) ticks.push(yr);

  return (
    <div className="chain-scroll">
      <svg className="chain" viewBox="0 0 1000 290" role="img" aria-labelledby="chain-title">
        <title id="chain-title">
          Career timeline from {START} to today:{" "}
          {[...education, ...experience].map((e) => `${e.title}, ${e.org}, ${e.dateLabel}`).join("; ")}
        </title>
        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="9" markerHeight="9" orient="auto-start-reverse">
            <path d="M0 2 L10 5 L0 8 Z" className="arrow-head" />
          </marker>
          <pattern id="hatch-chain" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="6" className="hatch-line" />
          </pattern>
        </defs>

        {LANES.map((lane) => (
          <g key={lane.id}>
            <text className="lane-label" x="0" y={lane.y + 4}>
              {lane.label}
            </text>
            {lane.entries.map((e, i) => (
              <Dimension key={e.id} entry={e} y={lane.y} stagger={i % 2 === 1} />
            ))}
          </g>
        ))}

        {/* India, called out in red pencil on the foundry span. */}
        {india && (
          <g className="markup">
            <circle cx={x(Number(india.year) + 0.75)} cy={180} r="8" />
            <path d={`M${x(Number(india.year) + 0.75) + 6} 174 q 18 -30 60 -36`} />
            <text x={x(Number(india.year) + 0.75) + 72} y={141}>
              {india.year} · {india.place}
            </text>
          </g>
        )}

        {/* Scale bar. */}
        <g className="scale" transform="translate(0 240)">
          {ticks.slice(0, -1).map((yr, i) => (
            <rect key={yr} className={i % 2 ? "scale-off" : "scale-on"} x={x(yr)} y="0" width={x(yr + 1) - x(yr)} height="7" />
          ))}
          <rect className="scale-frame" x={x(START)} y="0" width={x(END) - x(START)} height="7" />
          {ticks
            .filter((yr) => yr % 5 === 0 || yr === START || yr === END)
            .map((yr) => (
              <text key={yr} className="scale-text" x={x(yr)} y="26">
                {yr}
              </text>
            ))}
          <text className="lane-label" x="0" y="7">
            SCALE: YRS
          </text>
        </g>
      </svg>
    </div>
  );
}
