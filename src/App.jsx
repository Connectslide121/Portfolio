import React from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import CursorHUD from "./art/CursorHUD";
import Home from "./pages/Home";
import About from "./pages/About";
import Experience from "./pages/Experience";
import Projects from "./pages/Projects";
import Contact from "./pages/Contact";
import { useReveal } from "./components/hooks";

export default function App() {
  useReveal();

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
      <Footer />
      <CursorHUD />
    </div>
  );
}
