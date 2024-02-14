import React from "react";
import "../styles/about.css";
import Tools from "../components/Tools";
import Education from "../components/Education";
import Experience from "../components/Experience";

export default function About() {
  return (
    <section id="about">
      <Tools />
      <Education />
      <Experience />
    </section>
  );
}
