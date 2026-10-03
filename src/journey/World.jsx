import React from "react";
import { stack } from "../data/journey";
import {
  BEATS,
  SCENE_W,
  VIEW_H,
  FOCAL,
  anchor,
  OVERVIEW,
} from "./config";
import { JourneyDefs, Sky, Contour, Ground, Particles } from "./parts";
import { SCENE_BY_BEAT, StackGraph } from "./scenes";
import { heatColor } from "./heat";

// Printed places plus the giant year numerals (D11), re-cut in the print
// system: hairline contours for the distant country, outlined serif years,
// and one poster composition per place (see the grammar in scenes.jsx).

// Meteorological seasons for the northern hemisphere. The journey is rooted
// in Europe, so the ambient weather follows the current local calendar rather
// than permanently equating the colder chapters with snow.
const month = new Date().getMonth();
export const CURRENT_SEASON =
  month === 11 || month <= 1
    ? "winter"
    : month <= 4
      ? "spring"
      : month <= 7
        ? "summer"
        : "autumn";

const SEASON_AMBIENT = {
  winter: "snow",
  spring: "blossom",
  summer: "sun",
  autumn: "leaf",
};

// The four override choices offered by the season picker, in calendar order.
export const SEASONS = ["winter", "spring", "summer", "autumn"];

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

export default function World({ season = "auto" }) {
  const selectedSeason = season === "auto" ? CURRENT_SEASON : season;
  const seasonalAmbient =
    SEASON_AMBIENT[selectedSeason] || SEASON_AMBIENT[CURRENT_SEASON];
  const kinds = {
    intro: seasonalAmbient,
    origin: "dust",
    foundry: "spark",
    india: "dust",
    sweden: seasonalAmbient,
    sprinta: seasonalAmbient,
    architect: seasonalAmbient,
    recap: seasonalAmbient,
  };

  return (
    <svg
      className="j-world"
      viewBox={`0 0 ${SCENE_W} ${VIEW_H}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <JourneyDefs />

      <Sky />

      {/* Everything inside the camera group so the final beat can pull back. */}
      <g data-camera>
        {/* far — the distant country as contour lines, never scene-specific */}
        <g data-layer="far">
          <Contour y={640} amp={150} step={260} seed={7} span={SCENE_W * BEATS.length} opacity={0.22} />
          <Contour y={700} amp={110} step={200} seed={19} span={SCENE_W * BEATS.length} opacity={0.12} />
        </g>

        {/* mid — a nearer, dotted contour */}
        <g data-layer="mid">
          <Contour y={790} amp={70} step={180} seed={31} span={SCENE_W * BEATS.length} dash="1.5 8" opacity={0.5} />
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
              {beat.id === "architect" ? (
                <g data-architect-visual>
                  {/* The office is the backdrop to the stack graph, and
                      ghosted while the graph is up — see archBackdrop in
                      timeline.js. Full strength again from above. */}
                  <g data-arch-backdrop>
                    {Scene && <Scene ax={FOCAL} season={selectedSeason} />}
                  </g>
                  <g data-arch>
                    <StackGraph ax={FOCAL} groups={stack} />
                  </g>
                </g>
              ) : Scene ? (
                <Scene ax={FOCAL} season={selectedSeason} />
              ) : null}
            </g>
          );
        })}

        {/* The year, outlined in the serif: a hairline drawing of a number,
            big enough to be architecture, quiet enough to print over it.
            ABOVE the places on purpose: behind them it showed through the
            pastels only while they multiplied with the page, and the moment
            a place started to recede its group opacity isolated the blend,
            so the discs went solid and swallowed the year mid-move. */}
        <g data-layer="type">
          {BEATS.map((beat, i) =>
            beat.numeral ? (
              <text
                key={beat.id}
                data-atmos={beat.id}
                data-numeral={beat.id}
                x={anchor(i, 0.38) + FOCAL + 40}
                y={560}
                fill="none"
                stroke="var(--j-mid)"
                strokeWidth="1.2"
                fontSize="440"
                letterSpacing="-6"
                opacity="0.3"
                style={{ fontFamily: "var(--serif)" }}
              >
                {beat.numeral}
              </text>
            ) : null,
          )}
        </g>

        {/* The trail joining the laid-out places, visible only from above.
            Same molten-to-cold ramp as everything else, so the arc of the
            journey is legible as one line. */}
        <g data-ov-path opacity="0">
          <defs>
            <linearGradient
              id="jOvTrail"
              gradientUnits="userSpaceOnUse"
              x1={OVERVIEW[0].x}
              y1="0"
              x2={OVERVIEW[OVERVIEW.length - 1].x}
              y2="0"
            >
              {OVERVIEW.map((_, i) => (
                <stop
                  key={i}
                  offset={`${(i / (OVERVIEW.length - 1)) * 100}%`}
                  stopColor={heatColor(
                    BEATS.find((b) => b.id === OVERVIEW[i].id).heat,
                  )}
                />
              ))}
            </linearGradient>
          </defs>
          {/* pathLength=1 so the render loop can draw it straight from the
              lift progress, no plugin and no second timeline */}
          {/* two plates, out of register: the pastel road and a key hairline */}
          <path
            data-ov-trail
            d={trail(OVERVIEW)}
            pathLength="1"
            fill="none"
            stroke="url(#jOvTrail)"
            strokeWidth="9"
            strokeLinecap="round"
          />
          <path
            data-ov-trail
            d={trail(OVERVIEW)}
            pathLength="1"
            transform="translate(3 -3)"
            fill="none"
            stroke="var(--j-mid)"
            strokeWidth="1.3"
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
              stroke="var(--j-mid)"
              strokeWidth="1.5"
            />
          ))}
        </g>

        {/* ground — the continuous floor and the stream */}
        <g data-layer="ground">
          <Ground span={SCENE_W * BEATS.length} />
        </g>

        {/* fore — weather */}
        <g data-layer="fore">
          {BEATS.map((beat, i) => (
            <Particles
              key={beat.id}
              scene={{ id: beat.id, i }}
              kind={kinds[beat.id]}
              count={beat.id === "foundry" ? 12 : undefined}
            />
          ))}
        </g>
      </g>
    </svg>
  );
}
