import React from "react";
import "../styles/halftone.css";

/**
 * Prints whatever it wraps — a photo, a playing video, an SVG drawing — as
 * a newspaper halftone, live. The picture is blurred to greys, a rotated
 * dot screen is laid over it, and a high contrast filter on the frame
 * snaps the result to ink dots. Hovering lifts the screen off the same
 * element to show the original, in colour — one copy of the media, so a
 * video is never decoded twice.
 *
 * `drawing` prints a line drawing as a negative in the night edition, so
 * its black shapes turn to light ink instead of vanishing into the page.
 */
export default function Halftone({ children, className = "", caption, credit, reveal = true, drawing = false }) {
  return (
    <figure className={`halftone-figure ${className}`.trim()}>
      <div className={`halftone${reveal ? " can-reveal" : ""}${drawing ? " is-drawing" : ""}`}>
        <div className="halftone-screen">{children}</div>
      </div>
      {(caption || credit) && (
        <figcaption>
          {caption}
          {credit && <span className="credit">{credit}</span>}
        </figcaption>
      )}
    </figure>
  );
}
