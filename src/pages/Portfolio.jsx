import React from "react";
import Home from "./Home";
import About from "./About";
import Projects from "./Projects";
import Contact from "./Contact";

export default function Portfolio() {
  return (
    <main className="main-container">
      <Home />
      <Projects />
      <About />
      <Contact />
    </main>
  );
}
