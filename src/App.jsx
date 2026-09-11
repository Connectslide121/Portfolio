import React, { Suspense, lazy, useCallback, useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import About from "./pages/About";
import Projects from "./pages/Projects";
import Contact from "./pages/Contact";
import Footer from "./components/Footer";

// Journey mode is lazy so GSAP and the world SVG never touch first paint for a
// visitor who only wants the CV (guardrail in docs/JOURNEY_PLAN.md §8).
const JourneyStage = lazy(() => import("./journey/JourneyStage"));

// D17: Journey mode is what a first-time visitor lands on. Once someone has
// chosen the CV we remember it, so a return visit does not put the animation
// in front of them again — the hero teaser is always there to go back in.
const CV_PREFERRED = "jm-prefers-cv";

const read = (key) => {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null; // private mode, blocked storage — fall back to the default
  }
};

const write = (key, value) => {
  try {
    value === null
      ? window.localStorage.removeItem(key)
      : window.localStorage.setItem(key, value);
  } catch {
    /* nothing to do — the preference just will not persist */
  }
};

const startInJourney = () => {
  const params = new URLSearchParams(window.location.search);
  const hash = window.location.hash;
  if (params.has("cv") || hash.startsWith("#cv")) return false;
  if (params.has("journey") || hash.startsWith("#journey")) return true;
  return read(CV_PREFERRED) !== "1";
};

export default function App() {
  const [journeyOpen, setJourneyOpen] = useState(startInJourney);

  const closeJourney = useCallback(() => {
    setJourneyOpen(false);
    write(CV_PREFERRED, "1");
    window.history.replaceState(null, "", window.location.pathname);
  }, []);

  const openJourney = useCallback(() => {
    setJourneyOpen(true);
    write(CV_PREFERRED, null);
  }, []);

  // The stage is fixed and full-screen, so the page behind it must not scroll.
  useEffect(() => {
    if (!journeyOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [journeyOpen]);

  // A pasted #journey/... link is a same-document navigation, so React never
  // re-reads it on its own. Without this, sharing a beat link with someone who
  // already has the page open does nothing.
  useEffect(() => {
    const onHash = () => {
      const hash = window.location.hash;
      if (hash.startsWith("#journey")) setJourneyOpen(true);
      else if (hash.startsWith("#cv")) setJourneyOpen(false);
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  useEffect(() => {
    if (!journeyOpen) return;
    const onKey = (e) => e.key === "Escape" && closeJourney();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [journeyOpen, closeJourney]);

  return (
    <div className="App">
      <Navbar />
      <div>
        <Sidebar />
        <main className="main-container">
          <Home onEnterJourney={openJourney} />
          <About />
          <Projects />
          <Contact />
        </main>
        <Footer />
      </div>

      {/* The journey chunk is lazy, and a null fallback meant the static page
          painted first and then got covered — it read as landing on the wrong
          page. The curtain paints in the same commit as the page behind it, so
          there is nothing to see underneath while the chunk arrives. */}
      {journeyOpen && (
        <Suspense fallback={<div className="j-curtain" aria-hidden="true" />}>
          <JourneyStage onExit={closeJourney} />
        </Suspense>
      )}
    </div>
  );
}
