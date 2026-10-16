import React from "react";
import { profile } from "../../../data/journey";

/** About_Me.txt, open in Notepad. */
export default function AboutApp({ os }) {
  return (
    <div className="notepad">
      <div className="notepad-text">
        <p className="np-name">{profile.name.toUpperCase()}</p>
        <p>{profile.title}</p>
        <p className="np-muted">Portfolio · Växjö, Sweden</p>
        <p className="np-rule" aria-hidden="true">
          ================================
        </p>
        <p className="np-lede">{profile.lede}</p>
        <p>{profile.blurb}</p>
        <p className="np-rule" aria-hidden="true">
          --------------------------------
        </p>
        <div className="np-actions">
          <button type="button" className="btn95 btn95-default" onClick={() => os.launch("projects")}>
            View my work
          </button>
          <button type="button" className="btn95" onClick={() => os.launch("contact")}>
            Get in touch
          </button>
          <button type="button" className="btn95" onClick={() => os.launch("career")}>
            Run Career Setup…
          </button>
        </div>
        <p className="np-cursor" aria-hidden="true">
          _
        </p>
      </div>
    </div>
  );
}
