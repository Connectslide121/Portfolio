import React from "react";
import "../styles/hero-teaser.css";

/**
 * Beat 0, living in the hero (D2). The whole concept compressed into one
 * strip: steel pours from a ladle on the left, flows right, and cools to the
 * site's blue by the time it reaches today. Clicking opens the full journey.
 *
 * Animated with CSS only — importing GSAP here would drag it into the main
 * bundle and defeat the point of lazy-loading Journey mode.
 */
const STREAM = "M 16 74 C 260 74 360 96 620 88 S 940 66 1184 78";

export default function HeroTeaser({ onEnter }) {
  return (
    <button
      className="hero-teaser"
      onClick={onEnter}
      aria-label="Take the journey — an animated walk through my career from 2005 to today"
    >
      <svg viewBox="0 0 1200 150" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="teaserStream" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ff6a00" />
            <stop offset="38%" stopColor="#ff9d3d" />
            <stop offset="68%" stopColor="#8ab4f8" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
          <filter id="teaserGlow" x="-20%" y="-200%" width="140%" height="500%">
            <feGaussianBlur stdDeviation="6" />
          </filter>
        </defs>

        {/* sparks, drifting off the molten end */}
        <g fill="#ffd08a" className="teaser-sparks">
          {Array.from({ length: 7 }).map((_, i) => (
            <circle key={i} cx={26 + i * 7} cy="70" r={1.6 + (i % 3) * 0.6} />
          ))}
        </g>

        {/* the stream: molten at the foundry, cold by today */}
        <path
          d={STREAM}
          fill="none"
          stroke="url(#teaserStream)"
          strokeWidth="14"
          strokeLinecap="round"
          filter="url(#teaserGlow)"
          opacity="0.55"
        />
        <path
          d={STREAM}
          fill="none"
          stroke="url(#teaserStream)"
          strokeWidth="4"
          strokeLinecap="round"
        />
        {/* a short bright dash travelling the length of it */}
        <path
          className="teaser-pulse"
          d={STREAM}
          fill="none"
          stroke="#ffffff"
          strokeWidth="5"
          strokeLinecap="round"
        />
      </svg>

      <span className="hero-teaser-label">
        <span className="hero-teaser-title">Take the journey</span>
        <span className="hero-teaser-sub">
          steel → software · Spain → Sweden · 2005 → today
        </span>
      </span>
      <span className="hero-teaser-cue" aria-hidden="true">
        →
      </span>
    </button>
  );
}
