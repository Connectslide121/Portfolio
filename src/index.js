import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/styles.css";
import App from "./App";

// The site is printed on paper: light is the default and public/index.html
// ships a bare <body>. Dark ("ink") is opt-in, so only an explicit stored
// choice adds the class — toggle, never add-if, so a stored "light" also wins
// over anything a cached HTML might still carry.
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
