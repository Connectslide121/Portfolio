import React from "react";
import "../styles/hero-panorama.css";

/**
 * The static hero's artwork, in the journey's visual language.
 *
 * It replaces a 3D isometric render that read as a different product next to
 * the journey's flat silhouettes. This is the whole story in one frame: a
 * foundry on the left, a city on the right, and the stream running between
 * them turning from molten steel to cold blue — the same motif the journey
 * travels through beat by beat.
 *
 * Authored as coordinates and animated in CSS only. This ships in the main
 * bundle, so pulling GSAP in here would undo the journey's lazy split.
 */

const BASE = 430; // where everything meets the ground
const STREAM =
  "M 12 470 C 150 470 210 452 330 456 S 560 476 700 462 S 840 446 928 452";

/** Sawtooth north-light roof, same shape as the journey's foundry hall. */
const sawtooth = (x, y, teeth, w, h) => {
  let d = `M ${x} ${y}`;
  for (let i = 0; i < teeth; i++) {
    d += ` L ${x + i * w} ${y - h} L ${x + (i + 1) * w} ${y}`;
  }
  return `${d} L ${x + teeth * w} ${BASE} L ${x} ${BASE} Z`;
};

const windows = (x, y, cols, rows, gap = 22) =>
  Array.from({ length: cols * rows }).map((_, i) => ({
    x: x + (i % cols) * gap,
    y: y + Math.floor(i / cols) * (gap + 3),
    lit: (i * 7) % 5 !== 0,
  }));

export default function HeroPanorama() {
  return (
    <svg
      className="hero-panorama"
      viewBox="0 0 940 520"
      role="img"
      aria-label="A steel foundry on the left and a city on the right, joined by a stream that cools from molten orange to blue"
    >
      <defs>
        {/* Its own sky, warm at the foundry end and cold at the city end —
            the journey's two poles. Carrying a sky means the silhouettes can
            be dark ink against it, the way they are in the journey, instead of
            light shapes on the page (which read inside out). It also means the
            panel looks the same in either theme. */}
        <linearGradient id="hpSkyBg" x1="0" y1="0.1" x2="1" y2="0.9">
          <stop offset="0%" stopColor="#2a1206" />
          <stop offset="38%" stopColor="#1b1118" />
          <stop offset="100%" stopColor="#0b1a2e" />
        </linearGradient>
        <linearGradient id="hpStream" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--moltenColor)" />
          <stop offset="34%" stopColor="var(--moltenColor)" />
          <stop offset="72%" stopColor="var(--accentColor)" />
          <stop offset="100%" stopColor="var(--accentColor)" />
        </linearGradient>
        <filter id="hpGlow" x="-10%" y="-260%" width="120%" height="620%">
          <feGaussianBlur stdDeviation="9" />
        </filter>
        <clipPath id="hpClip">
          <rect x="0" y="0" width="940" height="520" rx="26" />
        </clipPath>
      </defs>

      <rect
        className="hp-sky"
        x="0"
        y="0"
        width="940"
        height="520"
        rx="26"
        fill="url(#hpSkyBg)"
      />

      {/* the sun, low and warm over the foundry end */}
      <circle
        className="hp-sun"
        cx="250"
        cy="212"
        r="96"
        fill="var(--moltenColor)"
        clipPath="url(#hpClip)"
      />

      {/* distant ridge */}
      <g clipPath="url(#hpClip)">
        <path
          className="hp-ridge"
          d="M -20 330 L 90 286 L 170 318 L 268 268 L 372 316 L 470 282 L 580 320 L 700 276 L 820 312 L 960 286 L 960 470 L -20 470 Z"
        />

        {/* foundry: chimney, north-light hall, ladle */}
        <g className="hp-solid">
          <polygon points="46,430 58,196 96,196 108,430" />
          <rect x="38" y="182" width="78" height="18" />
          <path d={sawtooth(132, 320, 3, 74, 46)} />
          <rect x="358" y="356" width="118" height="74" />
          <rect x="346" y="342" width="142" height="12" />
          <polygon points="512,368 578,368 566,426 524,426" />
          <rect x="538" y="426" width="14" height="20" />
        </g>

        {/* city: blocks with lit windows */}
        <g className="hp-solid">
          <rect x="628" y="252" width="74" height="178" />
          <rect x="714" y="208" width="62" height="222" />
          <rect x="788" y="286" width="56" height="144" />
          <rect x="856" y="236" width="70" height="194" />
          <rect x="736" y="180" width="18" height="30" />
        </g>
        <g className="hp-windows">
          {[
            ...windows(644, 272, 3, 6),
            ...windows(728, 228, 2, 7),
            ...windows(802, 306, 2, 4),
            ...windows(870, 256, 3, 6),
          ].map(
            (w, i) =>
              w.lit && <rect key={i} x={w.x} y={w.y} width="8" height="11" />,
          )}
        </g>

        {/* ground */}
        <path
          className="hp-ground"
          d="M -20 470 L 960 470 L 960 540 L -20 540 Z"
        />
      </g>

      {/* Everything below is clipped too: the stream's glow reaches past the
          panel's rounded corners otherwise. */}
      <g clipPath="url(#hpClip)">
        {/* the stream: molten at the foundry, cold by the city */}
        <path
          className="hp-stream-glow"
          d={STREAM}
          fill="none"
          stroke="url(#hpStream)"
          strokeWidth="17"
          strokeLinecap="round"
          filter="url(#hpGlow)"
        />
        <path
          d={STREAM}
          fill="none"
          stroke="url(#hpStream)"
          strokeWidth="4.5"
          strokeLinecap="round"
        />
        <path
          className="hp-pulse"
          d={STREAM}
          fill="none"
          stroke="#ffffff"
          strokeWidth="5"
          strokeLinecap="round"
        />

        {/* sparks off the molten end, snow over the cold one */}
        <g className="hp-sparks" fill="var(--moltenColor)">
          {Array.from({ length: 6 }).map((_, i) => (
            <circle key={i} cx={534 + i * 6} cy="424" r={1.8 + (i % 3) * 0.6} />
          ))}
        </g>
        <g className="hp-snow" fill="var(--accentColor)">
          {Array.from({ length: 7 }).map((_, i) => (
            <circle key={i} cx={650 + i * 42} cy={110 + (i % 4) * 34} r="2" />
          ))}
        </g>
      </g>
    </svg>
  );
}
