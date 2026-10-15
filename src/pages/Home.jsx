import React from "react";
import "../styles/home.css";
import Orrery from "../art/Orrery";
import { profile } from "../data/journey";
import { scrollToSection } from "../components/hooks";

export default function Home() {
  const [first, ...rest] = profile.name.split(" ");
  return (
    <section id="home" className="hero">
      <div className="hero-text">
        <p className="eyebrow">Portfolio · Växjö, Sweden · 56.88° N 14.81° E</p>
        <h1>
          <span>{first}</span>
          <em>{rest.join(" ")}</em>
        </h1>
        <p className="hero-title">{profile.title}</p>
        <p className="hero-lede">{profile.lede}</p>
        <p className="hero-blurb">{profile.blurb}</p>
        <div className="hero-cta">
          <button type="button" className="btn btn-glow" onClick={() => scrollToSection("catalogue")}>
            View my work
          </button>
          <button type="button" className="btn" onClick={() => scrollToSection("signal")}>
            Get in touch
          </button>
        </div>
      </div>
      <div className="hero-art">
        <Orrery />
        <p className="caption">The featured work, in orbit. Click a planet.</p>
      </div>
    </section>
  );
}
