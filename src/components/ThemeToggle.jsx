import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";

export default function ThemeToggle() {
  const [isLightTheme, setIsLightTheme] = useState(
    () => !document.body.classList.contains("dark-theme")
  );

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
  };

  return (
    <div className="theme-toggle-wrapper">
      <input
        type="checkbox"
        id="darkmode-toggle"
        aria-label="Use light theme"
        checked={isLightTheme}
        onChange={handleToggle}
      />
      <label htmlFor="darkmode-toggle" className="darkmode-toggle-label">
        <FontAwesomeIcon icon={faSun} className="sun" />
        <FontAwesomeIcon icon={faMoon} className="moon" />
      </label>
    </div>
  );
}
