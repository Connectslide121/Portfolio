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
  OVERVIEW,
} from "./config";
import { JourneyDefs, Sky, Ground, Particles } from "./parts";
import { SCENE_BY_BEAT, StackGraph } from "./scenes";
import { heatColor } from "./heat";

// Silhouette places plus the giant year numerals from the abstract study —
// the blend chosen in session 2 (resolves O1).

// Meteorological seasons for the northern hemisphere. The journey is rooted
// in Europe, so the ambient weather follows the current local calendar rather
// than permanently equating the colder chapters with snow.
const month = new Date().getMonth();
const CURRENT_SEASON =
  month === 11 || month <= 1
    ? "snow"
    : month <= 4
      ? "blossom"
      : month <= 7
        ? "sun"
        : "leaf";

const KINDS = {
  intro: CURRENT_SEASON,
  origin: "dust",
  foundry: "spark",
  india: "dust",
  sweden: CURRENT_SEASON,
  sprinta: CURRENT_SEASON,
  architect: CURRENT_SEASON,
  recap: CURRENT_SEASON,
};

/** Catmull-Rom through the overview spots, as one smooth cubic path. */
const trail = (pts) => {
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

        {/* mid — a second, nearer ridge for depth */}
        <g data-layer="mid">
          <path d={ridge(778, 70, 180, 31)} fill="var(--j-far)" opacity="0.6" />
        </g>

        {/* The year sits in front of the secondary ridge, while the active
            scene remains its foreground plane. */}
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
                <g data-architect-visual>
                  {Scene && <Scene ax={FOCAL} />}
                  <g data-arch>
                    <StackGraph ax={FOCAL} groups={stack} />
                  </g>
                </g>
              ) : Scene ? (
                <Scene ax={FOCAL} />
              ) : null}
            </g>
          );
        })}

        {/* The trail joining the laid-out places, visible only from above.
            Same molten-to-cold ramp as everything else, so the arc of the
            journey is legible as one line. */}
        <g data-ov-path opacity="0">
          <defs>
            <linearGradient id="jOvTrail" gradientUnits="userSpaceOnUse" x1={OVERVIEW[0].x} y1="0" x2={OVERVIEW[OVERVIEW.length - 1].x} y2="0">
              {OVERVIEW.map((_, i) => (
                <stop
                  key={i}
                  offset={`${(i / (OVERVIEW.length - 1)) * 100}%`}
                  stopColor={heatColor(BEATS.find((b) => b.id === OVERVIEW[i].id).heat)}
                />
              ))}
            </linearGradient>
          </defs>
          {/* pathLength=1 so the render loop can draw it straight from the
              lift progress, no plugin and no second timeline */}
          <path
            data-ov-trail
            d={trail(OVERVIEW)}
            pathLength="1"
            fill="none"
            stroke="url(#jOvTrail)"
            strokeWidth="16"
            strokeLinecap="round"
            opacity="0.28"
            filter="url(#jGlow)"
          />
          <path
            data-ov-trail
            d={trail(OVERVIEW)}
            pathLength="1"
            fill="none"
            stroke="url(#jOvTrail)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          {OVERVIEW.map((p, i) => (
            <circle
              key={i}
              data-ov-dot={i}
              cx={p.x}
              cy={p.y}
              r="6"
              fill={heatColor(BEATS.find((b) => b.id === p.id).heat)}
            />
          ))}
        </g>

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
            <Particles
              key={beat.id}
              scene={{ id: beat.id, i }}
              kind={KINDS[beat.id]}
              count={beat.id === "foundry" ? 12 : undefined}
            />
          ))}
        </g>
      </g>
    </svg>
  );
}
