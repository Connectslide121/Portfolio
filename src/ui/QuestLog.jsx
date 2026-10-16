import React, { useState } from "react";
import Panel from "./Panel";
import { experience, education } from "../data/journey";
import { BUILDINGS } from "../game/map";

// Which building tells each quest's story.
const WHERE = {
  "exp-sprinta-lead": "sprinta",
  "exp-sprinta-ai": "sprinta",
  "exp-aml": "foundry",
  "edu-lexicon": "lexicon",
  "edu-leartik": "lea",
  "edu-polymers": "uni",
};

export default function QuestLog({ visited, onClose, onTravel }) {
  const all = [...experience, ...education];
  const [sel, setSel] = useState(all[0].id);
  const e = all.find((x) => x.id === sel);
  const b = BUILDINGS.find((x) => x.id === WHERE[e.id]);

  return (
    <Panel title="Quest log" onClose={onClose} wide>
      <div className="quests">
        <ul className="quest-list">
          {all.map((x) => (
            <li key={x.id}>
              <button type="button" className={sel === x.id ? "is-sel" : ""} onClick={() => setSel(x.id)}>
                <span className={`q-state${visited.includes(WHERE[x.id]) ? " is-seen" : ""}`} aria-hidden="true">
                  {x.quest?.status === "In progress" ? "!" : visited.includes(WHERE[x.id]) ? "✓" : "?"}
                </span>
                <span>
                  “{x.quest?.name || x.title}”<small>{x.dateLabel}</small>
                </span>
              </button>
            </li>
          ))}
        </ul>
        <article className="quest-detail">
          <p className="q-status">{e.quest?.status}</p>
          <h3>“{e.quest?.name}”</h3>
          <p className="q-role">
            {e.title} · {e.org}
          </p>
          <dl>
            <dt>Constraint</dt>
            <dd>{e.quest?.constraint}</dd>
            <dt>Objective</dt>
            <dd>{e.quest?.objective}</dd>
            <dt>Rewards</dt>
            <dd>{e.tech.join(", ")}</dd>
          </dl>
          {b && (
            <button type="button" className="rpg-btn" onClick={() => onTravel(b)}>
              Fast travel to {b.name} ▸
            </button>
          )}
        </article>
      </div>
    </Panel>
  );
}
