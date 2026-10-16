import React from "react";
import Panel from "./Panel";
import { ACHIEVEMENTS } from "../game/progress";

export default function Trophies({ unlocked, xp, onClose, onReset }) {
  return (
    <Panel title={`Trophies · ${unlocked.length}/${ACHIEVEMENTS.length}`} onClose={onClose}>
      <ul className="trophies">
        {ACHIEVEMENTS.map((a) => {
          const got = unlocked.includes(a.id);
          return (
            <li key={a.id} className={got ? "is-got" : ""}>
              <span className="trophy" aria-hidden="true">
                {got ? "🏆" : "🔒"}
              </span>
              <span>
                <b>{got ? a.name : "???"}</b>
                <small>{a.how}</small>
              </span>
            </li>
          );
        })}
      </ul>
      <p className="panel-note">
        {xp} XP so far.{" "}
        <button type="button" className="link-btn" onClick={onReset}>
          Start a new game
        </button>
      </p>
    </Panel>
  );
}
