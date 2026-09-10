import React from "react";
import "../styles/home.css";
import home from "../images/home-image.webp";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import HeroTeaser from "../journey/HeroTeaser";

export default function Home({ onEnterJourney }) {
  const NAVBAR_HEIGHT = 80; // Fixed navbar height

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const elementPosition = element.offsetTop;
      const offsetPosition = elementPosition - NAVBAR_HEIGHT;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
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
        <h2>Lead Developer &amp; Platform Architect</h2>
        <p className="home-description">
          Building products end to end — thoughtful, intuitive UI/UX on the
          front, scalable and secure backends underneath. I architect systems
          that are a pleasure to use, robust at scale, and built to grow,
          bringing AI in where it genuinely adds value.
        </p>
        <div className="home-cta">
          <button className="btn" onClick={scrollToProjects}>
            View My Work
          </button>
          <button className="btn btn-secondary" onClick={scrollToContact}>
            Get In Touch
          </button>
        </div>
        <HeroTeaser onEnter={onEnterJourney} />
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
