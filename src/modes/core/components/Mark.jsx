import React from "react";

/** The mark: a core and three nodes linked to it. */
export default function Mark() {
  return (
    <svg className="mark" viewBox="0 0 32 32" aria-hidden="true">
      <path className="mark-links" d="M16 16L6 8M16 16l11-4M16 16l-3 11" />
      <circle className="mark-node" cx="6" cy="8" r="3" />
      <circle className="mark-node" cx="27" cy="12" r="3" />
      <circle className="mark-node mark-ai" cx="13" cy="27" r="3" />
      <circle className="mark-core" cx="16" cy="16" r="4.5" />
    </svg>
  );
}
