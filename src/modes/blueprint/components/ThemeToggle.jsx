import React, { useState } from "react";

/**
 * Blueprint or whiteprint: the two ways a drawing comes off the copier.
 * Blueprint is the `dark-theme` class on <body>, remembered as before.
 */
export default function ThemeToggle() {
  const [dark, setDark] = useState(() => document.body.classList.contains("dark-theme"));

  const set = (next) => {
    document.body.classList.toggle("dark-theme", next);
    try {
      window.localStorage.setItem("jm-theme", next ? "dark" : "light");
    } catch {
      /* the preference just will not persist */
    }
    setDark(next);
  };

  return (
    <div className="print-toggle" role="group" aria-label="Print">
      <span className="print-label">Print</span>
      <button type="button" aria-pressed={dark} onClick={() => set(true)} title="Blueprint (dark)">
        Blue
      </button>
      <button type="button" aria-pressed={!dark} onClick={() => set(false)} title="Whiteprint (light)">
        White
      </button>
    </div>
  );
}
