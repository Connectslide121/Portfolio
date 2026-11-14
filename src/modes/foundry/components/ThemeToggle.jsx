import React, { useState } from "react";

/** Day or night. The choice is shared by every mode (jm-theme). */
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
    <button
      type="button"
      className="icon-btn theme-toggle"
      onClick={toggle}
      aria-pressed={dark}
      aria-label={dark ? "Switch to day (light theme)" : "Switch to night (dark theme)"}
      title={dark ? "Day" : "Night"}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        {dark ? (
          <path d="M20.4 14.6A8.6 8.6 0 0 1 9.4 3.6a8.6 8.6 0 1 0 11 11z" />
        ) : (
          <>
            <circle cx="12" cy="12" r="4.2" />
            <path d="M12 2.5v2.6M12 18.9v2.6M2.5 12h2.6M18.9 12h2.6M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M5.3 18.7l1.8-1.8M16.9 7.1l1.8-1.8" />
          </>
        )}
      </svg>
    </button>
  );
}
