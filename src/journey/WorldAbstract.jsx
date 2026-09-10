import React from "react";
import { BEATS, SCENE_W, VIEW_H, FOCAL, anchor } from "./config";
import { JourneyDefs, Sky, Stream, Ground, Particles } from "./parts";

// Art style A — no scenery. Type, geometry and light do the storytelling.
// Cheapest to build and carries no risk of reading as amateur illustration.

const YEARS = ["2011", "2017", "2023"];
const KINDS = ["spark", "dust", "snow"];

/** Soft terrain band. Ambient and repeating, so it may live on a slow layer. */
const band = (y, amp, phase) => {
  const pts = [];
  for (let x = -200; x <= 5800; x += 200) {
    pts.push(`${x},${(y + Math.sin((x + phase) / 700) * amp).toFixed(1)}`);
  }
  return `M ${pts.join(" L ")} L 5800 1080 L -200 1080 Z`;
};

export default function WorldAbstract() {
  return (
    <svg
      className="j-world"
      viewBox={`0 0 ${SCENE_W} ${VIEW_H}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <JourneyDefs />
      <Sky />

      {/* type — the year, huge and slow, crossfaded so neighbours never leak */}
      <g data-layer="type">
        {YEARS.map((year, i) => (
          <text
            key={year}
            data-atmos={BEATS[i].id}
            x={anchor(i, 0.38) + FOCAL + 40}
            y={600}
            fill="var(--j-far)"
            fontSize="400"
            fontWeight="800"
            letterSpacing="12"
            opacity="0.7"
          >
            {year}
          </text>
        ))}
      </g>

      {/* mid — ambient band, no scene content */}
      <g data-layer="mid">
        <path d={band(704, 34, 0)} fill="var(--j-mid)" opacity="0.85" />
      </g>

      {/* scene — geometric accents. Dense and tall while hot, sparse when cold. */}
      <g data-layer="scene">
        {BEATS.map((beat, i) => {
          const ax = anchor(i, 0.9) + FOCAL;
          return (
            <g key={beat.id} data-atmos={beat.id}>
              {/* concentric rings — a pour, a plant, a system: same shape, cooler each time */}
              <circle
                cx={ax + 500}
                cy={402}
                r={190 - i * 24}
                fill="none"
                stroke="var(--j-accent)"
                strokeWidth="2"
                opacity={0.55 - i * 0.1}
              />
              <circle
                cx={ax + 500}
                cy={402}
                r={116 - i * 16}
                fill="none"
                stroke="var(--j-accent)"
                strokeWidth="1.5"
                opacity={0.4 - i * 0.07}
              />
              {Array.from({ length: 15 - i * 4 }).map((_, h) => (
                <line
                  key={h}
                  x1={ax + 60 + h * 62}
                  y1={806}
                  x2={ax + 60 + h * 62}
                  y2={806 - (230 - i * 62) - (h % 3) * 44}
                  stroke="var(--j-accent)"
                  strokeWidth="2"
                  opacity={0.3}
                />
              ))}
            </g>
          );
        })}
      </g>

      {/* ground — the continuous floor and the stream */}
      <g data-layer="ground">
        <Ground />
        <Stream />
      </g>

      {/* fore — dot grid and particles */}
      <g data-layer="fore">
        {BEATS.map((beat, i) => (
          <g key={beat.id} data-atmos={beat.id}>
            {Array.from({ length: 5 }).map((_, r) =>
              Array.from({ length: 9 }).map((_, c) => (
                <circle
                  key={`${r}-${c}`}
                  cx={anchor(i, 1.35) + 180 + c * 200}
                  cy={946 + r * 26}
                  r="1.8"
                  fill="var(--j-accent)"
                  opacity={0.5 - r * 0.08}
                />
              ))
            )}
          </g>
        ))}
        {BEATS.map((beat, i) => (
          <Particles key={beat.id} scene={{ id: beat.id, i }} kind={KINDS[i]} />
        ))}
      </g>
    </svg>
  );
}
