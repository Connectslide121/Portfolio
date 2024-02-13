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
    <>
      <input type="checkbox" id="darkmode-toggle" onChange={handleToggle} />
      <label htmlFor="darkmode-toggle" className="darkmode-toggle-label">
        <p className="moon">
          <FontAwesomeIcon icon={faMoon} />
        </p>
        <p className="sun">
          <FontAwesomeIcon icon={faSun} />
        </p>
      </label>
    </>
  );
}
