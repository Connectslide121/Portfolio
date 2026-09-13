import React, { useEffect, useRef, useState } from "react";
import { BEATS, OVERVIEW, SCENE_W, VIEW_H } from "./config";
import { heatColor } from "./heat";
import { OrgMarks } from "../components/OrgMark";

/**
 * Labels for the recap's laid-out places.
 *
 * The map itself is the real world — arriving at the last beat lifts the
 * camera and the actual silhouettes lay out across the lower half of the
 * frame (see projectScenes in timeline.js), with the work wall above them.
 * All this adds is a label standing on each place, so it has no background
 * of its own: you are looking at the journey, not a diagram of it.
 *
 * Below 900px there is no room for the layout, so the same beats are listed
 * vertically instead.
 */

const EDGE = 116; // half a label, so the outermost ones stay on screen

// The shortest a label can be. Used only to decide whether one would end up
// underneath the map; a label that would is pinned just above it instead, by
// its BOTTOM edge, so no height has to be guessed to place it.
const MIN_LABEL_H = 92;
const RAIL_GAP = 8;

// Sits just above the highest laid-out place. Anchored in world coordinates
// like the labels are: a fixed percentage collided with the work wall on
// shorter viewports.
const CAPTION_Y = 604;

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

/**
 * Where a label actually goes.
 *
 * Normally it stands on the ground just in front of its place. On a short
 * viewport the lowest places project down into the map at the bottom of the
 * frame, and the label would be buried behind it — so those are pinned just
 * above the map instead. Anchoring the lifted ones by `bottom` means CSS
 * still decides how tall they are; nothing here has to know.
 */
const place = (box, spot, railTop) => {
  const at = project(box, spot.x, spot.y);
  const floor = railTop - RAIL_GAP;
  if (at.top + MIN_LABEL_H <= floor) return { left: at.left, top: at.top };
  return { left: at.left, bottom: box.h - floor, lifted: true };
};

export default function JourneyOverview({ index, onPick }) {
  const ref = useRef(null);
  const [box, setBox] = useState(null);

  useEffect(() => {
    const measure = () => {
      const el = ref.current;
      if (!el) return;
      // The map's height changes with the viewport, so read it rather than
      // hardcoding a clearance that would drift the moment it is restyled.
      const rail = document.querySelector(".j-rail");
      const frame = el.getBoundingClientRect();
      setBox({
        w: el.clientWidth,
        h: el.clientHeight,
        railTop: rail
          ? rail.getBoundingClientRect().top - frame.top
          : el.clientHeight,
      });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  return (
    <div className="j-overview" ref={ref} role="dialog" aria-label="The whole journey">
      <p
        className="j-ov-caption"
        style={
          box
            ? (() => {
                const at = project(box, SCENE_W / 2, CAPTION_Y);
                return { left: `${at.left}px`, top: `${at.top}px` };
              })()
            : { opacity: 0 }
        }
      >
        The whole journey · steel to software · Spain to Sweden
      </p>

      <div className="j-ov-spots">
        {OVERVIEW.map((spot) => {
          const i = BEATS.findIndex((b) => b.id === spot.id);
          const beat = BEATS[i];
          const at = box ? place(box, spot, box.railTop) : null;
          return (
            <button
              key={beat.id}
              type="button"
              className={`j-ov-node${i === index ? " on" : ""}`}
              data-lifted={at?.lifted ? "true" : undefined}
              style={{
                ...(at
                  ? {
                      left: `${at.left}px`,
                      ...(at.lifted
                        ? { bottom: `${at.bottom}px` }
                        : { top: `${at.top}px` }),
                    }
                  : { opacity: 0 }),
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
    </div>
  );
}
