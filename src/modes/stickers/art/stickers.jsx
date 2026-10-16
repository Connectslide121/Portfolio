import React from "react";

/**
 * Die-cut stickers, drawn by hand. Each is an SVG on a 200 x 200 canvas;
 * the white border and the drop shadow come from CSS (.sticker), so every
 * one peels the same way.
 */

const K = "#111";

export const STICKERS = {
  // A ladle tipping molten steel: the foundry years.
  ladle: (
    <>
      <path d="M40 70 L130 50 L150 130 L60 150 Z" fill="#555" stroke={K} strokeWidth="6" strokeLinejoin="round" />
      <path d="M44 72 L130 52 L136 74 L50 92 Z" fill="#ff7a1a" stroke={K} strokeWidth="6" strokeLinejoin="round" />
      <path d="M128 55 L182 38" stroke={K} strokeWidth="12" strokeLinecap="round" />
      <path d="M48 96 C 40 130, 46 160, 52 186" stroke="#ffd23f" strokeWidth="14" strokeLinecap="round" fill="none" />
      <path d="M48 96 C 40 130, 46 160, 52 186" stroke={K} strokeWidth="4" strokeLinecap="round" fill="none" strokeDasharray="1 18" />
      <circle cx="80" cy="176" r="6" fill="#ffd23f" stroke={K} strokeWidth="4" />
      <circle cx="28" cy="160" r="5" fill="#ff7a1a" stroke={K} strokeWidth="4" />
    </>
  ),
  // Sweden.
  sweden: (
    <>
      <rect x="20" y="44" width="160" height="112" rx="14" fill="#2f6bff" stroke={K} strokeWidth="6" />
      <rect x="20" y="88" width="160" height="24" fill="#ffd23f" />
      <rect x="66" y="44" width="24" height="112" fill="#ffd23f" />
      <rect x="20" y="44" width="160" height="112" rx="14" fill="none" stroke={K} strokeWidth="6" />
    </>
  ),
  // Curly braces: code.
  code: (
    <>
      <circle cx="100" cy="100" r="82" fill="#2bd47d" stroke={K} strokeWidth="6" />
      <path d="M78 52 C 56 52, 64 92, 48 100 C 64 108, 56 148, 78 148" fill="none" stroke={K} strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M122 52 C 144 52, 136 92, 152 100 C 136 108, 144 148, 122 148" fill="none" stroke={K} strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="100" cy="100" r="8" fill={K} />
    </>
  ),
  // A starburst badge.
  star: (
    <>
      <path
        d="M100 10 L118 52 L162 38 L148 82 L190 100 L148 118 L162 162 L118 148 L100 190 L82 148 L38 162 L52 118 L10 100 L52 82 L38 38 L82 52 Z"
        fill="#ff6fb5"
        stroke={K}
        strokeWidth="6"
        strokeLinejoin="round"
      />
      <path d="M100 62 L110 88 L138 88 L116 104 L124 132 L100 116 L76 132 L84 104 L62 88 L90 88 Z" fill="#fff4e0" stroke={K} strokeWidth="5" strokeLinejoin="round" />
    </>
  ),
  // A games controller.
  pad: (
    <>
      <path d="M40 80 Q 40 56, 66 56 H134 Q 160 56, 160 80 L170 136 Q 174 158, 152 158 Q 138 158, 128 140 H72 Q 62 158, 48 158 Q 26 158, 30 136 Z" fill="#a06bff" stroke={K} strokeWidth="6" strokeLinejoin="round" />
      <rect x="60" y="84" width="12" height="36" rx="3" fill={K} />
      <rect x="48" y="96" width="36" height="12" rx="3" fill={K} />
      <circle cx="132" cy="92" r="8" fill="#ffd23f" stroke={K} strokeWidth="4" />
      <circle cx="148" cy="110" r="8" fill="#ff6fb5" stroke={K} strokeWidth="4" />
    </>
  ),
  // A spark of AI.
  spark: (
    <>
      <rect x="22" y="22" width="156" height="156" rx="40" fill="#ffd23f" stroke={K} strokeWidth="6" />
      <path d="M100 40 C 106 80, 120 94, 160 100 C 120 106, 106 120, 100 160 C 94 120, 80 106, 40 100 C 80 94, 94 80, 100 40 Z" fill={K} />
      <path d="M150 46 C 152 56, 156 60, 166 62 C 156 64, 152 68, 150 78 C 148 68, 144 64, 134 62 C 144 60, 148 56, 150 46 Z" fill="#fff4e0" stroke={K} strokeWidth="3" />
    </>
  ),
  // A smiling coffee cup — every lead developer runs on one.
  cup: (
    <>
      <path d="M44 70 H140 L130 168 Q 128 180, 116 180 H68 Q 56 180, 54 168 Z" fill="#fff4e0" stroke={K} strokeWidth="6" strokeLinejoin="round" />
      <path d="M138 90 Q 176 92, 168 124 Q 162 146, 132 142" fill="none" stroke={K} strokeWidth="8" strokeLinecap="round" />
      <rect x="40" y="58" width="104" height="18" rx="6" fill="#ff7a1a" stroke={K} strokeWidth="6" />
      <circle cx="78" cy="116" r="6" fill={K} />
      <circle cx="108" cy="116" r="6" fill={K} />
      <path d="M78 136 Q 93 150, 108 136" fill="none" stroke={K} strokeWidth="6" strokeLinecap="round" />
      <path d="M72 44 Q 64 30, 74 18 M100 44 Q 92 30, 102 18" fill="none" stroke={K} strokeWidth="5" strokeLinecap="round" />
    </>
  ),
};

export function StickerArt({ name }) {
  return (
    <svg viewBox="0 0 200 200" aria-hidden="true">
      {STICKERS[name]}
    </svg>
  );
}
