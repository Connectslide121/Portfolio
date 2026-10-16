import React, { useState } from "react";
import "../styles/nav.css";
import ThemeToggle from "./ThemeToggle";
import { scrollToSection, useActiveSection } from "./hooks";

const SECTIONS = [
  { id: "home", label: "Zenith" },
  { id: "acts", label: "Ages" },
  { id: "atlas", label: "Atlas" },
  { id: "path", label: "Path" },
  { id: "catalogue", label: "Catalogue" },
  { id: "signal", label: "Signal" },
];
const IDS = SECTIONS.map((s) => s.id);

export default function Nav() {
  const active = useActiveSection(IDS);
  const [open, setOpen] = useState(false);
  const go = (id) => {
    scrollToSection(id);
    setOpen(false);
  };
  return (
    <header className={`nav${open ? " is-open" : ""}`}>
      <button type="button" className="nav-mark" onClick={() => go("home")} aria-label="Back to the top">
        <span aria-hidden="true">✦</span> JM
      </button>
      <nav aria-label="Sections">
        <ol>
          {SECTIONS.map((s) => (
            <li key={s.id}>
              <button type="button" className={active === s.id ? "is-active" : ""} aria-current={active === s.id ? "true" : undefined} onClick={() => go(s.id)}>
                {s.label}
              </button>
            </li>
          ))}
        </ol>
      </nav>
      <ThemeToggle />
      <button type="button" className="nav-menu" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        {open ? "Close" : "Menu"}
      </button>
    </header>
  );
}
