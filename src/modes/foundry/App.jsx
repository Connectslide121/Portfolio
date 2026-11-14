import React from "react";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import { useReveal } from "./components/hooks";
import Forge from "./pages/Forge";
import Work from "./pages/Work";
import Record from "./pages/Record";
import Tooling from "./pages/Tooling";
import Contact from "./pages/Contact";

/**
 * Foundry: the career as a process sheet. Twelve years casting steel, then a
 * reset, then software; the billet at the top cools through those steps as
 * the page is read and opens into the lattice of what is built now.
 */
export default function App() {
  useReveal();
  return (
    <div className="App">
      <a className="skip-link" href="#process">
        Skip to content
      </a>
      <Nav />
      <main>
        <Forge />
        <Work />
        <Record />
        <Tooling />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
