import React from "react";
import "../styles/home.css";
import home from "../images/home-image.webp";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

export default function Home() {
  const NAVBAR_HEIGHT = 80; // Fixed navbar height

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const elementPosition = element.offsetTop;
      const offsetPosition = elementPosition - NAVBAR_HEIGHT;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  const scrollToProjects = () => {
    scrollToSection("projects");
  };

  const scrollToContact = () => {
    scrollToSection("contact");
  };

  const scrollToAbout = () => {
    scrollToSection("about");
  };

  return (
    <section id="home">
      <div className="home-text-wrapper">
        <h1>
          JON
          <br />
          MENDIZABAL
        </h1>
        <h2>AI DEVELOPER & FULL-STACK ENGINEER</h2>
        <p className="home-description">
          Passionate about creating intelligent digital experiences with AI and
          modern technologies. I specialize in building AI-powered applications,
          working with OpenAI, Google Gemini, Anthropic Claude, vector
          databases, embedding models, and LLMs to solve complex problems with
          innovative solutions.
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

      {/* Discover More Button */}
      <div className="discover-more-wrapper">
        <button className="discover-more-btn" onClick={scrollToAbout}>
          <span>Discover more</span>
          <FontAwesomeIcon icon={faChevronDown} className="discover-arrow" />
        </button>
      </div>
    </section>
  );
}
