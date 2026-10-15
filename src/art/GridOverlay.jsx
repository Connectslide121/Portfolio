import React from "react";
import "../styles/art.css";

/** The page's 12-column grid, drawn over everything. Toggled with G. */
export default function GridOverlay({ visible }) {
  if (!visible) return null;
  return (
    <div className="grid-overlay" aria-hidden="true">
      <div className="wrap grid-overlay-cols">
        {Array.from({ length: 12 }, (_, i) => (
          <span key={i}>{String(i + 1).padStart(2, "0")}</span>
        ))}
      </div>
    </div>
  );
}
