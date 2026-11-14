import React from "react";

/** The mark: a billet in three blocks, the first still hot. */
export default function Mark() {
  return (
    <svg className="mark" viewBox="0 0 32 32" aria-hidden="true">
      <rect x="3" y="9" width="8" height="14" rx="1.6" className="mark-hot" />
      <rect x="12.5" y="9" width="8" height="14" rx="1.6" />
      <rect x="22" y="9" width="7" height="14" rx="1.6" />
    </svg>
  );
}
