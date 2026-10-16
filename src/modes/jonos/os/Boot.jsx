import React, { useEffect, useState } from "react";
import PixelArt from "./PixelArt";
import { icon } from "./icons";
import { experience, education, profile } from "../../../data/journey";

// What the BIOS finds on its way up: the material of every entry, oldest
// first — polymers and steel before C# and systems.
const start = (e) => Number(e.dateLabel.slice(0, 4));
const materials = [...new Set([...education, ...experience].sort((a, b) => start(a) - start(b)).map((e) => e.material))];

const LINES = [
  "JonOS BIOS v2.0",
  `Copyright (C) 2005-${new Date().getFullYear()} ${profile.name}`,
  "",
  "Memory test ........ 640K OK",
  ...materials.map((m) => `Detecting material . ${m} ... OK`),
  "Location ........... Växjö, Sweden",
  "",
  "Starting JonOS...",
];

/**
 * Power on: the BIOS lines, then the splash with its progress bar. Any key
 * or click skips it.
 */
export default function Boot({ onDone }) {
  const [shown, setShown] = useState(0);
  const [splash, setSplash] = useState(false);

  useEffect(() => {
    if (shown < LINES.length) {
      const id = window.setTimeout(() => setShown((n) => n + 1), shown === 0 ? 250 : 90);
      return () => window.clearTimeout(id);
    }
    const a = window.setTimeout(() => setSplash(true), 300);
    const b = window.setTimeout(onDone, 2100);
    return () => {
      window.clearTimeout(a);
      window.clearTimeout(b);
    };
  }, [shown, onDone]);

  useEffect(() => {
    const skip = () => onDone();
    window.addEventListener("keydown", skip);
    return () => window.removeEventListener("keydown", skip);
  }, [onDone]);

  return (
    <div className="boot" onClick={onDone} role="status" aria-label="Starting JonOS. Press any key to skip.">
      {splash ? (
        <div className="splash">
          <PixelArt pixels={icon("logo")} scale={10} />
          <p className="splash-name">
            Jon<b>OS</b>
          </p>
          <p className="splash-sub">{profile.title}</p>
          <div className="splash-bar" aria-hidden="true">
            <span />
          </div>
        </div>
      ) : (
        <pre className="bios">
          {LINES.slice(0, shown).join("\n")}
          <span className="bios-cursor">_</span>
        </pre>
      )}
      <p className="boot-skip">Press any key to skip</p>
    </div>
  );
}
