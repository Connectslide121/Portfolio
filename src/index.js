import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/styles.css";
import "./styles/os.css";
import "./styles/apps.css";
import App from "./App";

// Standard (light) is the default display scheme; Night (dark) is the
// `dark-theme` class, set only from an explicit stored choice.
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
