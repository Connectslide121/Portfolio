import React, { Suspense, lazy } from "react";
import ReactDOM from "react-dom/client";
import "./picker/switch.css";
import ModeSwitch from "./picker/ModeSwitch";
import { currentModeId, fontsHref, modeById } from "./modes/registry";

// One address, nine sites: ?mode=<id> loads that design and nothing else, so
// its global styles have the page to themselves. No mode, the picker.
const mode = modeById(currentModeId());

// Light and dark are shared by every mode (jm-theme). Without a stored
// choice each design keeps its own default: the night designs start dark.
try {
  const stored = window.localStorage.getItem("jm-theme");
  document.body.classList.toggle("dark-theme", stored ? stored === "dark" : Boolean(mode?.darkByDefault));
} catch {
  document.body.classList.toggle("dark-theme", Boolean(mode?.darkByDefault));
}

if (mode) {
  const fonts = document.createElement("link");
  fonts.rel = "stylesheet";
  fonts.href = fontsHref(mode);
  document.head.appendChild(fonts);
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", mode.themeColor);
  document.querySelector('link[rel="icon"][type="image/svg+xml"]')?.setAttribute("href", `${process.env.PUBLIC_URL}/modes/${mode.id}/favicon.svg`);
  document.documentElement.dataset.mode = mode.id;
  try {
    window.localStorage.setItem("jm-mode", mode.id);
  } catch {
    /* the picker just won't offer "back to" */
  }
}

const Picker = lazy(() => import("./picker/Picker"));
const Mode = mode && lazy(mode.load);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Suspense fallback={null}>
      {mode ? (
        <>
          <Mode />
          <ModeSwitch mode={mode} />
        </>
      ) : (
        <Picker />
      )}
    </Suspense>
  </React.StrictMode>
);
