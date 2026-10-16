import React from "react";
import "../styles/home.css";
import StickerBoard from "../art/StickerBoard";
import Marquee from "../components/Marquee";
import { profile } from "../../../data/journey";
import { scrollToSection } from "../components/hooks";

export default function Home() {
  const [first, ...rest] = profile.name.split(" ");
  return (
    <section id="home" className="hero">
      <StickerBoard />
      <div className="hero-card">
        <p className="hand">hi, I'm</p>
        <h1>
          <span className="name-1">{first}</span>
          <span className="name-2">{rest.join(" ")}</span>
        </h1>
        <p className="hero-title">
          <span className="tag bg-pink">{profile.title}</span>
          <span className="tag bg-white">Växjö, Sweden</span>
        </p>
        <p className="hero-lede">{profile.lede}</p>
        <p className="hero-blurb">{profile.blurb}</p>
        <div className="hero-cta">
          <button type="button" className="chunky bg-yellow" onClick={() => scrollToSection("projects")}>
            View my work →
          </button>
          <button type="button" className="chunky bg-white" onClick={() => scrollToSection("contact")}>
            Get in touch
          </button>
        </div>
        <p className="hand hand-hint" aria-hidden="true">
          ↖ psst, the stickers peel off
        </p>
      </div>
      <Marquee />
    </section>
  );
}
