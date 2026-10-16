import React, { useState } from "react";
import "../styles/header.css";
import ThemeToggle from "./ThemeToggle";
import { scrollToSection, useActiveSection, useLocalTime } from "./hooks";

export const SECTIONS = [
  { id: "home", label: "Index" },
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Work" },
  { id: "contact", label: "Contact" },
];

const IDS = SECTIONS.map((s) => s.id);

export default function Header() {
  const active = useActiveSection(IDS);
  const time = useLocalTime();
  const [open, setOpen] = useState(false);

  const go = (id) => {
    scrollToSection(id);
    setOpen(false);
  };

  return (
    <header className={`site-header${open ? " is-open" : ""}`}>
      <div className="wrap header-row">
        <button type="button" className="header-name" onClick={() => go("home")}>
          Jon Mendizabal
        </button>

        <nav className="header-nav" aria-label="Sections">
          <ol>
            {SECTIONS.map((s, i) => (
              <li key={s.id}>
                <button
                  type="button"
                  className={active === s.id ? "is-active" : ""}
                  aria-current={active === s.id ? "true" : undefined}
                  onClick={() => go(s.id)}
                >
                  <span className="nav-num">{String(i).padStart(2, "0")}</span>
                  {s.label}
                </button>
              </li>
            ))}
          </ol>
        </nav>

        <div className="header-meta">
          <span className="header-clock" title="Local time in Växjö">
            Växjö {time}
          </span>
          <ThemeToggle />
          <button
            type="button"
            className="header-menu"
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </div>
    </header>
  );
}
