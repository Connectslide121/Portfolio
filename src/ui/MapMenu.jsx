import React from "react";
import Panel from "./Panel";
import { BUILDINGS, W, H } from "../game/map";

/** A parchment map of the world. Pick a place to travel straight there. */
export default function MapMenu({ visited, here, onClose, onTravel }) {
  return (
    <Panel title="World map" onClose={onClose} wide>
      <div className="world-map" style={{ "--w": W, "--h": H }}>
        <span className="wm-region wm-spain">Spain</span>
        <span className="wm-region wm-india">India</span>
        <span className="wm-region wm-sweden">Sweden</span>
        <span className="wm-water wm-river" />
        <span className="wm-water wm-sea" />
        <span className="wm-road" />
        {BUILDINGS.map((b) => (
          <button
            key={b.id}
            type="button"
            className={`wm-place${visited.includes(b.id) ? " is-seen" : ""}`}
            style={{ "--x": b.x + b.w / 2, "--y": b.y + b.h / 2 }}
            onClick={() => onTravel(b)}
          >
            <span className="wm-pin" aria-hidden="true" />
            <span className="wm-label">{b.name}</span>
          </button>
        ))}
        {here && <span className="wm-you" style={{ "--x": here.x + 0.5, "--y": here.y + 0.5 }} aria-label="You are here" />}
      </div>
      <p className="panel-note">Pick a place to travel there. Places you have visited are ticked.</p>
    </Panel>
  );
}
