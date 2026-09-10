import React, { useEffect, useRef, useState } from "react";
import { BEATS, OVERVIEW, SCENE_W, VIEW_H } from "./config";
import { heatColor } from "./heat";
import { OrgMarks } from "../components/OrgMark";

/**
 * Chrome for the bird's-eye view.
 *
 * The map itself is the real world — the camera lifts and the actual
 * silhouettes lay out across the ground (see projectScenes in timeline.js).
 * All this adds is the labels standing on each place and a way back, so it
 * has no background of its own: you are looking at the journey, not a
 * diagram of it.
 *
 * Below 900px there is no room for the layout, so the same beats are listed
 * vertically instead.
 */

const EDGE = 116; // half a label, so the outermost ones stay on screen

/** viewBox -> screen, matching preserveAspectRatio="xMidYMid slice". */
const project = (box, x, y) => {
  const scale = Math.max(box.w / SCENE_W, box.h / VIEW_H);
  const left = (box.w - SCENE_W * scale) / 2 + x * scale;
  return {
    // The first and last places sit near the frame edge, where a centred
    // label would hang off it.
    left: Math.max(EDGE, Math.min(box.w - EDGE, left)),
    top: (box.h - VIEW_H * scale) / 2 + y * scale,
  };
};

export default function JourneyOverview({ index, onPick, onClose }) {
  const ref = useRef(null);
  const [box, setBox] = useState(null);

  useEffect(() => {
    const measure = () => {
      const el = ref.current;
      if (el) setBox({ w: el.clientWidth, h: el.clientHeight });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  return (
    <div className="j-overview" ref={ref} role="dialog" aria-label="The whole journey">
      <header>
        <div>
          <h2>The whole journey</h2>
          <p>Steel to software · Spain to Sweden · 2005 to today</p>
        </div>
        <button type="button" className="j-ov-close" onClick={onClose}>
          Back <span aria-hidden="true">✕</span>
        </button>
      </header>

      <div className="j-ov-spots">
        {OVERVIEW.map((spot, i) => {
          const beat = BEATS[i];
          const at = box ? project(box, spot.x, spot.y) : null;
          return (
            <button
              key={beat.id}
              type="button"
              className={`j-ov-node${i === index ? " on" : ""}`}
              style={{
                ...(at ? { left: `${at.left}px`, top: `${at.top}px` } : { opacity: 0 }),
                "--tint": heatColor(beat.heat),
                "--delay": `${180 + i * 70}ms`,
              }}
              onClick={() => onPick(i)}
              aria-current={i === index}
            >
              <span className="j-ov-year">{beat.railLabel}</span>
              <span className="j-ov-role">{beat.role}</span>
              <span className="j-ov-org">{beat.org}</span>
              <OrgMarks ids={beat.orgs} size="sm" />
            </button>
          );
        })}
      </div>

      <p className="j-ov-hint">pick a place to drop back into it · O or Esc to return</p>
    </div>
  );
}
