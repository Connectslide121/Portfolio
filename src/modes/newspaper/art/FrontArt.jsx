import React from "react";

/**
 * The front-page picture, drawn soft so the halftone screen has tones to
 * work with: a ladle tipping molten steel on the left, the stream falling
 * through a glow that turns into the light of a laptop screen on the right.
 * Twelve years in one picture.
 */
export default function FrontArt() {
  return (
    <svg className="front-art" viewBox="0 0 800 460" role="img" aria-label="A ladle pours molten steel; the stream becomes the glow of a laptop screen">
      <defs>
        <radialGradient id="fa-glow" cx="0.5" cy="0.55" r="0.6">
          <stop offset="0" stopColor="#cfcfcf" />
          <stop offset="0.35" stopColor="#8a8a8a" />
          <stop offset="1" stopColor="#5a5a5a" />
        </radialGradient>
        <linearGradient id="fa-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4c4c4c" />
          <stop offset="1" stopColor="#7a7a7a" />
        </linearGradient>
        <linearGradient id="fa-stream" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#9a9a9a" />
          <stop offset="0.5" stopColor="#fff" />
          <stop offset="1" stopColor="#9a9a9a" />
        </linearGradient>
        <linearGradient id="fa-screen" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#d6d6d6" />
          <stop offset="1" stopColor="#5e5e5e" />
        </linearGradient>
      </defs>

      <rect width="800" height="460" fill="url(#fa-sky)" />
      <ellipse cx="380" cy="330" rx="300" ry="170" fill="url(#fa-glow)" opacity="0.85" />

      {/* Floor. */}
      <rect y="380" width="800" height="80" fill="#1a1a1a" />
      <rect y="378" width="800" height="6" fill="#bdbdbd" />

      {/* Ladle, tipped. */}
      <g transform="rotate(-24 200 160)">
        <rect x="80" y="110" width="190" height="130" rx="10" fill="#000" />
        <rect x="88" y="104" width="174" height="22" rx="8" fill="#f4f4f4" />
        <rect x="270" y="150" width="120" height="16" rx="6" fill="#050505" />
        <rect x="40" y="168" width="44" height="14" rx="5" fill="#050505" />
      </g>

      {/* The pour. */}
      <path d="M302 150 C 330 190, 348 250, 352 330" stroke="#000" strokeWidth="34" fill="none" strokeLinecap="round" />
      <path d="M302 150 C 330 190, 348 250, 352 330" stroke="url(#fa-stream)" strokeWidth="22" fill="none" strokeLinecap="round" />
      <ellipse cx="356" cy="342" rx="78" ry="24" fill="#000" />
      <ellipse cx="356" cy="342" rx="70" ry="18" fill="#fafafa" />

      {/* Sparks. */}
      {[
        [400, 300, 6],
        [430, 270, 4],
        [380, 260, 5],
        [455, 320, 3],
        [320, 300, 4],
        [470, 250, 3],
        [300, 330, 3],
      ].map(([x, y, r], i) => (
        <circle key={i} cx={x} cy={y} r={r} fill="#fff" />
      ))}

      {/* Laptop. */}
      <g transform="translate(520 200)">
        <rect x="0" y="0" width="230" height="150" rx="8" fill="#000" />
        <rect x="10" y="10" width="210" height="130" rx="3" fill="url(#fa-screen)" />
        {[30, 52, 74, 96, 118].map((y, i) => (
          <rect key={y} x={24 + (i % 2) * 18} y={y} width={[120, 90, 140, 70, 110][i]} height="8" rx="3" fill="#3c3c3c" />
        ))}
        <path d="M-20 150 H250 L270 178 H-40 Z" fill="#0a0a0a" />
      </g>
    </svg>
  );
}
