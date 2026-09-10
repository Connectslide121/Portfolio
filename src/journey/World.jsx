import React from "react";
import { stack } from "../data/journey";
import {
  BEATS,
  SCENE_W,
  VIEW_H,
  FOCAL,
  anchor,
  OVERDRAW,
  FLOOR,
  FADE_X0,
  FADE_W,
  FADE_EDGE,
} from "./config";
import { JourneyDefs, Sky, Ground, Particles } from "./parts";
import { SCENE_BY_BEAT, StackGraph } from "./scenes";

// Silhouette places plus the giant year numerals from the abstract study —
// the blend chosen in session 2 (resolves O1).

const KINDS = {
  origin: "dust",
  foundry: "spark",
  india: "dust",
  sweden: "snow",
  sprinta: "snow",
  architect: "snow",
  work: "snow",
};

/** Ambient ridgeline for a whole layer — seeded so it stays stable per render. */
const ridge = (y, amp, step, seed) => {
  const pts = [];
  let n = seed;
  const rnd = () => ((n = (n * 9301 + 49297) % 233280) / 233280);
  const end = SCENE_W * BEATS.length + OVERDRAW;
  for (let x = -OVERDRAW; x <= end; x += step) {
    pts.push(`${x},${(y - rnd() * amp).toFixed(0)}`);
  }
  return `M ${pts.join(" L ")} L ${end} ${FLOOR} L ${-OVERDRAW} ${FLOOR} Z`;
};

export default function World() {
  return (
    <svg
      className="j-world"
      viewBox={`0 0 ${SCENE_W} ${VIEW_H}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <JourneyDefs />

      {/* Applied only while a beat is receding: opaque across the whole
          silhouette, feathering only at the extreme edges so it hazes out
          instead of being cut off. */}
      <defs>
        <linearGradient
          id="jFadeGrad"
          gradientUnits="userSpaceOnUse"
          x1={FADE_X0}
          y1="0"
          x2={FADE_X0 + FADE_W}
          y2="0"
        >
          <stop offset="0%" stopColor="#000" />
          <stop offset={`${FADE_EDGE * 100}%`} stopColor="#fff" />
          <stop offset={`${(1 - FADE_EDGE) * 100}%`} stopColor="#fff" />
          <stop offset="100%" stopColor="#000" />
        </linearGradient>
        <mask
          id="jFade"
          maskUnits="userSpaceOnUse"
          x={FADE_X0}
          y="0"
          width={FADE_W}
          height={VIEW_H}
        >
          <rect x={FADE_X0} y="0" width={FADE_W} height={VIEW_H} fill="url(#jFadeGrad)" />
        </mask>
      </defs>

      <Sky />

      {/* Everything inside the camera group so the final beat can pull back. */}
      <g data-camera>
        {/* far — ambient ridgeline only, never scene-specific */}
        <g data-layer="far">
          <path d={ridge(660, 150, 240, 7)} fill="var(--j-far)" />
        </g>

        {/* type — the year, huge and slow, crossfaded so neighbours never leak */}
        <g data-layer="type">
          {BEATS.map((beat, i) =>
            beat.numeral ? (
              <text
                key={beat.id}
                data-atmos={beat.id}
                x={anchor(i, 0.38) + FOCAL + 30}
                y={584}
                fill="var(--j-far)"
                fontSize="392"
                fontWeight="800"
                letterSpacing="10"
                opacity="0.62"
              >
                {beat.numeral}
              </text>
            ) : null
          )}
        </g>

        {/* mid — a second, nearer ridge for depth */}
        <g data-layer="mid">
          <path d={ridge(778, 70, 180, 31)} fill="var(--j-far)" opacity="0.6" />
        </g>

        {/* scene — the places. Not parallax-translated: each one is placed
            every frame by projectScenes() in timeline.js, which slides the
            next one in from the right and lets the previous ones recede
            toward the horizon. Authored in one shared local space (ax =
            FOCAL) so the projection is the only thing that positions them.
            DOM order matters: earlier beats paint behind later ones. */}
        {BEATS.map((beat, i) => {
          const Scene = SCENE_BY_BEAT[beat.id];
          return (
            <g key={beat.id} data-scene={i}>
              {/* the Indian sun, behind its skyline */}
              {beat.id === "india" && (
                <circle
                  cx={FOCAL + 590}
                  cy="316"
                  r="236"
                  fill="var(--j-accent)"
                  opacity="0.2"
                />
              )}
              {beat.id === "architect" ? (
                <g data-arch>
                  <StackGraph ax={FOCAL} groups={stack} />
                </g>
              ) : (
                Scene && <Scene ax={FOCAL} />
              )}
            </g>
          );
        })}

        {/* ground — the continuous floor and the stream */}
        <g data-layer="ground">
          <Ground span={SCENE_W * BEATS.length} />
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
            <Particles key={beat.id} scene={{ id: beat.id, i }} kind={KINDS[beat.id]} />
          ))}
        </g>
      </g>
    </svg>
  );
}
