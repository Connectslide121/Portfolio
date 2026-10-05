import React from "react";
import "../styles/home.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";
import HeroTeaser from "../journey/HeroTeaser";
import IntroArt from "../journey/IntroArt";
import Wobble from "../components/Wobble";
import HeroDestroy from "../destroy/HeroDestroy";
import { profile } from "../data/journey";

export default function Home({ onEnterJourney }) {
  const NAVBAR_HEIGHT = 80; // Fixed navbar height

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - NAVBAR_HEIGHT,
        behavior: "smooth",
      });
    }
  };

  const [first, ...rest] = profile.name.split(" ");

  return (
    <section id="home">
      <div className="home-text-wrapper">
        <p className="eyebrow">Portfolio · Växjö, Sweden</p>
        <h1>
          {first} <Wobble>{rest.join(" ")}</Wobble>
        </h1>
        <h2>{profile.title}</h2>
        <p className="home-lede">{profile.lede}</p>
        <p className="home-description">{profile.blurb}</p>
        <div className="home-cta">
          <button className="btn" onClick={() => scrollToSection("projects")}>
            View my work
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => scrollToSection("contact")}
          >
            Get in touch
          </button>
          <HeroDestroy />
        </div>
        <HeroTeaser onEnter={onEnterJourney} />
      </div>

      {/* The same opening print as the journey's landing beat, so both
          modes open on one image: steel poured in Spain, cast as a developer
          in Sweden. */}
      <div className="home-art">
        <IntroArt className="home-art-svg" />
      </div>

      <div className="discover-more-wrapper">
        <button
          className="discover-more-btn"
          onClick={() => scrollToSection("about")}
        >
          <span>Discover more</span>
          <FontAwesomeIcon icon={faArrowDown} className="discover-arrow" />
        </button>
      </div>
    </section>
  );
}
