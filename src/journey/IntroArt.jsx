import React from "react";

/**
 * The opening image: steel poured at one end and a developer cast at the
 * other.
 *
 * It replaces a 3D render borrowed from the résumé hero. That image was the
 * only raster in journey mode and the only thing in it not authored as SVG
 * (D7), so it read as a different product bolted to the front of this one —
 * and it said nothing. This says the whole thesis before a word is read:
 * molten steel leaves the ladle, travels a pipe through the foundry in Spain
 * and the plant in India, cools as it goes, and fills a mould in Sweden that
 * turns out to be a person at a desk (D70).
 *
 * Everything moves on ONE shared cycle (--pour-cycle in journey.css) with
 * percentage keyframes rather than a stack of delays, so the pour, the two
 * stations and the fill cannot drift apart however long the page is left
 * open. No JavaScript and no timeline: this is ambience on the default
 * landing beat, and a permanent rAF there is a battery bill charged to every
 * visitor (D54).
 */

// The one path everything follows: out of the ladle, down through Spain and
// India, into the mould. `pathLength="100"` on the drawn copies means the
// travelling slug is expressed in percentages instead of measured pixels.
const PIPE =
  "M 214 196 C 322 228 356 268 332 322 C 308 380 168 392 154 452 " +
  "C 140 512 302 520 332 578 C 352 616 320 642 292 654";

// The cavity: a person at a desk. Deliberately the same figure the 2024 beat
// puts in the house, and a nod to the 3D render this replaced — that image was
// a developer at a desk too, which was the one thing about it worth keeping.
//
// Circles are written as arcs so the whole shape is one list of paths, usable
// both as a clip and as a stroked outline.
const CAST = [
  // desk
  "M 196 690 H 392 V 702 H 196 Z",
  "M 214 702 L 206 744 H 218 L 226 702 Z",
  "M 374 702 L 382 744 H 370 L 362 702 Z",
  // laptop
  "M 300 660 H 346 L 356 690 H 290 Z",
  // the figure
  "M 237 640 a 19 19 0 1 0 38 0 a 19 19 0 1 0 -38 0",
  "M 237 662 Q 256 652 275 667 L 296 726 H 228 Z",
  "M 272 672 L 316 684 L 312 696 L 266 686 Z",
  // chair
  "M 214 676 H 228 V 744 H 216 V 700 H 202 V 688 H 214 Z",
];

