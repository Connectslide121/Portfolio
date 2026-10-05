import React, { useState } from "react";
import { canPlay, requestStart } from "./launch";
import "./toggle.css";

/**
 * Destruction mode's front door, in the hero. When the hero scrolls away the
 * corner badge takes over — DestroyToggle flies it down from this button's
 * last position, so the visitor sees where it went.
 */
export default function HeroDestroy() {
  const [allowed] = useState(canPlay);
  if (!allowed) return null;
  return (
    <button
      type="button"
      className="dz-hero-btn"
      onClick={requestStart}
      title="Rather not read? Blow the whole thing up."
      data-no-destroy
      data-no-field
    >
      <span className="dz-hero-icon" aria-hidden="true">
        <svg viewBox="-16 -16 32 32">
          <circle r="9" />
          <path d="M0 -14 V-5 M0 5 V14 M-14 0 H-5 M5 0 H14" />
          <circle className="dz-toggle-dot" r="2" />
        </svg>
      </span>
      <span className="dz-hero-text">Destruction mode</span>
      <span className="dz-hero-new" aria-hidden="true">
        new
      </span>
    </button>
  );
}
