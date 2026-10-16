import React from "react";
import Sky from "./art/Sky";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Acts from "./pages/Acts";
import Atlas from "./pages/Atlas";
import Path from "./pages/Path";
import Catalogue from "./pages/Catalogue";
import Signal from "./pages/Signal";

export default function App() {
  return (
    <div className="App">
      <Sky />
      <a className="skip-link" href="#acts">
        Skip to content
      </a>
      <Nav />
      <main>
        <Home />
        <Acts />
        <Atlas />
        <Path />
        <Catalogue />
        <Signal />
      </main>
      <Footer />
    </div>
  );
}
