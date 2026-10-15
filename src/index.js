import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/styles.css";
import App from "./App";

// The drawings come off the copier as blueprints: dark ("blue") is the
// default here, and only an explicit stored "light" asks for the whiteprint.
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
