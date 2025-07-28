import React from "react";
import "../styles/home.css";
import home from "../images/home-image.webp";

export default function Home() {
  const scrollToProjects = () => {
    document.getElementById("projects").scrollIntoView({ behavior: "smooth" });
  };

  const scrollToContact = () => {
    document.getElementById("contact").scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="home">
      <div className="home-text-wrapper">
        <h1>
          JON
          <br />
          MENDIZABAL
        </h1>
        <h2>FULL-STACK DEVELOPER</h2>
        <p className="home-description">
          Passionate about creating exceptional digital experiences with modern
          technologies. I build scalable web applications and solve complex
          problems with clean, efficient code.
        </p>
        <div className="home-cta">
          <button className="btn" onClick={scrollToProjects}>
            View My Work
          </button>
          <button className="btn btn-secondary" onClick={scrollToContact}>
            Get In Touch
          </button>
        </div>
      </div>
      <div className="home-image-wrapper">
        <img
          src={home}
          alt="Jon Mendizabal - Full Stack Developer"
          className="home-image"
        />
      </div>
    </section>
  );
}
