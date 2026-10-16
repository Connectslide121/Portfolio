import React from "react";
import { STAGES } from "../run/level";

export default function Hud({ hearts, skills, totalSkills, coins, totalCoins, bugs, progress, year, onOpen, dark, onTheme, onCv }) {
  return (
    <header className="hud">
      <div className="hud-stats">
        <p className="hearts" aria-label={`${hearts} of 3 hearts`}>
          {[0, 1, 2].map((i) => (
            <span key={i} className={i < hearts ? "heart" : "heart is-empty"} aria-hidden="true">
              ♥
            </span>
          ))}
        </p>
        <p>
          <span className="ico ico-q" aria-hidden="true">
            ?
          </span>
          {skills}/{totalSkills} <small>skills</small>
        </p>
        <p>
          <span className="ico ico-c" aria-hidden="true" />
          {coins}/{totalCoins} <small>projects</small>
        </p>
        <p>
          <span className="ico ico-b" aria-hidden="true" />
          {bugs} <small>bugs fixed</small>
        </p>
      </div>

      <div className="timeline" aria-label={`Progress: ${year}`}>
        <span className="tl-label">2005</span>
        <div className="tl-track">
          {STAGES.filter((s) => !s.quiet).map((s) => (
            <i key={s.id} className={`tl-${s.zone}`} />
          ))}
          <span className="tl-you" style={{ left: `${progress * 100}%` }}>
            {year}
          </span>
        </div>
        <span className="tl-label">Today</span>
      </div>

      <nav className="hud-menu" aria-label="Menu">
        <button type="button" className="nes-btn" onClick={() => onOpen("stages")}>
          Stages
        </button>
        <button type="button" className="nes-btn" onClick={() => onOpen("collection")}>
          Collection
        </button>
        <button type="button" className="nes-btn" onClick={onTheme} aria-pressed={dark}>
          {dark ? "☾" : "☀"}
        </button>
        <button type="button" className="nes-btn is-gold" onClick={onCv}>
          Read as CV
        </button>
      </nav>
    </header>
  );
}
