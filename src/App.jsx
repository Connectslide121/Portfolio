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

const wantsJourney = () =>
  new URLSearchParams(window.location.search).has("journey") ||
  window.location.hash.startsWith("#journey");

export default function App() {
  const [journeyOpen, setJourneyOpen] = useState(wantsJourney);

  const closeJourney = useCallback(() => {
    setJourneyOpen(false);
    window.history.replaceState(null, "", window.location.pathname);
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
          <Home onEnterJourney={() => setJourneyOpen(true)} />
          <About />
          <Projects />
          <Contact />
        </main>
        <Footer />
      </div>

      {journeyOpen && (
        <Suspense fallback={null}>
          <JourneyStage onExit={closeJourney} />
        </Suspense>
      )}
    </div>
  );
}
