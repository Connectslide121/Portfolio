import React from "react";
import { BEATS } from "./config";
import { heatColor } from "./heat";

/**
 * The bottom rail, as a map rather than a page counter.
 *
 * It replaced a strip of bare years. A year on its own tells a reader where
 * they are only if they already know the story, which is exactly what a
 * first-time visitor does not — so every stop now carries what happened in
 * it, and the whole arc (studies, foundry, reset, software) is legible at
 * every beat instead of only at the recap.
 *
 * The connecting line is the same hot -> cold ramp the scenes ride, sampled at
 * each beat's own heat. That makes it cool at the studies, molten through the
 * foundry years, and blue from the career reset onward: the thesis of the
 * whole journey, stated in one line of pixels, before a word is read.
 */

const pct = (i) => ((i / (BEATS.length - 1)) * 100).toFixed(1);

// Static — BEATS never changes at runtime, so this is built once rather than
// re-concatenated on every render of a component that lives on every beat.
const TRAIL_LINE = `linear-gradient(to right, ${BEATS.map(
  (beat, i) => `${heatColor(beat.heat)} ${pct(i)}%`,
).join(", ")})`;

export default function JourneyTrail({
  index,
  compact = false,
  onPick,
  onPrev,
  onNext,
}) {
  const active = BEATS[index];

  return (
    // A div, not a <nav>: navbar.css styles the bare `nav` ELEMENT (fixed to
    // the top of the viewport, 80px tall, space-between), and the site's own
    // navbar has no class to scope that rule to. The landmark role gives
    // assistive tech the same thing without inheriting the site chrome.
    <div
      className="j-rail"
      data-compact={compact ? "true" : "false"}
      role="navigation"
      aria-label="Journey map"
    >
      {/* Shown whenever the stops lose their labels — on phones, where eight
          of them will not fit, and on the recap, where they are redundant. */}
      <p className="j-rail-now" aria-hidden="true">
        <span>{active?.railLabel}</span>
        {active?.tag}
      </p>

      <button
        className="j-nav"
        onClick={onPrev}
        disabled={index === 0}
        aria-label="Previous stop"
      >
        ‹
      </button>

      <ol className="j-trail" style={{ "--trail-line": TRAIL_LINE }}>
        {BEATS.map((beat, i) => (
          <li key={beat.id}>
            <button
              type="button"
              className={i === index ? "on" : ""}
              style={{ "--tint": heatColor(beat.heat) }}
              onClick={() => onPick(i)}
              aria-current={i === index}
              title={beat.year ? `${beat.year} — ${beat.role}` : beat.role}
            >
              <span className="j-trail-dot" aria-hidden="true" />
              <span className="j-trail-year">{beat.railLabel}</span>
              <span className="j-trail-tag">{beat.tag}</span>
            </button>
          </li>
        ))}
      </ol>

      <button
        className="j-nav"
        onClick={onNext}
        disabled={index === BEATS.length - 1}
        aria-label="Next stop"
      >
        ›
      </button>
    </div>
  );
}
