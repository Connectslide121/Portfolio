import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/styles.css";
import App from "./App";

// public/index.html ships <body class="dark-theme">, so dark is the default and
// there is no flash of light on load. This only has to honour an explicit
// choice — which means REMOVING the class when light is preferred. Adding it
// conditionally is not enough: the class is already there, so a stored "light"
// never took effect on reload.
try {
  const prefersLight = window.localStorage.getItem("jm-theme") === "light";
  document.body.classList.toggle("dark-theme", !prefersLight);
} catch {
  /* blocked storage — keep whatever default the HTML set */
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
