import React, { useState } from "react";

/**
 * Night sky (dark, the default here) or star atlas (light). The sky canvas
 * listens for the change event when it is drawing still frames.
 */
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
    window.dispatchEvent(new CustomEvent("jm-theme-change", { detail: { isLight: !next } }));
  };

  return (
    <button type="button" className="theme-toggle" onClick={toggle} aria-label={dark ? "Show the star atlas (light theme)" : "Show the night sky (dark theme)"}>
      <span className={`moon${dark ? "" : " is-full"}`} aria-hidden="true" />
      {dark ? "Night sky" : "Star atlas"}
    </button>
  );
}
