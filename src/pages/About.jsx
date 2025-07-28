import React from "react";
import "../styles/about.css";
import Tools from "../components/Tools";
import Education from "../components/Education";
import Experience from "../components/Experience";

export default function About() {
  return (
    <section id="about">
      <div className="about-header">
        <h2>About Me</h2>
        <p>
          I'm a passionate full-stack developer with expertise in modern web
          technologies. I love creating efficient, scalable solutions and
          continuously learning new technologies.
        </p>
      </div>
      <Tools />
      <div className="about-info-wrapper">
        <Experience />
        <Education />
      </div>
    </section>
  );
}