export default function IntroArt() {
  return (
    <svg
      className="j-intro-art j-pour"
      /* Margin on every side, because the glows are wider than the things
         that cast them: India's flare reaches ~56 units left of x=0 (its own
         radius plus three sigma of the blur), the mould's spill hangs below
         y=760, and the parallax (D71) slides the nearest layer another ~19
         either way. Both the viewBox edge AND `contain: paint` clip at this
         boundary, so the margin has to be in the coordinates, not the CSS. */
      viewBox="-84 -16 660 860"
      role="img"
      aria-label="Molten steel poured through a foundry in Spain and a plant in India, cooling into a mould in Sweden that casts a developer at a desk"
    >
      <defs>
        {/* The journey's own hot-to-cold ramp, along the pipe rather than
            across the story. Same three poles as heat.js (D15): a straight
            orange-to-blue lerp goes through grey mud in the middle. */}
        <linearGradient
          id="jPourRamp"
          gradientUnits="userSpaceOnUse"
          x1="214"
          y1="196"
          x2="292"
          y2="654"
        >
          <stop offset="0" stopColor="#ff6a00" />
          <stop offset="0.3" stopColor="#ff9d3c" />
          <stop offset="0.62" stopColor="#9db8e8" />
          <stop offset="1" stopColor="#4aa3ff" />
        </linearGradient>

        <filter id="jPourGlow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="5" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <filter id="jPourSoft" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="16" />
        </filter>

        {/* The cavity. The fill is a plain rising rectangle clipped to this,
            which is what lets the shape be as fiddly as it likes without the
            animation knowing anything about it. Authored once in CAST above
            and used twice: as this clip, and as the empty mould's outline. */}
        <clipPath id="jPourCast">
          {CAST.map((d) => (
            <path key={d} d={d} />
          ))}
        </clipPath>
      </defs>

      {/* the ladle and its stream, well forward */}
      <g className="j-pour-layer" style={{ "--k": 3.2 }}>
      {/* --- the ladle ------------------------------------------------- */}
      <g className="j-pour-ladle">
        <g fill="var(--pour-ink)">
          {/* the vessel, and the trunnion it swings on */}
          <path d="M 66 78 H 196 L 178 158 Q 130 182 84 158 Z" />
          <rect x="56" y="62" width="150" height="18" rx="4" />
          <circle cx="196" cy="92" r="13" />
          <rect x="196" y="86" width="34" height="12" rx="5" />
        </g>
        {/* The lit edge. Flat masses on a flat sky are why vector reads as
            clip art; every silhouette in scenes.jsx carries one of these. */}
        <path
          d="M 56 71 H 206 M 196 78 L 178 158"
          fill="none"
          stroke="var(--pour-rim)"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.5"
        />
        {/* what is in it, visible over the lip */}
        <path
          className="j-pour-melt"
          d="M 74 84 H 190 L 186 102 Q 130 118 78 102 Z"
          fill="#ff8a2b"
          filter="url(#jPourGlow)"
        />
      </g>

      {/* The stream out of the lip. Scales down from the lip rather than
          fading in: liquid arrives, it does not materialise. */}
      <path
        className="j-pour-spout"
        d="M 196 104 C 206 130 210 162 214 196"
        fill="none"
        stroke="url(#jPourRamp)"
        strokeWidth="9"
        strokeLinecap="round"
        filter="url(#jPourGlow)"
      />

      </g>
      {/* the pipe between them */}
      <g className="j-pour-layer" style={{ "--k": 2.4 }}>
      {/* --- the pipe ---------------------------------------------------- */}
      <g className="j-pour-pipe">
        {/* casing, then the channel resting inside it */}
        <path d={PIPE} fill="none" stroke="var(--pour-case)" strokeWidth="30" strokeLinecap="round" />
        <path d={PIPE} fill="none" stroke="var(--pour-ink)" strokeWidth="22" strokeLinecap="round" />
        <path
          d={PIPE}
          fill="none"
          stroke="url(#jPourRamp)"
          strokeWidth="11"
          strokeLinecap="round"
          opacity="0.22"
        />
        {/* The pipe's own top edge, catching the same light. */}
        <path
          d={PIPE}
          fill="none"
          stroke="var(--pour-rim)"
          strokeWidth="1.6"
          strokeLinecap="round"
          opacity="0.3"
          transform="translate(-9 -10)"
        />
        {/* the slug of metal actually travelling */}
        <path
          className="j-pour-charge"
          d={PIPE}
          pathLength="100"
          fill="none"
          stroke="url(#jPourRamp)"
          strokeWidth="12"
          strokeLinecap="round"
          filter="url(#jPourGlow)"
        />
      </g>

      </g>
      {/* Spain */}
      <g className="j-pour-layer" style={{ "--k": 1.6 }}>
      {/* --- Spain: the foundry ------------------------------------------ */}
      <g className="j-pour-stop j-pour-stop--spain">
        <ellipse
          className="j-pour-flare"
          cx="386"
          cy="322"
          rx="86"
          ry="54"
          fill="#ff7a1a"
          filter="url(#jPourSoft)"
        />
        <g fill="var(--pour-ink)">
          {/* sawtooth hall — the same north-light roof as the 2011 beat */}
          <path d="M 330 366 V 322 L 356 296 V 322 L 382 296 V 322 L 408 296 V 322 L 434 296 V 366 Z" />
          <rect x="440" y="256" width="18" height="110" />
          <rect x="435" y="248" width="28" height="11" rx="3" />
        </g>
        <path
          d="M 330 322 L 356 296 M 382 296 L 408 322"
          fill="none"
          stroke="var(--pour-rim)"
          strokeWidth="2"
          opacity="0.42"
        />
        <g className="j-pour-lit" fill="#ffb35c">
          <rect x="342" y="340" width="12" height="16" />
          <rect x="370" y="340" width="12" height="16" />
          <rect x="398" y="340" width="12" height="16" />
        </g>
      </g>

      </g>
      {/* India, furthest back */}
      <g className="j-pour-layer" style={{ "--k": 1.3 }}>
      {/* --- India: the plant --------------------------------------------- */}
      <g className="j-pour-stop j-pour-stop--india">
        <ellipse
          className="j-pour-flare"
          cx="80"
          cy="456"
          rx="88"
          ry="56"
          fill="#ffa03c"
          filter="url(#jPourSoft)"
        />
        <g fill="var(--pour-ink)">
          <rect x="36" y="452" width="54" height="52" />
          <rect x="94" y="424" width="38" height="80" />
          <path d="M 20 504 V 470 Q 44 438 68 470 V 504 Z" />
          <rect x="52" y="404" width="13" height="48" />
        </g>
        <path
          d="M 94 424 H 132 M 20 478 Q 44 446 68 478"
          fill="none"
          stroke="var(--pour-rim)"
          strokeWidth="2"
          opacity="0.42"
        />
        <g className="j-pour-lit" fill="#ffc073">
          <rect x="46" y="466" width="10" height="13" />
          <rect x="66" y="466" width="10" height="13" />
          <rect x="102" y="440" width="10" height="13" />
          <rect x="102" y="464" width="10" height="13" />
        </g>
      </g>

      </g>
      {/* the Swedish treeline */}
      <g className="j-pour-layer" style={{ "--k": 2.6 }}>
      {/* --- Sweden: pines beside the mould -------------------------------- */}
      <g fill="var(--pour-ink)" opacity="0.9">
        <polygon points="430,656 456,596 482,656" />
        <polygon points="436,620 456,574 476,620" />
        <polygon points="392,662 412,616 432,662" />
        <rect x="452" y="656" width="8" height="16" />
      </g>

      </g>
      {/* nearest: the mould and what comes out of it */}
      <g className="j-pour-layer" style={{ "--k": 4.2 }}>
      {/* --- the mould ------------------------------------------------------ */}
      <g className="j-pour-mould">
        {/* Sand-cast box: two walls and a bed. Open at the top, because
            something is being poured into it. */}
        <g fill="var(--pour-ink)">
          <path d="M 166 632 H 190 V 752 H 166 Z" />
          <path d="M 398 632 H 422 V 752 H 398 Z" />
          <path d="M 166 744 H 422 V 760 H 166 Z" />
        </g>
        <path
          d="M 190 632 V 744 H 398 V 632"
          fill="none"
          stroke="var(--pour-rim)"
          strokeWidth="2"
          opacity="0.3"
        />

        {/* The cavity, filling. One rectangle, clipped to the shape. */}
        <g clipPath="url(#jPourCast)">
          {/* The empty cavity still has to read as a shape, or the mould is
              a black box until it is two-thirds full. */}
          <rect x="180" y="616" width="228" height="150" fill="#16233a" />
          <g className="j-pour-fill">
            <rect x="180" y="616" width="228" height="150" fill="#4aa3ff" />
            <rect x="180" y="616" width="228" height="7" fill="#cfe6ff" />
          </g>
        </g>

        {/* The shape of the thing being cast, visible before any metal has
            reached it — otherwise the mould is an empty black box for the
            first half of every cycle. */}
        <g
          fill="none"
          stroke="var(--pour-rim)"
          strokeWidth="1.6"
          strokeLinejoin="round"
          opacity="0.26"
        >
          {CAST.map((d) => (
            <path key={d} d={d} />
          ))}
        </g>

        {/* The cast piece glowing once it is whole. */}
        <g className="j-pour-cast-glow" clipPath="url(#jPourCast)">
          <rect
            x="180"
            y="600"
            width="228"
            height="170"
            fill="#7cc0ff"
            filter="url(#jPourSoft)"
          />
        </g>

        {/* Light landing on the floor of the mould — every accent in this
            project gets one, or it reads as pasted on. */}
        <ellipse className="j-pour-spill" cx="294" cy="748" rx="130" ry="14" fill="#4aa3ff" filter="url(#jPourSoft)" />
      </g>
      </g>
    </svg>
  );
}
