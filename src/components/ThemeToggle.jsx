import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";

export default function ThemeToggle({ id = "darkmode-toggle" }) {
  const [isLightTheme, setIsLightTheme] = useState(
    () => !document.body.classList.contains("dark-theme")
  );

  // Navbar and journey controls can coexist in the DOM. Keep both views of
  // the shared body preference synchronized when either one is used.
  useEffect(() => {
    const sync = (event) => {
      setIsLightTheme(
        event.detail?.isLight ?? !document.body.classList.contains("dark-theme")
      );
    };
    window.addEventListener("jm-theme-change", sync);
    return () => window.removeEventListener("jm-theme-change", sync);
  }, []);

  const handleToggle = (event) => {
    const showLightTheme = event.target.checked;

    if (showLightTheme) {
      document.body.classList.remove("dark-theme");
    } else {
      document.body.classList.add("dark-theme");
    }

    try {
      window.localStorage.setItem("jm-theme", showLightTheme ? "light" : "dark");
    } catch {
      /* the preference just will not persist */
    }

    setIsLightTheme(showLightTheme);
    window.dispatchEvent(
      new CustomEvent("jm-theme-change", { detail: { isLight: showLightTheme } })
    );
  };

  return (
    <div className="theme-toggle-wrapper">
      <input
        type="checkbox"
        id={id}
        className="theme-toggle-input"
        aria-label={isLightTheme ? "Use dark theme" : "Use light theme"}
        checked={isLightTheme}
        onChange={handleToggle}
      />
      <label htmlFor={id} className="darkmode-toggle-label">
        <FontAwesomeIcon icon={faSun} className="sun" />
        <FontAwesomeIcon icon={faMoon} className="moon" />
      </label>
    </div>
  );
}
