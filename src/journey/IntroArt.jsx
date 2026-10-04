import React, { useId } from "react";
import { blob } from "./print";
import "../styles/pour.css";

/**
 * The opening print: steel poured at one end and a developer cast at the
 * other (D70).
 *
 * Molten steel leaves the ladle, travels a pipe through the foundry in Spain
 * and the plant in India, and fills a mould in Sweden that turns out to be a
 * person at a desk. Each place's pastel plate PRINTS IN as the metal reaches
 * it and stays until the ladle tips again, so the image reads as a route
 * being coloured in one stop at a time.
 *
 * Everything moves on ONE shared cycle (--pour-cycle in journey.css) with
 * percentage keyframes rather than a stack of delays, so the pour, the
 * stations and the fill cannot drift apart however long the page is left
 * open. No JavaScript: this is ambience on the default landing beat (D54).
 * The globe reads its clock off .j-pour-charge, so that class and its
 * keyframes are load-bearing.
 */

// The one path everything follows: out of the ladle, down through Spain and
// India, into the mould. `pathLength="100"` on the drawn copy means the
// travelling metal is expressed in percentages instead of measured pixels.
const PIPE =
  "M 214 196 C 322 228 356 268 332 322 C 308 380 168 392 154 452 " +
  "C 140 512 302 520 332 578 C 352 616 320 642 292 654";

// The cavity: a person at a desk — the same figure the 2024 beat puts in the
// house. Circles are written as arcs so the whole shape is one list of
// paths, usable both as a clip and as a stroked outline.
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

// The journey's key plate where there is one, the page's ink where there
// is not (the CV hero has no heat variables).
const INK = "var(--j-mid, var(--ink))";

