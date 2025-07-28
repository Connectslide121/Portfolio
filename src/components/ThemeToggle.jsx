import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";

export default function ThemeToggle() {
  const handleToggle = (event) => {
    if (event.target.checked) {
      document.body.classList.remove("dark-theme");
    } else {
      document.body.classList.add("dark-theme");
    }
  };

  return (
    <div className="theme-toggle-wrapper">
      <input type="checkbox" id="darkmode-toggle" onChange={handleToggle} />
      <label htmlFor="darkmode-toggle" className="darkmode-toggle-label">
        <FontAwesomeIcon icon={faSun} className="sun" />
        <FontAwesomeIcon icon={faMoon} className="moon" />
      </label>
    </div>
  );
}
