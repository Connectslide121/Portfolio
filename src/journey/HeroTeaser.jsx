import React from "react";
import "../styles/hero-teaser.css";

/**
 * Beat 0, living in the hero (D2): the invitation into Journey mode, as a
 * printed ticket. The whole concept on one strip — the pastel ramp runs warm
 * to cool, foundry to today, with the four places marked on it like stops
 * on a line.
 *
 * Animated with CSS only — importing GSAP here would drag it into the main
 * bundle and defeat the point of lazy-loading Journey mode.
 */
const LINE = "M 20 44 C 300 44 420 40 620 44 S 960 48 1180 44";
const STOPS = [
  { x: 20, tint: "var(--lime)" },
  { x: 330, tint: "var(--coral)" },
  { x: 640, tint: "var(--rose)" },
  { x: 900, tint: "var(--sky)" },
  { x: 1180, tint: "var(--lilac)" },
];

export default function HeroTeaser({ onEnter }) {
  return (
    <button
      className="hero-teaser"
      onClick={onEnter}
      aria-label="Take the journey — an animated walk through my career from 2005 to today"
    >
      <span className="hero-teaser-label">
        <span className="hero-teaser-title">
          Take the <em>journey</em>
        </span>
        <span className="hero-teaser-sub">
          steel → software · Spain → Sweden · 2005 → today
        </span>
      </span>

      <svg viewBox="0 0 1200 80" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="teaserRamp" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--lime)" />
            <stop offset="25%" stopColor="var(--coral)" />
            <stop offset="50%" stopColor="var(--rose)" />
            <stop offset="75%" stopColor="var(--sky)" />
            <stop offset="100%" stopColor="var(--lilac)" />
          </linearGradient>
        </defs>
        {/* two plates, slightly out of register */}
        <path d={LINE} fill="none" stroke="url(#teaserRamp)" strokeWidth="12" strokeLinecap="round" />
        <path
          className="teaser-run"
          d={LINE}
          transform="translate(4 -4)"
          fill="none"
          stroke="var(--ink)"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>

      <span className="hero-teaser-stops" aria-hidden="true">
        {STOPS.map((s) => (
          <i key={s.x} style={{ left: `${(s.x / 1200) * 100}%`, "--tint": s.tint }} />
        ))}
      </span>

      <span className="hero-teaser-cue" aria-hidden="true">
        →
      </span>
    </button>
  );
}
