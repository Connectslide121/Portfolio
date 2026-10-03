import React from "react";
import { BEATS } from "./config";
import ThemeToggle from "../components/ThemeToggle";

/**
 * Reduced-motion fallback. No timeline is ever built — the same six story
 * beats are served as a readable, printed list.
 */
export default function JourneyStatic({ onExit }) {
  return (
    <div className="j-static">
      <header>
        <p className="j-brand">
          Jon Mendizabal <span className="j-dot">·</span> the journey
        </p>
        <ThemeToggle id="journey-static-theme-toggle" />
        <button className="j-exit" onClick={onExit}>
          Classic view →
        </button>
      </header>

      <p className="j-static-lede">
        Twelve years casting steel into molds, then a move to Sweden and a career
        reset. The material changed; building systems did not.
      </p>

      <ol className="j-static-list">
        {/* Story beats only: the landing card and the work wall are not
            stops, and listing them printed empty Constraint/Objective rows. */}
        {BEATS.filter((beat) => !beat.kind).map((beat) => (
          <li key={beat.id} style={{ "--jHeat": beat.heat }}>
            <div className="j-static-head">
              <span className="j-year">{beat.year}</span>
            </div>
            <h2>
              {beat.headline ? (
                <>
                  {beat.headline[0]} <em>{beat.headline[1]}</em>
                </>
              ) : (
                beat.role
              )}
            </h2>
            <h3>
              {beat.role} <span className="j-dot">·</span> {beat.org}{" "}
              <span className="j-dot">·</span> {beat.place}
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
          </li>
        ))}
      </ol>
    </div>
  );
}
