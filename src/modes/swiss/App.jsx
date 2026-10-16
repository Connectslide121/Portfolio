import React, { useCallback, useEffect, useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import GridOverlay from "./art/GridOverlay";
import Home from "./pages/Home";
import About from "./pages/About";
import Experience from "./pages/Experience";
import Projects from "./pages/Projects";
import Contact from "./pages/Contact";
import { useReveal } from "./components/hooks";

export default function App() {
  const [gridVisible, setGridVisible] = useState(false);
  const toggleGrid = useCallback(() => setGridVisible((v) => !v), []);

  useReveal();

  // G shows the grid the page is built on — unless someone is typing.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key.toLowerCase() !== "g" || e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.target.closest("input, textarea, select, [contenteditable]")) return;
      toggleGrid();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggleGrid]);

  return (
    <div className="App">
      <a className="skip-link" href="#about">
        Skip to content
      </a>
      <Header />
      <main>
        <Home />
        <About />
        <Experience />
        <Projects />
        <Contact />
      </main>
      <Footer gridVisible={gridVisible} onToggleGrid={toggleGrid} />
      <GridOverlay visible={gridVisible} />
    </div>
  );
}
