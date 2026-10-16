import React, { useRef } from "react";
import Art from "../cards/art";
import { RARITY, setById, collectorNo } from "../cards/catalog";

/** The printed face of a card. Sized by its container: everything is in cqw. */
export function CardFace({ card, live = false }) {
  const r = RARITY[card.rarity];
  const set = setById(card.set);
  return (
    <div className={`card-face frame-${card.frame} r-${card.rarity}`}>
      <div className="card-inner">
        <header className="card-name">
          <h3>{card.name}</h3>
          {card.cost && <span className="card-cost">{card.cost}</span>}
        </header>
        <div className="card-art">
          <Art card={card} live={live} />
        </div>
        <p className="card-type">{card.type}</p>
        <div className="card-text">
          <p>{card.text}</p>
          {card.flavour && <p className="card-flavour">{card.flavour}</p>}
        </div>
        <footer className="card-foot">
          <span className="card-no">
            {set.code} {collectorNo(card)}
          </span>
          <span className="card-rarity" title={r.label}>
            {r.mark}
          </span>
          <span className="card-stats">
            {card.stats.map((s) => (
              <span key={s.label}>
                {s.icon} {s.value} <small>{s.label}</small>
              </span>
            ))}
          </span>
        </footer>
      </div>
      {r.rank >= 3 && <span className="card-holo" aria-hidden="true" />}
      <span className="card-glare" aria-hidden="true" />
    </div>
  );
}

/**
 * A card you can pick up: it tilts toward the pointer, and the foil and the
 * glare follow it. The pointer position is handed to the CSS as custom
 * properties; nothing else is styled from here.
 */
export default function Card({ card, live = false, tilt = true, className = "", onOpen, isNew = false }) {
  const ref = useRef(null);

  const move = (e) => {
    const el = ref.current;
    if (!tilt || !el || e.pointerType === "touch") return;
    const b = el.getBoundingClientRect();
    const x = Math.min(1, Math.max(0, (e.clientX - b.left) / b.width));
    const y = Math.min(1, Math.max(0, (e.clientY - b.top) / b.height));
    el.style.setProperty("--mx", `${x * 100}%`);
    el.style.setProperty("--my", `${y * 100}%`);
    el.style.setProperty("--rx", `${(0.5 - y) * 20}deg`);
    el.style.setProperty("--ry", `${(x - 0.5) * 24}deg`);
    el.classList.add("is-tilting");
  };

  const leave = () => {
    const el = ref.current;
    if (!el) return;
    ["--mx", "--my", "--rx", "--ry"].forEach((p) => el.style.removeProperty(p));
    el.classList.remove("is-tilting");
  };

  const interactive = Boolean(onOpen);
  const label = `${card.name}, ${RARITY[card.rarity].label} card`;

  return (
    <div
      ref={ref}
      className={`card ${interactive ? "is-button" : ""} ${className}`.trim()}
      onPointerMove={move}
      onPointerLeave={leave}
      {...(interactive && {
        role: "button",
        tabIndex: 0,
        "aria-label": `${label}. Open`,
        onClick: () => onOpen(card),
        onKeyDown: (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onOpen(card);
          }
        },
      })}
    >
      <CardFace card={card} live={live} />
      {isNew && <span className="card-new">New!</span>}
    </div>
  );
}

/** An empty album pocket: the number and the rarity, but not the card. */
export function CardSlot({ card }) {
  const r = RARITY[card.rarity];
  return (
    <div className="card-slot" aria-label={`Card ${card.no}, not collected yet`}>
      <span className="card-slot-mark">?</span>
      <span className="card-slot-no">
        {setById(card.set).code} {String(card.no).padStart(3, "0")}
      </span>
      <span className="card-slot-rarity" title={r.label}>
        {r.mark} {r.label}
      </span>
    </div>
  );
}
