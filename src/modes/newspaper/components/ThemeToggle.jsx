import React, { useState } from "react";

/** Morning edition (light) or night edition (dark, the `dark-theme` class). */
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
    <div className="edition-toggle" role="group" aria-label="Edition">
      <button type="button" aria-pressed={!dark} onClick={() => set(false)}>
        Morning edition
      </button>
      <button type="button" aria-pressed={dark} onClick={() => set(true)}>
        Night edition
      </button>
    </div>
  );
}
