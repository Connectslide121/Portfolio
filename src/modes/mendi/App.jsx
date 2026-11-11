import React from "react";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import { useReveal } from "./components/hooks";
import Hero from "./pages/Hero";
import Story from "./pages/Story";
import Experience from "./pages/Experience";
import Projects from "./pages/Projects";
import Toolkit from "./pages/Toolkit";
import Contact from "./pages/Contact";

/**
 * Mendi (Basque for mountain, the first half of Mendizabal): one long walk
 * through a landscape that starts warm and ends cold, the way the career did.
 */
export default function App() {
  useReveal();
  return (
    <div className="App">
      <a className="skip-link" href="#story">
        Skip to content
      </a>
      <span className="progress" aria-hidden="true" />
      <Nav />
      <main>
        <Hero />
        <Story />
        <Experience />
        <Projects />
        <Toolkit />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
