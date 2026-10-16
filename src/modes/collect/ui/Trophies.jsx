import React from "react";
import Panel from "./Panel";
import { CARDS } from "../cards/catalog";
import { TROPHIES } from "../cards/collection";

export default function Trophies({ collection, onClose, onReset }) {
  const earned = TROPHIES.filter((t) => collection.trophies[t.id]).length;
  const owned = Object.keys(collection.owned).length;

  const reset = () => {
    if (window.confirm("Start over? Your album and trophies will be emptied.")) onReset();
  };

  return (
    <Panel title="Trophy case" eyebrow={`${earned} of ${TROPHIES.length} earned`} onClose={onClose} className="is-wide">
      <dl className="stats">
        <div>
          <dt>Cards</dt>
          <dd>
            {owned}/{CARDS.length}
          </dd>
        </div>
        <div>
          <dt>Packs opened</dt>
          <dd>{collection.opened}</dd>
        </div>
        <div>
          <dt>Holo rares</dt>
          <dd>{collection.pulls.holo}</dd>
        </div>
        <div>
          <dt>Legendaries</dt>
          <dd>{collection.pulls.legendary + (collection.owned.hero ? 1 : 0)}</dd>
        </div>
      </dl>
      <ul className="trophies">
        {TROPHIES.map((t) => {
          const when = collection.trophies[t.id];
          return (
            <li key={t.id} className={when ? "is-earned" : ""}>
              <span className="medal" aria-hidden="true">
                {when ? "★" : "?"}
              </span>
              <div>
                <h3>{t.name}</h3>
                <p>{t.text}</p>
                {when && <small>Earned {new Date(when).toLocaleDateString()}</small>}
              </div>
            </li>
          );
        })}
      </ul>
      <p className="panel-foot">
        <button type="button" className="link-btn" onClick={reset}>
          Start the collection over
        </button>
      </p>
    </Panel>
  );
}
