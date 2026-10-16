import React, { useState } from "react";
import "../styles/header.css";
import ThemeToggle from "./ThemeToggle";
import { scrollToSection, useActiveSection } from "./hooks";

const SECTIONS = [
  { id: "home", label: "Hi!", color: "yellow" },
  { id: "about", label: "About", color: "pink" },
  { id: "experience", label: "Work", color: "blue" },
  { id: "projects", label: "Projects", color: "green" },
  { id: "contact", label: "Say hello", color: "orange" },
];
const IDS = SECTIONS.map((s) => s.id);

export default function Header() {
  const active = useActiveSection(IDS);
  const [open, setOpen] = useState(false);
  const go = (id) => {
    scrollToSection(id);
    setOpen(false);
  };
  return (
    <header className={`header${open ? " is-open" : ""}`}>
      <button type="button" className="logo" onClick={() => go("home")} aria-label="Jon Mendizabal — back to the top">
        JM
      </button>
      <nav aria-label="Sections">
        <ul>
          {SECTIONS.map((s) => (
            <li key={s.id}>
              <button
                type="button"
                className={`pill bg-${s.color}${active === s.id ? " is-active" : ""}`}
                aria-current={active === s.id ? "true" : undefined}
                onClick={() => go(s.id)}
              >
                {s.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <div className="header-end">
        <ThemeToggle />
        <button type="button" className="menu-btn" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
          {open ? "Close" : "Menu"}
        </button>
      </div>
    </header>
  );
}
