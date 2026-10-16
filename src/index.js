import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/styles.css";
import "./styles/card.css";
import "./styles/table.css";
import "./styles/panels.css";
import "./styles/cv.css";
import App from "./App";

// The light table is the default; the night table only from an explicit choice.
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
