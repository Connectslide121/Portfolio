import React, { useState } from "react";

/** A chunky switch: day (light) or night (dark, the `dark-theme` class). */
export default function ThemeToggle() {
  const [dark, setDark] = useState(() => document.body.classList.contains("dark-theme"));

  const toggle = () => {
    const next = !dark;
    document.body.classList.toggle("dark-theme", next);
    try {
      window.localStorage.setItem("jm-theme", next ? "dark" : "light");
    } catch {
      /* the preference just will not persist */
    }
    setDark(next);
  };

  return (
    <button type="button" role="switch" aria-checked={dark} aria-label="Dark theme" className="switch" onClick={toggle}>
      <span className="switch-knob" aria-hidden="true">
        {dark ? "☾" : "☀"}
      </span>
    </button>
  );
}
