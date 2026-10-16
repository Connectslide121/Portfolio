import React from "react";
import Pack from "./Pack";
import Card from "../components/Card";
import { CardBack } from "../cards/art";
import { CARDS, RARITY, SETS, cardsOf } from "../cards/catalog";
import { ownedIn, packsLeft } from "../cards/collection";
import { profile } from "../data/journey";

/** The three best cards you own, for the fan on the table. */
const bestOwned = (owned) =>
  CARDS.filter((c) => owned[c.id])
    .sort((a, b) => RARITY[b.rarity].rank - RARITY[a.rarity].rank)
    .slice(0, 3);

export default function Shelf({ owned, onOpen, onOpenAll, onAlbum, onInspect, onCv }) {
  const total = Object.keys(owned).length;
  const fan = bestOwned(owned);
  const left = SETS.reduce((n, s) => n + packsLeft(s.id, owned), 0);

  return (
    <main className="shelf">
      <section className="intro">
        <div className="intro-copy">
          <p className="eyebrow">First edition · 2005 — today</p>
          <h1>
            {profile.name}
            <span>The Career Trading Card Game</span>
          </h1>
          <p className="intro-lede">{profile.lede}</p>
          <p>
            {CARDS.length} cards in three sets — every role, degree, project and tool from the CV. Rip open the boosters,
            pull the holo rares and fill the album.
          </p>
          <div className="intro-actions">
            {left > 0 ? (
              <button type="button" className="btn btn-gold" onClick={() => onOpen(total ? SETS.find((s) => packsLeft(s.id, owned))?.id : "career")}>
                {total ? "Open the next pack" : "Open your first pack"}
              </button>
            ) : (
              <button type="button" className="btn btn-gold" onClick={() => onAlbum("career")}>
                See the full album
              </button>
            )}
            <button type="button" className="btn" onClick={onCv}>
              No time? Read it as a CV
            </button>
          </div>
        </div>
        <div className={`fan${fan.length ? " has-cards" : ""}`}>
          {fan.length
            ? fan.map((c) => <Card key={c.id} card={c} onOpen={onInspect} />)
            : [0, 1, 2].map((i) => (
                <span key={i} className="card">
                  <span className="card-back">
                    <CardBack />
                  </span>
                </span>
              ))}
        </div>
      </section>

      <section className="boosters" aria-label="Boosters">
        {SETS.map((set) => {
          const have = ownedIn(set.id, owned);
          const of = cardsOf(set.id).length;
          const packs = packsLeft(set.id, owned);
          return (
            <article key={set.id} className={`booster${packs ? "" : " is-complete"}`}>
              <button type="button" className="booster-pack" onClick={() => (packs ? onOpen(set.id) : onAlbum(set.id))} aria-label={packs ? `Open a ${set.name} booster` : `${set.name} set complete — view it in the album`}>
                {packs > 1 && <span className="pack-behind" aria-hidden="true" />}
                <Pack set={set} />
                {packs === 0 && <span className="booster-stamp">Complete</span>}
              </button>
              <div className="booster-info">
                <h2>{set.name}</h2>
                <p>{set.blurb}</p>
                <progress max={of} value={have} aria-label={`${have} of ${of} collected`} />
                <p className="booster-count">
                  <b>
                    {have}/{of}
                  </b>{" "}
                  collected · {packs ? `${packs} ${packs === 1 ? "pack" : "packs"} left` : "set complete"}
                </p>
                <div className="booster-actions">
                  {packs > 0 && (
                    <button type="button" className="btn btn-gold btn-sm" onClick={() => onOpen(set.id)}>
                      Open a pack
                    </button>
                  )}
                  <button type="button" className="btn btn-sm" onClick={() => onAlbum(set.id)}>
                    Album page
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </section>

      {left > 0 && (
        <p className="shelf-skip">
          In a hurry?{" "}
          <button type="button" className="link-btn" onClick={onOpenAll}>
            Open all {left} packs at once
          </button>{" "}
          and go straight to the album.
        </p>
      )}
    </main>
  );
}
