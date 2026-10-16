import React, { useEffect, useRef } from "react";
import { profile } from "../../../data/journey";

/** The title screen: PRESS START. */
export default function Title({ onStart, onCv }) {
  const ref = useRef(null);
  useEffect(() => {
    ref.current?.focus();
    const onKey = (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onStart();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onStart]);

  return (
    <div className="title-screen">
      <div className="title-box">
        <p className="title-kicker">2005 — today · a career in one run</p>
        <h1>
          <span>{profile.name.split(" ")[0]}</span>
          <span>{profile.name.split(" ").slice(1).join(" ")}</span>
        </h1>
        <p className="title-sub">{profile.title}</p>
        <p className="title-lede">{profile.lede}</p>
        <button ref={ref} type="button" className="nes-btn is-gold title-start" onClick={onStart}>
          ▶ Press start
        </button>
        <div className="title-help">
          <p>
            <kbd>←</kbd> <kbd>→</kbd> run · <kbd>Space</kbd> jump
          </p>
          <p>Hit ? blocks for skills · grab coins for projects · stomp bugs · reach the flags</p>
        </div>
        <button type="button" className="link" onClick={onCv}>
          No time? Read it as a CV →
        </button>
      </div>
    </div>
  );
}
