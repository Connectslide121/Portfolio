import React from "react";
import { MODES, hrefFor, pickerHref } from "../modes/registry";

/**
 * A small pill over every mode: back to the picker, or step to the previous
 * or next design. Its styles are its own (switch.css, all under .mode-switch)
 * so it looks the same on top of any of them.
 */
export default function ModeSwitch({ mode }) {
  const at = MODES.indexOf(mode);
  const prev = MODES[(at - 1 + MODES.length) % MODES.length];
  const next = MODES[(at + 1) % MODES.length];
  return (
    <nav className={`mode-switch at-${mode.switchAt || "bottom-left"}`} aria-label="Portfolio styles">
      <a href={hrefFor(prev.id)} className="mode-switch-step" aria-label={`Previous style: ${prev.name}`} title={prev.name}>
        ‹
      </a>
      <a href={pickerHref()} className="mode-switch-all" title="All styles">
        <span className="mode-switch-grid" aria-hidden="true">
          <i />
          <i />
          <i />
          <i />
        </span>
        <span className="mode-switch-label">
          {mode.name} <small>{at + 1}/{MODES.length}</small>
        </span>
      </a>
      <a href={hrefFor(next.id)} className="mode-switch-step" aria-label={`Next style: ${next.name}`} title={next.name}>
        ›
      </a>
    </nav>
  );
}
