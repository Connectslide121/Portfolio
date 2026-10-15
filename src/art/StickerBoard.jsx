import React, { useRef, useState } from "react";
import { StickerArt } from "./stickers";
import { experience } from "../data/journey";
import "../styles/stickers.css";

/**
 * Stickers stuck around the hero. Grab one and move it — it lifts, tilts
 * and lands on top of the others. Positions are percentages of the board,
 * so they survive a resize. Keyboard: focus a sticker, arrows nudge it.
 */
const current = experience[0];
const foundry = experience.find((e) => e.material === "steel");

// Laid out in the margins around the hero card, so nothing covers the words
// or the buttons until someone moves it there. [x, y] for wide screens and
// for phones, as percentages of the board.
const INITIAL = [
  { id: "spark", label: "AI where it adds value", wide: [7, 6], narrow: [12, 1], r: 6, size: 110 },
  { id: "pad", label: "Games, too", wide: [12, 36], narrow: [76, 2], r: -10, size: 120 },
  { id: "ladle", label: `${foundry.dateLabel.replace(" - ", "–")}: steel`, wide: [4, 64], narrow: [2, 88], r: -12, size: 150 },
  { id: "sweden", label: "Växjö, Sweden", wide: [76, 8], narrow: [44, 0], r: 8, size: 130 },
  { id: "cup", label: "Ships MVPs fast", wide: [86, 34], narrow: [27, 90], r: 12, size: 100 },
  { id: "code", label: "Full-stack", wide: [79, 60], narrow: [52, 88], r: -6, size: 120 },
  { id: "star", label: current.title.split(" & ")[0], wide: [88, 80], narrow: [76, 89], r: 14, size: 140 },
];

const place = () => {
  const narrow = window.matchMedia("(max-width: 900px)").matches;
  return INITIAL.map((s, i) => {
    const [x, y] = narrow ? s.narrow : s.wide;
    return { ...s, x, y, z: i + 1 };
  });
};

export default function StickerBoard() {
  const board = useRef(null);
  const [stickers, setStickers] = useState(place);
  const [held, setHeld] = useState(null);
  const top = useRef(INITIAL.length);

  const update = (id, patch) => setStickers((all) => all.map((s) => (s.id === id ? { ...s, ...patch } : s)));

  const lift = (id) => update(id, { z: ++top.current });

  const onDown = (e, s) => {
    if (e.button !== 0) return;
    e.preventDefault();
    const rect = board.current.getBoundingClientRect();
    const startX = e.clientX;
    const startY = e.clientY;
    const { x, y } = s;
    lift(s.id);
    setHeld(s.id);
    e.currentTarget.setPointerCapture(e.pointerId);

    const move = (ev) => {
      const nx = x + ((ev.clientX - startX) / rect.width) * 100;
      const ny = y + ((ev.clientY - startY) / rect.height) * 100;
      update(s.id, { x: Math.max(-5, Math.min(95, nx)), y: Math.max(-5, Math.min(95, ny)) });
    };
    const up = (ev) => {
      ev.currentTarget.removeEventListener("pointermove", move);
      ev.currentTarget.removeEventListener("pointerup", up);
      ev.currentTarget.removeEventListener("pointercancel", up);
      setHeld(null);
      // Land at a fresh little angle, like a real sticker pressed down.
      update(s.id, { r: Math.round((Math.random() - 0.5) * 30) });
    };
    e.currentTarget.addEventListener("pointermove", move);
    e.currentTarget.addEventListener("pointerup", up);
    e.currentTarget.addEventListener("pointercancel", up);
  };

  const onKey = (e, s) => {
    const step = e.shiftKey ? 5 : 1.5;
    const moves = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] };
    if (!moves[e.key]) return;
    e.preventDefault();
    lift(s.id);
    update(s.id, { x: Math.max(-5, Math.min(95, s.x + moves[e.key][0])), y: Math.max(-5, Math.min(95, s.y + moves[e.key][1])) });
  };

  return (
    <div className="sticker-board" ref={board}>
      {stickers.map((s) => (
        <button
          key={s.id}
          type="button"
          className={`sticker${held === s.id ? " is-held" : ""}`}
          style={{ left: `${s.x}%`, top: `${s.y}%`, zIndex: s.z, "--r": `${s.r}deg`, "--size": `${s.size}px` }}
          onPointerDown={(e) => onDown(e, s)}
          onKeyDown={(e) => onKey(e, s)}
          aria-label={`Sticker: ${s.label}. Drag it, or use the arrow keys to move it.`}
        >
          <StickerArt name={s.id} />
          <span className="sticker-label">{s.label}</span>
        </button>
      ))}
    </div>
  );
}
