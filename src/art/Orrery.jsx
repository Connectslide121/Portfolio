import React from "react";
import { featuredProjects } from "../components/projectList";
import { scrollToSection } from "../components/hooks";

/**
 * A small orrery: the featured projects in orbit around the initials. Each
 * planet keeps its own period; labels counter-rotate so they stay upright.
 * Click a planet to fly to its entry in the catalogue.
 */
const ORBITS = [92, 138, 184, 230];
const PERIODS = [26, 40, 58, 84]; // seconds per revolution
const START = [20, 160, 260, 70]; // degrees, so they do not start in a line

export default function Orrery() {
  return (
    <svg className="orrery" viewBox="-260 -260 520 520" role="group" aria-label="The featured projects, in orbit">
      <defs>
        <radialGradient id="sun">
          <stop offset="0" stopColor="#fff6dc" />
          <stop offset="0.45" stopColor="#ffc46b" />
          <stop offset="1" stopColor="#ff7a2f" stopOpacity="0" />
        </radialGradient>
      </defs>
      {ORBITS.map((r) => (
        <circle key={r} className="orbit" r={r} />
      ))}
      <circle className="sun-glow" r="70" fill="url(#sun)" />
      <circle className="sun" r="26" />
      <text className="sun-label" y="6">
        JM
      </text>

      {featuredProjects.map((p, i) => (
        <g key={p.title} className="planet-orbit" style={{ "--period": `${PERIODS[i]}s`, "--start": `${START[i]}deg` }}>
          <g transform={`translate(${ORBITS[i]} 0)`}>
            <g
              className="planet"
              tabIndex={0}
              role="link"
              aria-label={`${p.title} — go to the catalogue entry`}
              onClick={() => scrollToSection(`obj-${i + 1}`)}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), scrollToSection(`obj-${i + 1}`))}
            >
              <circle className={`planet-body planet-${i}`} r={9 + i * 1.5} />
              {i === 3 && <ellipse className="planet-ring" rx="22" ry="6" />}
              <g className="planet-label-wrap">
                <text className="planet-label" y={-18 - i}>
                  {p.title}
                </text>
              </g>
            </g>
          </g>
        </g>
      ))}
    </svg>
  );
}
