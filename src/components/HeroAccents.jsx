import React from "react";
import "../styles/hero-accents.css";

/**
 * A light dusting of the journey's atmosphere over the static hero.
 *
 * Deliberately additive: the hero's own illustration and the "Take the
 * journey" teaser are left exactly as they are. This only adds the ambience
 * the journey has and the static page did not — sparks over the warm side,
 * cool motes over the cold side, and a hairline horizon carrying the
 * molten-to-cold ramp.
 *
 * Plain DOM rather than SVG: a stretched viewBox scales radii with the box,
 * so "small" dots came out as fat blobs on a wide hero. In px they stay the
 * size they were meant to be at any width.
 *
 * Sits behind the hero content and takes no pointer events. CSS-animated
 * only — this is in the main bundle, and GSAP here would undo the journey's
 * lazy split.
 */

// Warm where the story starts, cool where it ends.
const MOTES = [
  { x: 7, y: 17, size: 3, warm: true },
  { x: 15, y: 61, size: 4, warm: true },
  { x: 22, y: 33, size: 2, warm: true },
  { x: 31, y: 79, size: 3, warm: true },
  { x: 40, y: 23, size: 2, warm: true },
  { x: 54, y: 57, size: 3, warm: false },
  { x: 63, y: 13, size: 2, warm: false },
  { x: 72, y: 72, size: 3, warm: false },
  { x: 85, y: 29, size: 4, warm: false },
  { x: 93, y: 53, size: 2, warm: false },
];

export default function HeroAccents() {
  return (
    <div className="hero-accents" aria-hidden="true">
      {MOTES.map((m, i) => (
        <span
          key={i}
          className={`ha-mote${m.warm ? " warm" : ""}`}
          style={{
            left: `${m.x}%`,
            top: `${m.y}%`,
            width: `${m.size}px`,
            height: `${m.size}px`,
            animationDelay: `${i * 0.7}s`,
          }}
        />
      ))}
      <span className="ha-horizon" />
    </div>
  );
}
