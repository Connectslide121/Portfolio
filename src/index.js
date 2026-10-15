import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/styles.css";
import App from "./App";

// The night sky is the default here; only an explicit stored "light" asks
// for the star atlas.
try {
  const stored = window.localStorage.getItem("jm-theme");
  document.body.classList.toggle("dark-theme", stored !== "light");
} catch {
  document.body.classList.add("dark-theme");
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
