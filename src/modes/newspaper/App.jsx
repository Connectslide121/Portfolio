import React from "react";
import Masthead from "./components/Masthead";
import Footer from "./components/Footer";
import FrontPage from "./pages/FrontPage";
import Careers from "./pages/Careers";
import Technology from "./pages/Technology";
import Projects from "./pages/Projects";
import Puzzle from "./pages/Puzzle";
import Letters from "./pages/Letters";

export default function App() {
  return (
    <div className="App">
      <a className="skip-link" href="#careers">
        Skip to content
      </a>
      <Masthead />
      <main>
        <FrontPage />
        <Careers />
        <Technology />
        <Projects />
        <Puzzle />
        <Letters />
      </main>
      <Footer />
    </div>
  );
}
