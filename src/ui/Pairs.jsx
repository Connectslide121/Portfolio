import React, { useEffect, useMemo, useRef, useState } from "react";
import Panel from "./Panel";
import { CardFace } from "../components/Card";
import { CardBack } from "../cards/art";
import { CARDS } from "../cards/catalog";

export const PAIRS = 8;

const shuffle = (list) => {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const deal = (owned) =>
  shuffle(
    shuffle(CARDS.filter((c) => owned[c.id]))
      .slice(0, PAIRS)
      .flatMap((c) => [
        { key: `${c.id}-a`, card: c },
        { key: `${c.id}-b`, card: c },
      ]),
  );

/** A memory game with the cards you own: find the eight pairs. */
export default function Pairs({ owned, best, onWin, onClose }) {
  const enough = Object.keys(owned).length >= PAIRS;
  const [round, setRound] = useState(0);
  const deck = useMemo(() => (enough ? deal(owned) : []), [round, enough]); // eslint-disable-line react-hooks/exhaustive-deps
  const [up, setUp] = useState([]);
  const [found, setFound] = useState([]);
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const started = useRef(null);
  const won = enough && found.length === PAIRS;

  useEffect(() => {
    if (won || !started.current) return undefined;
    const t = setInterval(() => setSeconds(Math.round((Date.now() - started.current) / 1000)), 500);
    return () => clearInterval(t);
  }, [won, moves]);

  useEffect(() => {
    if (up.length !== 2) return undefined;
    const [a, b] = up.map((i) => deck[i].card.id);
    const t = setTimeout(
      () => {
        if (a === b) setFound((f) => [...f, a]);
        setUp([]);
      },
      a === b ? 350 : 850,
    );
    return () => clearTimeout(t);
  }, [up, deck]);

  useEffect(() => {
    if (won) onWin(moves);
  }, [won]); // eslint-disable-line react-hooks/exhaustive-deps

  const turn = (i) => {
    if (up.length === 2 || up.includes(i) || found.includes(deck[i].card.id)) return;
    if (!started.current) started.current = Date.now();
    const next = [...up, i];
    setUp(next);
    if (next.length === 2) setMoves((m) => m + 1);
  };

  const again = () => {
    setRound((r) => r + 1);
    setUp([]);
    setFound([]);
    setMoves(0);
    setSeconds(0);
    started.current = null;
  };

  return (
    <Panel title="Pairs" eyebrow="Arcade · memory" onClose={onClose} className="is-wide">
      {!enough ? (
        <p className="pairs-locked">
          Pairs is played with your own cards. Collect at least {PAIRS} — open a booster or two — and come back.
        </p>
      ) : (
        <>
          <div className="pairs-bar">
            <span>
              <b>{found.length}</b>/{PAIRS} pairs
            </span>
            <span>
              <b>{moves}</b> moves
            </span>
            <span>
              <b>{seconds}</b>s
            </span>
            <span>Best: {best != null ? `${best} moves` : "—"}</span>
            <button type="button" className="btn btn-sm" onClick={again}>
              Shuffle again
            </button>
          </div>
          {won && (
            <p className="pairs-won" role="status">
              Cleared in {moves} moves and {seconds} seconds{best == null || moves <= best ? " — a new best!" : "."}
            </p>
          )}
          <ol className="pairs-grid">
            {deck.map((d, i) => {
              const isUp = up.includes(i) || found.includes(d.card.id);
              return (
                <li key={`${round}-${d.key}`}>
                  <button
                    type="button"
                    className={`pair${isUp ? " is-up" : ""}${found.includes(d.card.id) ? " is-found" : ""}`}
                    onClick={() => turn(i)}
                    aria-label={isUp ? d.card.name : `Card ${i + 1}, face down`}
                  >
                    <span className="pair-inner">
                      <span className="pair-back">
                        <CardBack />
                      </span>
                      <span className="pair-front card">
                        <CardFace card={d.card} />
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </>
      )}
    </Panel>
  );
}
