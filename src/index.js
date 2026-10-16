import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/styles.css";
import "./styles/run.css";
import "./styles/panels.css";
import "./styles/cv.css";
import App from "./App";

// Day (light) is the default; night (dark) only from an explicit choice.
try {
  const prefersDark = window.localStorage.getItem("jm-theme") === "dark";
  document.body.classList.toggle("dark-theme", prefersDark);
} catch {
  /* blocked storage — keep whatever default the HTML set */
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
