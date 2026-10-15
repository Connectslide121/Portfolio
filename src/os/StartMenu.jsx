import React, { useEffect, useRef } from "react";
import { Icon } from "./PixelArt";
import { APPS, DESKTOP } from "./apps";

export default function StartMenu({ os, onClose, dark, onTheme, onScreensaver, onShutDown }) {
  const ref = useRef(null);

  useEffect(() => {
    ref.current?.querySelector("button")?.focus();
    const onKey = (e) => e.key === "Escape" && onClose();
    const onDown = (e) => {
      if (!ref.current?.contains(e.target) && !e.target.closest(".start-btn")) onClose();
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onDown);
    };
  }, [onClose]);

  const run = (fn) => () => {
    onClose();
    fn();
  };

  return (
    <div className="start-menu raised" id="start-menu" ref={ref} role="menu" aria-label="Start">
      <div className="start-band" aria-hidden="true">
        <span>
          Jon<b>OS</b>
        </span>
      </div>
      <ul>
        {DESKTOP.map((id) => (
          <li key={id} role="none">
            <button type="button" role="menuitem" onClick={run(() => os.launch(id))}>
              <Icon name={APPS[id].icon} scale={2} />
              <span>{APPS[id].label === "About_Me.txt" ? "About me" : APPS[id].label}</span>
            </button>
          </li>
        ))}
        <li className="start-sep" role="separator" />
        <li role="none">
          <button type="button" role="menuitem" onClick={run(onTheme)}>
            <Icon name="computer" scale={2} />
            <span>Display: {dark ? "Standard (light)" : "Night (dark)"}</span>
          </button>
        </li>
        <li role="none">
          <button type="button" role="menuitem" onClick={run(onScreensaver)}>
            <Icon name="screen" scale={2} />
            <span>Screensaver</span>
          </button>
        </li>
        <li className="start-sep" role="separator" />
        <li role="none">
          <button type="button" role="menuitem" onClick={run(onShutDown)}>
            <Icon name="shutdown" scale={2} />
            <span>Shut Down…</span>
          </button>
        </li>
      </ul>
    </div>
  );
}
