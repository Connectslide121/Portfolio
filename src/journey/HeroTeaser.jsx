import React from "react";
import "../styles/hero-teaser.css";

/**
 * The way into Journey mode from the static page.
 *
 * It used to carry its own molten-to-cold stream, which made sense when the
 * hero's artwork was unrelated to the journey. Now that the hero panorama
 * carries that motif, a second stream a few hundred pixels below it was just
 * repetition — so this is a plain pill with one molten dot as a hint of where
 * it leads.
 */
export default function HeroTeaser({ onEnter }) {
  return (
    <button
      className="hero-teaser"
      onClick={onEnter}
      aria-label="Take the journey — an animated walk through my career from 2005 to today"
    >
      <span className="hero-teaser-dot" aria-hidden="true" />
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