export default function IntroArt({ className = "j-intro-art" }) {
  // Two of these can be in the document at once (the CV hero behind the
  // journey's landing beat). A url(#id) resolves to the FIRST match, and a
  // gradient inside a hidden SVG does not paint in every browser — so each
  // instance gets its own ids. useId's colons are not safe in url(#...).
  const uid = useId().replace(/:/g, "");
  const ramp = `jPourRamp${uid}`;
  const hatch = `jPourHatch${uid}`;
  const cast = `jPourCast${uid}`;
  return (
    <svg
      className={`${className} j-pour`}
      /* Margin on every side: the plates are wider than the things they sit
         behind, and the parallax (D71) slides the nearest layer another ~19
         either way. Both the viewBox edge AND `contain: paint` clip at this
         boundary, so the margin has to be in the coordinates. */
      viewBox="-84 -16 660 860"
      role="img"
      aria-label="Molten steel poured through a foundry in Spain and a plant in India, cooling into a mould in Sweden that casts a developer at a desk"
    >
      <defs>
        {/* The journey's own warm-to-cool ramp, along the pipe: coral out of
            the ladle, apricot through Spain, rose through India, sky by the
            time it reaches Sweden. */}
        <linearGradient
          id={ramp}
          gradientUnits="userSpaceOnUse"
          x1="214"
          y1="196"
          x2="292"
          y2="654"
        >
          <stop offset="0" stopColor="var(--coral)" />
          <stop offset="0.3" stopColor="var(--apricot)" />
          <stop offset="0.6" stopColor="var(--rose)" />
          <stop offset="1" stopColor="var(--sky)" />
        </linearGradient>

        <pattern id={hatch} width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(-35)">
          <line x1="0" y1="0" x2="0" y2="7" stroke={INK} strokeWidth="1" />
        </pattern>

        <clipPath id={cast}>
          {CAST.map((d) => (
            <path key={d} d={d} />
          ))}
        </clipPath>
      </defs>

      {/* --- the plates, furthest back ------------------------------------ */}
      <g className="j-pour-layer" style={{ "--k": 1.1 }}>
        <path className="j-print" d={blob(150, 150, 118, 3, 0.03)} fill="var(--butter)" />
        <g className="j-pour-stop j-pour-stop--spain">
          <path className="j-pour-lit j-print" d={blob(392, 316, 100, 5, 0.03)} fill="var(--apricot)" />
        </g>
        <g className="j-pour-stop j-pour-stop--india">
          <path className="j-pour-lit j-print" d={blob(76, 452, 96, 8, 0.03)} fill="var(--rose)" />
        </g>
        <path className="j-print" d={blob(300, 676, 170, 11, 0.025)} fill="var(--sky)" opacity="0.85" />
        <circle cx="300" cy="676" r="204" fill="none" stroke={INK} strokeWidth="1.1" strokeDasharray="2 7" opacity="0.6" />
        <circle cx="392" cy="316" r="128" fill="none" stroke={INK} strokeWidth="1.1" strokeDasharray="2 7" opacity="0.45" />
      </g>

      {/* --- the ladle and its stream, well forward ------------------------ */}
      <g className="j-pour-layer" style={{ "--k": 3.2 }}>
        <g className="j-pour-ladle">
          <g fill={INK}>
            {/* the vessel, and the trunnion it swings on */}
            <path d="M 66 78 H 196 L 178 158 Q 130 182 84 158 Z" />
            <rect x="56" y="62" width="150" height="18" rx="4" />
            <circle cx="196" cy="92" r="13" />
            <rect x="196" y="86" width="34" height="12" rx="5" />
          </g>
          {/* what is in it, visible over the lip */}
          <path className="j-pour-melt" d="M 74 84 H 190 L 186 102 Q 130 118 78 102 Z" fill="var(--coral)" />
        </g>

        {/* The stream out of the spout. Scales down from its tip rather than
            fading in: liquid arrives, it does not materialise. */}
        <path
          className="j-pour-spout"
          // Leaves from the TIP of the spout: (230, 92) on the ladle, which
          // the 26deg tip around (196, 92) carries to about (227, 107). Not
          // inside the tipping group, because it must hang straight down
          // rather than tilt with the vessel.
          d="M 227 107 C 229 132 224 166 214 196"
          fill="none"
          stroke="var(--coral)"
          strokeWidth="9"
          strokeLinecap="round"
        />
      </g>

      {/* --- the pipe ----------------------------------------------------- */}
      <g className="j-pour-layer" style={{ "--k": 2.4 }}>
        <path d={PIPE} fill="none" stroke={INK} strokeWidth="24" strokeLinecap="round" />
        <path d={PIPE} fill="none" stroke="var(--paper)" strokeWidth="13" strokeLinecap="round" />
        {/* the metal actually travelling */}
        <path
          className="j-pour-charge"
          d={PIPE}
          pathLength="100"
          fill="none"
          stroke={`url(#${ramp})`}
          strokeWidth="13"
          strokeLinecap="round"
        />
      </g>

      {/* --- Spain: the foundry ------------------------------------------- */}
      <g className="j-pour-layer" style={{ "--k": 1.6 }}>
        <g fill={INK}>
          {/* sawtooth hall — the same north-light roof as the 2011 beat */}
          <path d="M 330 366 V 322 L 356 296 V 322 L 382 296 V 322 L 408 296 V 322 L 434 296 V 366 Z" />
          <rect x="440" y="256" width="18" height="110" />
          <rect x="435" y="248" width="28" height="11" rx="3" />
        </g>
        <g fill="var(--butter)">
          <rect x="342" y="340" width="12" height="16" />
          <rect x="370" y="340" width="12" height="16" />
          <rect x="398" y="340" width="12" height="16" />
        </g>
      </g>

      {/* --- India: the plant ---------------------------------------------- */}
      <g className="j-pour-layer" style={{ "--k": 1.3 }}>
        <g fill={INK}>
          <rect x="36" y="452" width="54" height="52" />
          <rect x="94" y="424" width="38" height="80" />
          <path d="M 20 504 V 470 Q 44 438 68 470 V 504 Z" />
          <rect x="52" y="404" width="13" height="48" />
        </g>
        <g fill="var(--butter)">
          <rect x="46" y="466" width="10" height="13" />
          <rect x="66" y="466" width="10" height="13" />
          <rect x="102" y="440" width="10" height="13" />
          <rect x="102" y="464" width="10" height="13" />
        </g>
      </g>

      {/* --- Sweden: pines beside the mould -------------------------------- */}
      <g className="j-pour-layer" style={{ "--k": 2.6 }}>
        <g fill={INK}>
          <polygon points="430,656 456,580 482,656" />
          <polygon points="470,656 490,606 510,656" />
          <polygon points="392,662 412,616 432,662" />
        </g>
      </g>

      {/* --- the mould, nearest -------------------------------------------- */}
      <g className="j-pour-layer" style={{ "--k": 4.2 }}>
        <g fill={INK}>
          <path d="M 166 632 H 190 V 752 H 166 Z" />
          <path d="M 398 632 H 422 V 752 H 398 Z" />
          <path d="M 166 744 H 422 V 760 H 166 Z" />
        </g>

        {/* The cavity, filling. One rectangle, clipped to the shape; the
            empty cavity is hatched so it reads as a shape before any metal
            has reached it. */}
        <g clipPath={`url(#${cast})`}>
          <rect x="180" y="616" width="228" height="150" fill="var(--paper)" />
          <rect x="180" y="616" width="228" height="150" fill={`url(#${hatch})`} opacity="0.55" />
          <g className="j-pour-fill">
            <rect x="180" y="616" width="228" height="150" fill="var(--sky)" />
            <rect x="180" y="616" width="228" height="5" fill="var(--lilac)" />
          </g>
        </g>
        <g fill="none" stroke={INK} strokeWidth="1.6" strokeLinejoin="round">
          {CAST.map((d) => (
            <path key={d} d={d} />
          ))}
        </g>
      </g>
    </svg>
  );
}
