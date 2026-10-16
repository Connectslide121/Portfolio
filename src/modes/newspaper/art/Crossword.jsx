import React, { useMemo, useRef, useState } from "react";
import { ROWS, COLS, WORDS, buildGrid, wordCells } from "./puzzle";
import "../styles/crossword.css";

/**
 * A playable crossword. Click a square (click again to turn), type to fill,
 * arrows to move, Backspace to step back. Check marks wrong letters; Reveal
 * gives up gracefully.
 */
export default function Crossword() {
  const cells = useMemo(buildGrid, []);
  const [letters, setLetters] = useState({});
  const [active, setActive] = useState({ key: null, dir: "across" });
  const [checked, setChecked] = useState(false);
  const refs = useRef({});
  // Whether the square already had focus when the mouse went down: only a
  // second click on a focused square turns the direction.
  const wasFocused = useRef(false);

  const word = useMemo(
    () => WORDS.find((w) => w.dir === active.dir && wordCells(w).includes(active.key)) || WORDS.find((w) => wordCells(w).includes(active.key)),
    [active],
  );
  const inWord = new Set(word ? wordCells(word) : []);
  const solved = Object.keys(cells).every((k) => letters[k] === cells[k].answer);

  const focus = (key, dir = active.dir) => {
    // Keep the direction only if the square has a word that way.
    const hasDir = WORDS.some((w) => w.dir === dir && wordCells(w).includes(key));
    setActive({ key, dir: hasDir ? dir : dir === "across" ? "down" : "across" });
    refs.current[key]?.focus();
  };

  const step = (key, delta) => {
    const [r, c] = key.split(",").map(Number);
    const [dr, dc] = active.dir === "across" ? [0, delta] : [delta, 0];
    const next = `${r + dr},${c + dc}`;
    if (cells[next]) focus(next);
  };

  const onKey = (e, key) => {
    const [r, c] = key.split(",").map(Number);
    const moves = { ArrowRight: [0, 1, "across"], ArrowLeft: [0, -1, "across"], ArrowDown: [1, 0, "down"], ArrowUp: [-1, 0, "down"] };
    if (moves[e.key]) {
      e.preventDefault();
      const [dr, dc, dir] = moves[e.key];
      for (let i = 1; i < Math.max(ROWS, COLS); i++) {
        const next = `${r + dr * i},${c + dc * i}`;
        if (cells[next]) return focus(next, dir);
      }
      return;
    }
    if (e.key === "Backspace") {
      e.preventDefault();
      if (letters[key]) setLetters((l) => ({ ...l, [key]: "" }));
      else step(key, -1);
      return;
    }
    if (/^[a-zA-Z]$/.test(e.key)) {
      e.preventDefault();
      setLetters((l) => ({ ...l, [key]: e.key.toUpperCase() }));
      setChecked(false);
      step(key, 1);
    }
  };

  const grid = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const key = `${r},${c}`;
      const cell = cells[key];
      if (!cell) {
        grid.push(<span key={key} className="cw-block" aria-hidden="true" />);
        continue;
      }
      const wrong = checked && letters[key] && letters[key] !== cell.answer;
      grid.push(
        <span key={key} className={`cw-cell${active.key === key ? " is-active" : ""}${inWord.has(key) ? " in-word" : ""}${wrong ? " is-wrong" : ""}`}>
          {cell.n && <span className="cw-num">{cell.n}</span>}
          <input
            ref={(el) => (refs.current[key] = el)}
            aria-label={`Row ${r + 1}, column ${c + 1}${cell.n ? `, clue ${cell.n}` : ""}`}
            value={letters[key] || ""}
            maxLength={1}
            onChange={() => {}}
            onKeyDown={(e) => onKey(e, key)}
            onMouseDown={(e) => (wasFocused.current = document.activeElement === e.currentTarget)}
            onClick={() => (wasFocused.current ? focus(key, active.dir === "across" ? "down" : "across") : focus(key))}
            onFocus={() => active.key !== key && setActive((a) => ({ ...a, key }))}
            autoComplete="off"
            autoCapitalize="characters"
            spellCheck="false"
          />
        </span>,
      );
    }
  }

  const clueList = (dir) =>
    WORDS.filter((w) => w.dir === dir).map((w) => (
      <li key={`${dir}${w.n}`} className={word === w ? "is-current" : ""}>
        <button type="button" onClick={() => focus(wordCells(w)[0], dir)}>
          <b>{w.n}</b> {w.clue} ({w.answer.length})
        </button>
      </li>
    ));

  return (
    <div className="crossword">
      <div className="cw-grid" style={{ "--cols": COLS }} role="group" aria-label="Crossword grid">
        {grid}
      </div>
      <div className="cw-side">
        {word && (
          <p className="cw-current">
            <b>
              {word.n} {word.dir}
            </b>{" "}
            {word.clue}
          </p>
        )}
        <div className="cw-clues">
          <div>
            <h4>Across</h4>
            <ol>{clueList("across")}</ol>
          </div>
          <div>
            <h4>Down</h4>
            <ol>{clueList("down")}</ol>
          </div>
        </div>
        <div className="cw-actions">
          <button type="button" className="press-btn" onClick={() => setChecked(true)}>
            Check
          </button>
          <button
            type="button"
            className="press-btn"
            onClick={() => setLetters(Object.fromEntries(Object.entries(cells).map(([k, v]) => [k, v.answer])))}
          >
            Reveal
          </button>
          <button
            type="button"
            className="press-btn"
            onClick={() => {
              setLetters({});
              setChecked(false);
            }}
          >
            Clear
          </button>
        </div>
        <p className="cw-status" aria-live="polite">
          {solved ? "Solved. Hats off." : checked ? "Wrong letters are struck through." : ""}
        </p>
      </div>
    </div>
  );
}
