import React, { useState } from "react";
import "../styles/home.css";
import Composition from "../art/Composition";
import Ticker from "../components/Ticker";
import { profile } from "../data/journey";
import { scrollToSection } from "../components/hooks";

// 121 for Connectslide121. Every press after that draws a new poster.
const FIRST_SEED = 121;

export default function Home() {
  const [seed, setSeed] = useState(FIRST_SEED);
  const [first, ...rest] = profile.name.split(" ");

  const recompose = () => setSeed(Math.floor(100 + Math.random() * 9900));

  return (
    <section id="home" className="home">
      <div className="wrap home-grid">
        <div className="home-meta" data-reveal>
          <p>Portfolio</p>
          <p>Växjö, Sweden</p>
          <p className="muted">56°53′N 14°49′E</p>
        </div>

        <div className="home-copy" data-reveal>
          <p className="home-title">{profile.title}</p>
          <p className="home-lede">{profile.lede}</p>
          <p className="home-blurb">{profile.blurb}</p>
          <div className="home-cta">
            <button type="button" className="btn btn-solid" onClick={() => scrollToSection("projects")}>
              View my work <span aria-hidden="true">→</span>
            </button>
            <button type="button" className="btn" onClick={() => scrollToSection("contact")}>
              Get in touch <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>

        <figure className="home-art" data-reveal>
          <button
            type="button"
            className="home-art-btn"
            onClick={recompose}
            aria-label="Draw a new composition"
          >
            <Composition seed={seed} />
          </button>
          <figcaption>
            <span>Komposition Nr. {seed}</span>
            <button type="button" className="link-btn" onClick={recompose}>
              Recompose ↻
            </button>
          </figcaption>
        </figure>

        <h1 className="home-name" aria-label={profile.name}>
          <span className="home-name-first" aria-hidden="true">
            {first}
          </span>
          <span className="home-name-last" aria-hidden="true">
            {rest.join(" ")}
            <span className="home-name-dot" />
          </span>
        </h1>
      </div>
      <Ticker />
    </section>
  );
}
