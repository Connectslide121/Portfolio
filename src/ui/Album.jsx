import React from "react";
import Card, { CardSlot } from "../components/Card";
import { SETS, cardsOf, setById } from "../cards/catalog";
import { ownedIn, packsLeft } from "../cards/collection";

/** A binder page per set: owned cards in their pockets, the rest left empty. */
export default function Album({ setId, owned, onSet, onInspect, onOpen }) {
  const set = setById(setId);
  const cards = cardsOf(setId);
  const have = ownedIn(setId, owned);
  const packs = packsLeft(setId, owned);

  return (
    <main className="album">
      <div className="album-tabs" role="tablist" aria-label="Sets">
        {SETS.map((s) => (
          <button
            key={s.id}
            type="button"
            role="tab"
            aria-selected={s.id === setId}
            className={`album-tab${s.id === setId ? " is-active" : ""}`}
            onClick={() => onSet(s.id)}
          >
            {s.name}
            <small>
              {ownedIn(s.id, owned)}/{cardsOf(s.id).length}
            </small>
          </button>
        ))}
      </div>

      <section className="album-page" role="tabpanel" aria-label={`${set.name} set`}>
        <header className="album-head">
          <div>
            <p className="eyebrow">
              Set {SETS.indexOf(set) + 1} of {SETS.length} · {set.code}
            </p>
            <h1>{set.name}</h1>
            <p>{set.blurb}</p>
          </div>
          <div className="album-progress">
            <progress max={cards.length} value={have} aria-label={`${have} of ${cards.length} collected`} />
            <p>
              <b>
                {have}/{cards.length}
              </b>{" "}
              {have === cards.length ? "· complete ✓" : `· ${packs} ${packs === 1 ? "pack" : "packs"} to go`}
            </p>
            {packs > 0 && (
              <button type="button" className="btn btn-gold btn-sm" onClick={() => onOpen(setId)}>
                Open a {set.name} pack
              </button>
            )}
          </div>
        </header>

        <ol className="album-grid">
          {cards.map((c) => (
            <li key={c.id}>{owned[c.id] ? <Card card={c} onOpen={onInspect} /> : <CardSlot card={c} />}</li>
          ))}
        </ol>
      </section>
    </main>
  );
}
