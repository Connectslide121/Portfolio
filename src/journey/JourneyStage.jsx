import React, { useEffect, useRef, useState } from "react";
import "../styles/journey.css";
import { BEATS } from "./config";
import { buildJourney } from "./timeline";
import { useJourneyDriver } from "./useJourneyDriver";
import WorldAbstract from "./WorldAbstract";
import WorldSilhouette from "./WorldSilhouette";

const STYLES = [
  { id: "abstract", label: "Abstract", World: WorldAbstract },
  { id: "silhouette", label: "Silhouette", World: WorldSilhouette },
];

export default function JourneyStage() {
  const stageRef = useRef(null);
  const [styleId, setStyleId] = useState("abstract");
  const [tl, setTl] = useState(null);

  const { World } = STYLES.find((s) => s.id === styleId);

  // Rebuild the timeline when the art style swaps — same beats, same labels,
  // different world. Proves the animation is independent of the art.
  useEffect(() => {
    const root = stageRef.current;
    if (!root) return;
    const built = buildJourney({ root });
    setTl(built.tl);
    built.tl.tweenTo(BEATS[0].id, { duration: 1.2 });
    return () => {
      built.tl.kill();
      setTl(null);
    };
  }, [styleId]);

  const { index, goTo, next, prev, playing, togglePlay } = useJourneyDriver(tl, stageRef);

  return (
    <div className="j-stage" ref={stageRef} data-style={styleId}>
      <World key={styleId} />

      {/* Beat cards live in real DOM over the SVG — selectable, readable, indexable (D8) */}
      <div className="j-cards">
        {BEATS.map((beat) => (
          <article className="j-card" data-card={beat.id} key={beat.id}>
            <div className="j-card-head">
              <span className="j-level">Level {beat.level}</span>
              <span className="j-year">{beat.year}</span>
            </div>
            <h2>{beat.role}</h2>
            <h3>
              {beat.org} <span className="j-dot">·</span> {beat.place}
            </h3>
            <dl>
              <dt>Constraint</dt>
              <dd>{beat.constraint}</dd>
              <dt>Objective</dt>
              <dd>{beat.objective}</dd>
            </dl>
            <p className="j-material">
              material: <strong>{beat.material}</strong>
            </p>
          </article>
        ))}
      </div>

      {/* chrome */}
      <div className="j-topbar">
        <div className="j-switch" role="group" aria-label="Art style">
          {STYLES.map((s) => (
            <button
              key={s.id}
              className={s.id === styleId ? "on" : ""}
              onClick={() => setStyleId(s.id)}
            >
              {s.label}
            </button>
          ))}
        </div>
        <a className="j-exit" href="./">
          Skip to CV →
        </a>
      </div>

      <div className="j-rail">
        <button className="j-nav" onClick={prev} disabled={index === 0} aria-label="Previous beat">
          ‹
        </button>
        <ol>
          {BEATS.map((beat, i) => (
            <li key={beat.id}>
              <button
                className={i === index ? "on" : ""}
                onClick={() => goTo(i)}
                aria-current={i === index}
              >
                <span className="j-tick" />
                <span className="j-rail-label">{beat.year.split(" ")[0]}</span>
              </button>
            </li>
          ))}
        </ol>
        <button
          className="j-nav"
          onClick={next}
          disabled={index === BEATS.length - 1}
          aria-label="Next beat"
        >
          ›
        </button>
        <button className="j-play" onClick={togglePlay}>
          {playing ? "Pause" : "Play"}
        </button>
      </div>

      <p className="j-hint">scroll · arrows · swipe · space to play</p>
    </div>
  );
}
