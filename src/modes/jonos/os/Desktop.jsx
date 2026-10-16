import React, { useState } from "react";
import PixelArt, { Icon } from "./PixelArt";
import { icon } from "./icons";
import SocialIcon from "../components/SocialIcon";
import { APPS, DESKTOP } from "./apps";
import { socialLinks } from "../../../data/social";

function AppIcon({ id, os, selected, onSelect }) {
  const app = APPS[id];
  return (
    <li>
      <button
        type="button"
        className={`desk-icon${selected ? " is-selected" : ""}`}
        onClick={(e) => {
          onSelect(id);
          // Keyboard (detail 0) and touch open on one activation; a mouse
          // selects on the first click and opens on the second.
          if (e.detail === 0 || os.touch) os.launch(id);
        }}
        onDoubleClick={() => os.launch(id)}
      >
        <Icon name={app.icon} scale={2} />
        <span>{app.label}</span>
      </button>
    </li>
  );
}

/**
 * The desktop: a column of program icons, the profile shortcuts, the bin,
 * and the JonOS mark printed on the wallpaper.
 */
export default function Desktop({ os, children }) {
  const [selected, setSelected] = useState(null);

  return (
    <div
      className="desktop"
      onPointerDown={(e) => {
        if (e.target === e.currentTarget || e.target.classList.contains("desk-icons")) setSelected(null);
      }}
    >
      <div className="wallpaper" aria-hidden="true">
        <PixelArt pixels={icon("logo")} scale={14} />
        <p>
          Jon<b>OS</b>
        </p>
      </div>

      <ul className="desk-icons" aria-label="Desktop">
        {DESKTOP.map((id) => (
          <AppIcon key={id} id={id} os={os} selected={selected === id} onSelect={setSelected} />
        ))}
        {socialLinks.map((l) => (
          <li key={l.id}>
            <a
              className={`desk-icon${selected === l.id ? " is-selected" : ""}`}
              href={l.href}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => {
                // Same rule as programs: a mouse needs a double-click.
                if (!(e.detail === 0 || os.touch || e.detail > 1)) {
                  e.preventDefault();
                  setSelected(l.id);
                }
              }}
            >
              <span className="shortcut-tile">
                <SocialIcon link={l} />
                <span className="shortcut-arrow" aria-hidden="true">
                  ↗
                </span>
              </span>
              <span>{l.label}</span>
            </a>
          </li>
        ))}
        <AppIcon id="recycle" os={os} selected={selected === "recycle"} onSelect={setSelected} />
      </ul>

      {children}
    </div>
  );
}
