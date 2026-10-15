import React, { useState } from "react";

/**
 * Light / Dark, as words. The theme is the `dark-theme` class on <body>,
 * remembered under the same storage key as before.
 */
export default function ThemeToggle() {
  const [dark, setDark] = useState(() =>
    document.body.classList.contains("dark-theme"),
  );

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
    <div className="theme-toggle" role="group" aria-label="Colour theme">
      <button type="button" aria-pressed={!dark} onClick={() => set(false)}>
        Light
      </button>
      <span aria-hidden="true">/</span>
      <button type="button" aria-pressed={dark} onClick={() => set(true)}>
        Dark
      </button>
    </div>
  );
}
