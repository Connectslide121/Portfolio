import React, { useEffect, useState } from "react";
import { Icon } from "./PixelArt";
import { APPS } from "./apps";

const fmt = () =>
  new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Stockholm" }).format(new Date());

function Clock() {
  const [time, setTime] = useState(fmt);
  useEffect(() => {
    const id = window.setInterval(() => setTime(fmt()), 10000);
    return () => window.clearInterval(id);
  }, []);
  return (
    <span className="tray-clock" title="Växjö, Sweden">
      {time}
    </span>
  );
}

export default function Taskbar({ wm, startOpen, onStart, dark, onTheme }) {
  return (
    <footer className="taskbar">
      <button
        type="button"
        className={`start-btn${startOpen ? " is-pressed" : ""}`}
        aria-expanded={startOpen}
        aria-controls="start-menu"
        onClick={onStart}
      >
        <Icon name="logo" scale={1} />
        <span>Start</span>
      </button>

      <ul className="tasks" aria-label="Open windows">
        {wm.windows.map((w) => {
          const app = APPS[w.app];
          const title = w.props?.project ? w.props.project.title : app.label || app.title;
          const active = w.id === wm.focusedId && !w.min;
          return (
            <li key={w.id}>
              <button
                type="button"
                className={`task-btn${active ? " is-pressed" : ""}`}
                aria-pressed={active}
                onClick={() => (active ? wm.minimize(w.id) : wm.focus(w.id))}
              >
                <Icon name={app.icon} scale={1} />
                <span>{title}</span>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="tray">
        <button type="button" className="tray-btn" onClick={onTheme} aria-label={dark ? "Use light theme" : "Use dark theme"} title={dark ? "Display: Night" : "Display: Standard"}>
          {dark ? "☾" : "☀"}
        </button>
        <Clock />
      </div>
    </footer>
  );
}
