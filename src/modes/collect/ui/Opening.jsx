import React, { useEffect, useRef, useState } from "react";
import Pack from "./Pack";
import Card from "../components/Card";
import { CardBack } from "../cards/art";
import { RARITY, setById } from "../cards/catalog";

const CALL = { rare: "Rare!", holo: "Holo rare!", legendary: "Legendary!" };

/**
 * Opening a booster. Tear the pack (tap it, or swipe across the top), then
 * turn the cards over one by one. Rare cards glow through their backs.
 */
export default function Opening({ setId, cards, packNo, packsLeft, onTear, onClose, onAnother, onInspect }) {
  const set = setById(setId);
  const [phase, setPhase] = useState("sealed"); // sealed -> torn -> reveal
  const [flipped, setFlipped] = useState([]);
  const drag = useRef(null);
  const root = useRef(null);
  const torn = phase !== "sealed";
  const done = phase === "reveal" && flipped.length === cards.length;

  useEffect(() => {
    root.current?.querySelector(".pack-button")?.focus();
  }, []);

  useEffect(() => {
    // Escape closes the card being looked at first, not the whole opening.
    const onKey = (e) => e.key === "Escape" && !document.querySelector(".inspect") && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    if (phase !== "torn") return undefined;
    const t = setTimeout(() => {
      setPhase("reveal");
      requestAnimationFrame(() => root.current?.querySelector(".flip")?.focus());
    }, 700);
    return () => clearTimeout(t);
  }, [phase]);

  const tear = () => {
    if (torn) return;
    setPhase("torn");
    onTear();
  };

  const flip = (i) => {
    setFlipped((f) => (f.includes(i) ? f : [...f, i]));
    // The turned card stops being a button; hand focus to the next one.
    requestAnimationFrame(() => (root.current?.querySelector(".flip") || root.current?.querySelector(".opening-actions .btn"))?.focus());
  };
  const flipAll = () => setFlipped(cards.map((_, i) => i));

  // Swipe across the pack to tear it, like the real thing.
  const down = (e) => {
    drag.current = e.clientX;
  };
  const move = (e) => {
    if (drag.current !== null && Math.abs(e.clientX - drag.current) > 70) {
      drag.current = null;
      tear();
    }
  };

  const best = cards.reduce((m, c) => Math.max(m, RARITY[c.rarity].rank), 0);

  return (
    <div ref={root} className={`opening count-${cards.length}`} role="dialog" aria-modal="true" aria-label={`${set.name} booster`}>
      <header className="opening-head">
        <p className="eyebrow">
          {set.name} booster · pack {packNo}
        </p>
        <h2>{phase === "sealed" ? "Tear it open" : done ? "Nice pulls." : "Turn them over"}</h2>
        <button type="button" className="btn btn-sm opening-x" onClick={onClose}>
          {torn ? "Done" : "Not now"}
        </button>
      </header>

      {phase !== "reveal" ? (
        <div className="opening-stage">
          <button
            type="button"
            className={`pack-button${best >= 3 ? " is-charged" : ""}`}
            onClick={tear}
            onPointerDown={down}
            onPointerMove={move}
            onPointerUp={() => {
              drag.current = null;
            }}
            aria-label={`Tear open the ${set.name} booster`}
          >
            <Pack set={set} torn={torn} />
            <span className="tear-line" aria-hidden="true" />
          </button>
          <p className="opening-hint">{torn ? "…" : "Tap the pack, or swipe across it"}</p>
        </div>
      ) : (
        <>
          <ol className="spread">
            {cards.map((card, i) => {
              const up = flipped.includes(i);
              const rank = RARITY[card.rarity].rank;
              return (
                <li key={card.id} className={`spread-slot${up ? " is-up" : ""} glow-${card.rarity}`}>
                  {up && rank >= 2 && (
                    <span className={`burst burst-${card.rarity}`} aria-hidden="true">
                      <span className="burst-rays" />
                      <span className="burst-call">{CALL[card.rarity]}</span>
                    </span>
                  )}
                  {up ? (
                    <Card card={card} onOpen={onInspect} isNew />
                  ) : (
                    <button type="button" className="flip" onClick={() => flip(i)} aria-label={`Turn over card ${i + 1} of ${cards.length}`}>
                      <span className="card">
                        <span className="card-back">
                          <CardBack />
                        </span>
                      </span>
                    </button>
                  )}
                </li>
              );
            })}
          </ol>
          <div className="opening-actions">
            {!done && (
              <button type="button" className="btn" onClick={flipAll}>
                Turn them all over
              </button>
            )}
            {done && (
              <>
                <button type="button" className="btn btn-gold" onClick={onClose}>
                  Into the album
                </button>
                {packsLeft > 0 && (
                  <button type="button" className="btn" onClick={onAnother}>
                    Open another {set.name} pack ({packsLeft} left)
                  </button>
                )}
              </>
            )}
          </div>
          {done && <p className="opening-hint">Tap a card to look at it closely.</p>}
        </>
      )}
    </div>
  );
}
