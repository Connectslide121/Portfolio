import React, { Suspense, lazy } from "react";
import ReactDOM from "react-dom/client";
import "./styles/styles.css";
import App from "./App";

// Journey prototype is opt-in via ?journey so the live site is untouched, and
// lazy so GSAP + the world SVG never touch first paint for a normal visitor.
const JourneyStage = lazy(() => import("./journey/JourneyStage"));
const isJourney = new URLSearchParams(window.location.search).has("journey");

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    {isJourney ? (
      <Suspense fallback={null}>
        <JourneyStage />
      </Suspense>
    ) : (
      <App />
    )}
  </React.StrictMode>
);
