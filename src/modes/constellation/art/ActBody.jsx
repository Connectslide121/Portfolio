import React from "react";

/**
 * One celestial body per act of the career:
 *   steel     a red giant, pulsing
 *   reset     an eclipse — a dark disc crossing a sun, the corona flaring
 *   software  a blue star with a planet on a tight orbit
 */
// SMIL motion ignores the CSS reduced-motion rule, so ask directly.
const still = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function ActBody({ id, label }) {
  return (
    <svg className={`act-body body-${id}`} viewBox="-100 -100 200 200" role="img" aria-label={label}>
      <defs>
        <radialGradient id={`g-${id}`}>
          {id === "steel" && (
            <>
              <stop offset="0" stopColor="#ffe2b8" />
              <stop offset="0.35" stopColor="#ff8a3d" />
              <stop offset="0.7" stopColor="#c2361b" stopOpacity="0.5" />
              <stop offset="1" stopColor="#c2361b" stopOpacity="0" />
            </>
          )}
          {id === "reset" && (
            <>
              <stop offset="0.38" stopColor="#fff3d6" />
              <stop offset="0.5" stopColor="#ffd28a" stopOpacity="0.8" />
              <stop offset="1" stopColor="#ffd28a" stopOpacity="0" />
            </>
          )}
          {id === "software" && (
            <>
              <stop offset="0" stopColor="#f2f8ff" />
              <stop offset="0.3" stopColor="#8cc8ff" />
              <stop offset="0.7" stopColor="#3a6fd8" stopOpacity="0.45" />
              <stop offset="1" stopColor="#3a6fd8" stopOpacity="0" />
            </>
          )}
        </radialGradient>
      </defs>
      <circle className="body-glow" r="92" fill={`url(#g-${id})`} />
      {id === "steel" && <circle className="body-core" r="40" />}
      {id === "reset" && (
        <>
          <circle className="body-core" r="38" />
          <circle className="eclipse-moon" r="38" />
        </>
      )}
      {id === "software" && (
        <>
          <circle className="body-core" r="22" />
          <ellipse className="body-orbit" rx="62" ry="20" />
          <circle className="body-planet" r="6" cx={still ? 62 : 0}>
            {!still && <animateMotion dur="5s" repeatCount="indefinite" path="M 62 0 A 62 20 0 1 1 -62 0 A 62 20 0 1 1 62 0" />}
          </circle>
        </>
      )}
    </svg>
  );
}
