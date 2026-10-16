import React, { useEffect, useState } from "react";
import "../styles/art.css";

/**
 * One poster per act of the career (chapters in src/data/journey.js), drawn
 * from the same few shapes as the hero composition so the three read as a
 * series.
 *
 *   steel     a red disc of molten metal, a ladle bar tipping it, a thin
 *             stream pouring into a black mould
 *   reset     a full square and an empty one, and a red point crossing over
 *   software  a grid of bits that keeps flipping
 */

function Steel() {
  return (
    <>
      <rect className="tone-grey" x="0" y="200" width="300" height="100" />
      <circle className="tone-red" cx="190" cy="105" r="75" />
      <rect className="tone-ink" x="30" y="60" width="200" height="22" transform="rotate(28 130 71)" />
      <line className="pour" x1="88" y1="125" x2="88" y2="230" />
      <rect className="tone-ink" x="40" y="230" width="96" height="70" />
      <rect className="tone-paper" x="64" y="250" width="48" height="20" />
    </>
  );
}

function Reset() {
  return (
    <>
      <rect className="tone-ink" x="20" y="90" width="120" height="120" />
      <rect className="outline" x="160" y="90" width="120" height="120" />
      <line className="hair" x1="0" y1="150" x2="300" y2="150" />
      <circle className="tone-red traveller" cx="80" cy="150" r="22" />
      <path className="tone-grey" d="M20 300 L20 240 A60 60 0 0 1 80 300 Z" />
      <path className="tone-ink" d="M280 0 L280 60 A60 60 0 0 1 220 0 Z" />
    </>
  );
}

const BITS = 5;
const seedBits = () =>
  Array.from({ length: BITS * BITS }, (_, i) => ([2, 6, 12, 13, 18, 24].includes(i) ? 1 : [7, 16, 21].includes(i) ? 2 : 0));

function Software() {
  const [bits, setBits] = useState(seedBits);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => {
      setBits((prev) => {
        const next = [...prev];
        for (let n = 0; n < 3; n++) {
          const i = Math.floor(Math.random() * next.length);
          next[i] = (next[i] + 1) % 3;
        }
        return next;
      });
    }, 1100);
    return () => window.clearInterval(id);
  }, []);

  const size = 300 / BITS;
  return (
    <>
      {bits.map((b, i) => (
        <rect
          key={i}
          className={b === 1 ? "tone-ink bit" : b === 2 ? "tone-red bit" : "outline bit"}
          x={(i % BITS) * size + 6}
          y={Math.floor(i / BITS) * size + 6}
          width={size - 12}
          height={size - 12}
        />
      ))}
    </>
  );
}

const ART = { steel: Steel, reset: Reset, software: Software };

export default function ActPoster({ id, label }) {
  const Art = ART[id];
  if (!Art) return null;
  return (
    <svg className={`act-poster act-${id}`} viewBox="0 0 300 300" role="img" aria-label={label}>
      <Art />
    </svg>
  );
}
