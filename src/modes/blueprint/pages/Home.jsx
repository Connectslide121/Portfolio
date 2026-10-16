import React from "react";
import "../styles/home.css";
import Sheet from "../components/Sheet";
import IsoStack from "../art/IsoStack";
import RevCloud from "../art/RevCloud";
import { profile, experience } from "../../../data/journey";
import { scrollToSection } from "../components/hooks";

const since = experience[0].dateLabel.split(/\s*-\s*/)[0];

export default function Home() {
  return (
    <Sheet id="home" kicker="General arrangement · Portfolio · Växjö, Sweden" scale="1 : 1">
      <div className="cover">
        <div className="cover-text" data-reveal>
          <h1 className="cover-name">{profile.name}</h1>
          <p className="cover-title">
            <RevCloud tag={`△ ${since}`}>{profile.title}</RevCloud>
          </p>

          <div className="general-note">
            <p className="note-label">Note 1</p>
            <p className="cover-lede">{profile.lede}</p>
          </div>

          <p className="cover-blurb">{profile.blurb}</p>

          <div className="cover-cta">
            <button type="button" className="draft-btn draft-btn-solid" onClick={() => scrollToSection("projects")}>
              View my work <span aria-hidden="true">→</span>
            </button>
            <button type="button" className="draft-btn" onClick={() => scrollToSection("contact")}>
              Get in touch <span aria-hidden="true">→</span>
            </button>
          </div>

          <p className="cover-coords">
            <span>56.88° N</span>
            <span>14.81° E</span>
            <span>Växjö, Sweden</span>
          </p>
        </div>

        <div className="cover-art" data-reveal>
          <IsoStack />
        </div>
      </div>
    </Sheet>
  );
}
