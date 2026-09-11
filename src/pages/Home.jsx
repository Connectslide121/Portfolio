import React from "react";
import "../styles/home.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import HeroTeaser from "../journey/HeroTeaser";
import HeroPanorama from "../components/HeroPanorama";
import { profile } from "../data/journey";

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
          {profile.name.split(" ").map((word, i) => (
            <React.Fragment key={word}>
              {i > 0 && <br />}
              {word.toUpperCase()}
            </React.Fragment>
          ))}
        </h1>
        <h2>{profile.title}</h2>
        <p className="home-description">{profile.blurb}</p>
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
        <HeroPanorama />
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
