import React, { useEffect, useRef } from "react";
import { ScrollTrigger } from "./motion";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import Stage from "./scene/Stage";
import Hero from "./pages/Hero";
import Layers from "./pages/Layers";
import Pipeline from "./pages/Pipeline";
import Products from "./pages/Products";
import Lead from "./pages/Lead";
import Builds from "./pages/Builds";
import Stack from "./pages/Stack";
import Record from "./pages/Record";
import Contact from "./pages/Contact";

/**
 * Core: Jon as he works now. A live system of the platforms he leads opens
 * the page and opens up into its layers; GSAP carries the rest of the story.
 */
export default function App() {
  // Shared by the stage and the sections that drive it. Without motion it
  // stays at the assembled, closed system.
  const state = useRef({ assemble: 0, explode: 0, focus: -1 }).current;

  // The web fonts change line lengths when they arrive: measure again then.
  useEffect(() => {
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
  }, []);

  return (
    <div className="App">
      <a className="skip-link" href="#system">
        Skip to content
      </a>
      <Nav />
      <main>
        <Stage state={state}>
          <Hero />
          <Layers state={state} />
        </Stage>
        <Pipeline />
        <Products />
        <Lead />
        <Builds />
        <Stack />
        <Record />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
