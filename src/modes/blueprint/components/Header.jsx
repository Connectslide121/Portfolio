import React, { useState } from "react";
import "../styles/header.css";
import ThemeToggle from "./ThemeToggle";
import { SHEETS } from "./Sheet";
import { scrollToSection, useActiveSection } from "./hooks";

const IDS = SHEETS.map((s) => s.id);
const NAMES = { home: "Cover", about: "Parts", experience: "History", projects: "Works", contact: "Contact" };

export default function Header() {
  const active = useActiveSection(IDS);
  const [open, setOpen] = useState(false);

  const go = (id) => {
    scrollToSection(id);
    setOpen(false);
  };

  return (
    <header className={`site-header${open ? " is-open" : ""}`}>
      <button type="button" className="header-id" onClick={() => go("home")}>
        <span className="header-diamond" aria-hidden="true" />
        JM-001 <span>Jon Mendizabal</span>
      </button>

      <nav className="header-nav" aria-label="Sheets">
        <ol>
          {SHEETS.map((s) => (
            <li key={s.id}>
              <button
                type="button"
                className={active === s.id ? "is-active" : ""}
                aria-current={active === s.id ? "true" : undefined}
                onClick={() => go(s.id)}
              >
                <span className="tab-no">S-{s.no}</span>
                {NAMES[s.id]}
              </button>
            </li>
          ))}
        </ol>
      </nav>

      <div className="header-tools">
        <ThemeToggle />
        <button
          type="button"
          className="header-menu"
          aria-expanded={open}
          aria-label={open ? "Close sheet index" : "Open sheet index"}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? "[ Close ]" : "[ Sheets ]"}
        </button>
      </div>
    </header>
  );
}
