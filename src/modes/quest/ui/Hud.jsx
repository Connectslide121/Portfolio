import React from "react";
import { XP_PER_LEVEL } from "../game/progress";
import { profile } from "../../../data/journey";

export default function Hud({ progress, place, onOpen, dark, onTheme, onCv }) {
  return (
    <header className="hud">
      <div className="hud-player window">
        <p className="hud-name">
          {profile.name.split(" ")[0].toUpperCase()} <span>LV {progress.level}</span>
        </p>
        <div className="xp" role="meter" aria-label="Experience points" aria-valuemin={0} aria-valuemax={XP_PER_LEVEL} aria-valuenow={progress.into}>
          <span style={{ width: `${(progress.into / XP_PER_LEVEL) * 100}%` }} />
        </div>
        <p className="hud-place">{place}</p>
      </div>
      <nav className="hud-menu window" aria-label="Menu">
        <button type="button" onClick={() => onOpen("quests")}>
          <kbd>Q</kbd> Quests
        </button>
        <button type="button" onClick={() => onOpen("bag")}>
          <kbd>I</kbd> Bag
        </button>
        <button type="button" onClick={() => onOpen("map")}>
          <kbd>M</kbd> Map
        </button>
        <button type="button" onClick={() => onOpen("trophies")}>
          <kbd>T</kbd> Trophies
        </button>
        <button type="button" onClick={onTheme} aria-pressed={dark}>
          {dark ? "☾ Night" : "☀ Day"}
        </button>
        <button type="button" className="hud-cv" onClick={onCv}>
          Read as CV
        </button>
      </nav>
    </header>
  );
}
