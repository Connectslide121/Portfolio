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
          I'm a passionate full-stack developer specializing in AI-powered
          solutions and modern web technologies. With expertise in OpenAI APIs,
          vector databases, embedding models, and LLMs, I create intelligent,
          scalable applications that leverage the power of artificial
          intelligence. I love building efficient solutions and continuously
          exploring new AI technologies.
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
