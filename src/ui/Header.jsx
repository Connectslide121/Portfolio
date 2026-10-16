import React from "react";
import { CARDS } from "../cards/catalog";
import { TROPHIES } from "../cards/collection";

export default function Header({ view, collection, dark, onView, onPanel, onTheme, onCv }) {
  const owned = Object.keys(collection.owned).length;
  const earned = Object.keys(collection.trophies).length;
  return (
    <header className="top">
      <button type="button" className="brand" onClick={() => onView("shelf")}>
        <span className="brand-mark" aria-hidden="true">
          JM
        </span>
        <span className="brand-text">
          <b>Jon Mendizabal</b>
          <small>Career · Trading Card Game</small>
        </span>
      </button>

      <nav className="top-nav" aria-label="Game">
        <button type="button" className="btn btn-sm" aria-current={view === "shelf" ? "page" : undefined} onClick={() => onView("shelf")}>
          Boosters
        </button>
        <button type="button" className="btn btn-sm" aria-current={view === "album" ? "page" : undefined} onClick={() => onView("album")}>
          Album
        </button>
        <button type="button" className="btn btn-sm" onClick={() => onPanel("trophies")}>
          Trophies <span className="top-count">{earned}/{TROPHIES.length}</span>
        </button>
        <button type="button" className="btn btn-sm" onClick={() => onPanel("pairs")}>
          Pairs
        </button>
        <button type="button" className="btn btn-sm" onClick={() => onPanel("trade")}>
          Trade
        </button>
      </nav>

      <div className="top-right">
        <div className="top-progress">
          <span>
            <b>{owned}</b>/{CARDS.length} cards
          </span>
          <progress max={CARDS.length} value={owned} aria-label="Collection progress" />
        </div>
        <button type="button" className="btn btn-sm theme-btn" onClick={onTheme} aria-pressed={dark} aria-label={dark ? "Switch to the light table" : "Switch to the night table"}>
          {dark ? "☾" : "☀"}
        </button>
        <button type="button" className="btn btn-sm" onClick={onCv}>
          Read as CV
        </button>
      </div>
    </header>
  );
}
