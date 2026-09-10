import React from "react";
import { BEATS } from "./config";
import { heatColor } from "./heat";
import { OrgMarks } from "../components/OrgMark";

/**
 * The whole journey at once, laid out isometrically.
 *
 * The linear stage answers "where am I"; this answers "how far is it, and
 * what shape was it". Each beat is a plinth on an isometric ground plane,
 * tinted by its own heat, threaded by the same molten-to-cold stream that
 * runs along the bottom of the stage — so the arc reads as one object rather
 * than seven slides.
 */

// Hand-placed along a shallow valley: a straight line would just be the rail
// again, and a true grid walk came out cramped and vertical.
const PATH = [
  { x: 100, y: 258 },
  { x: 258, y: 336 },
  { x: 424, y: 402 },
  { x: 592, y: 430 },
  { x: 760, y: 394 },
  { x: 926, y: 318 },
  { x: 1092, y: 232 },
];

const VIEW = { w: 1200, h: 620 };
const TOP_W = 132; // plinth top, 2:1 so it reads isometric
const TOP_H = 66;
const SIDE_H = 20;

/** Catmull-Rom through the plinths, as one smooth cubic path. */
const curveThrough = (pts) => {
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] || p2;
    d +=
      ` C ${p1.x + (p2.x - p0.x) / 6} ${p1.y + (p2.y - p0.y) / 6},` +
      ` ${p2.x - (p3.x - p1.x) / 6} ${p2.y - (p3.y - p1.y) / 6},` +
      ` ${p2.x} ${p2.y}`;
  }
  return d;
};

function Plinth({ at, tint, active }) {
  const { x, y } = at;
  const hw = TOP_W / 2;
  const hh = TOP_H / 2;
  return (
    <g opacity={active ? 1 : 0.9}>
      {/* two side faces, drawn first so the top sits on them */}
      <path
        d={`M ${x - hw} ${y} L ${x} ${y + hh} L ${x} ${y + hh + SIDE_H} L ${x - hw} ${y + SIDE_H} Z`}
        fill={tint}
        opacity="0.28"
      />
      <path
        d={`M ${x + hw} ${y} L ${x} ${y + hh} L ${x} ${y + hh + SIDE_H} L ${x + hw} ${y + SIDE_H} Z`}
        fill={tint}
        opacity="0.16"
      />
      {/* the top */}
      <path
        d={`M ${x} ${y - hh} L ${x + hw} ${y} L ${x} ${y + hh} L ${x - hw} ${y} Z`}
        fill="#0b1220"
        stroke={tint}
        strokeWidth={active ? 2.4 : 1.4}
        opacity="0.98"
      />
      {active && (
        <path
          d={`M ${x} ${y - hh - 10} L ${x + hw + 12} ${y} L ${x} ${y + hh + 10} L ${x - hw - 12} ${y} Z`}
          fill="none"
          stroke={tint}
          strokeWidth="1.2"
          opacity="0.5"
        />
      )}
    </g>
  );
}

export default function JourneyOverview({ index, onPick, onClose }) {
  return (
    <div className="j-overview" role="dialog" aria-label="Journey overview">
      <header>
        <div>
          <h2>The whole journey</h2>
          <p>
            Steel to software · Spain to Sweden · {BEATS[0].railLabel} to today
          </p>
        </div>
        <button type="button" className="j-ov-close" onClick={onClose}>
          Close <span aria-hidden="true">✕</span>
        </button>
      </header>

      <div className="j-ov-map">
        <svg viewBox={`0 0 ${VIEW.w} ${VIEW.h}`} aria-hidden="true">
          <defs>
            <linearGradient id="jOvStream" x1="0" y1="0" x2="1" y2="0">
              {BEATS.map((beat, i) => (
                <stop
                  key={beat.id}
                  offset={`${(i / (BEATS.length - 1)) * 100}%`}
                  stopColor={heatColor(beat.heat)}
                />
              ))}
            </linearGradient>
            <filter id="jOvGlow" x="-20%" y="-60%" width="140%" height="220%">
              <feGaussianBlur stdDeviation="7" />
            </filter>
          </defs>

          {/* the same stream, threading the whole arc */}
          <path
            d={curveThrough(PATH)}
            fill="none"
            stroke="url(#jOvStream)"
            strokeWidth="12"
            strokeLinecap="round"
            filter="url(#jOvGlow)"
            opacity="0.5"
          />
          <path
            d={curveThrough(PATH)}
            fill="none"
            stroke="url(#jOvStream)"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {BEATS.map((beat, i) => (
            <Plinth
              key={beat.id}
              at={PATH[i]}
              tint={heatColor(beat.heat)}
              active={i === index}
            />
          ))}
        </svg>

        {/* Labels are real DOM so they stay selectable and reachable. */}
        {BEATS.map((beat, i) => (
          <button
            key={beat.id}
            type="button"
            className={`j-ov-node${i === index ? " on" : ""}`}
            style={{
              left: `${(PATH[i].x / VIEW.w) * 100}%`,
              top: `${(PATH[i].y / VIEW.h) * 100}%`,
              "--tint": heatColor(beat.heat),
              "--delay": `${i * 70}ms`,
            }}
            onClick={() => onPick(i)}
            aria-current={i === index}
          >
            <span className="j-ov-year">{beat.railLabel}</span>
            <span className="j-ov-role">{beat.role}</span>
            <span className="j-ov-org">{beat.org}</span>
            <OrgMarks ids={beat.orgs} size="sm" />
          </button>
        ))}
      </div>

      <p className="j-ov-hint">pick any point to jump there · O or Esc to close</p>
    </div>
  );
}
