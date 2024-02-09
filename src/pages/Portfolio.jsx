import React from "react";
import Home from "../components/Home";
import About from "../components/About";
import Projects from "../components/Projects";
import Contact from "../components/Contact";

export default function Portfolio() {
  return (
    <div className="main-container">
      <Home />
      <About />
      <Projects />
      <Contact />
    </div>
  );
}
