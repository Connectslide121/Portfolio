import React, { useRef } from "react";
import Mark from "./Mark";
import ThemeToggle from "./ThemeToggle";
import { useActiveSection, useScrolled } from "./hooks";
import { profile } from "../../../data/journey";

const LINKS = [
  ["process", "Process"],
  ["work", "Work"],
  ["record", "Record"],
  ["tooling", "Tooling"],
  ["contact", "Contact"],
];
const IDS = ["top", ...LINKS.map(([id]) => id)];

export default function Nav() {
  const active = useActiveSection(IDS);
  const scrolled = useScrolled();
  const menu = useRef(null);

  return (
    <header className={`nav${scrolled ? " is-scrolled" : ""}`}>
      <div className="wrap nav-inner">
        <a className="brand" href="#top" aria-label={`${profile.name}, back to the top`}>
          <Mark />
          <span>{profile.name}</span>
        </a>

        <nav className="nav-links" aria-label="Sections">
          {LINKS.map(([id, label], i) => (
            <a key={id} href={`#${id}`} aria-current={active === id ? "true" : undefined}>
              <small>{String(i + 1).padStart(2, "0")}</small>
              {label}
            </a>
          ))}
        </nav>

        <div className="nav-tools">
          <ThemeToggle />
          <a className="btn btn-small nav-cta" href="#contact">
            Say hello
          </a>
          <button type="button" className="icon-btn nav-menu-btn" aria-label="Open the menu" aria-haspopup="dialog" onClick={() => menu.current?.showModal()}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 8h16M4 16h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* The same links, as a sheet, where the bar has no room for them. */}
      <dialog ref={menu} className="menu" aria-label="Menu" onClick={(e) => e.target === menu.current && menu.current.close()}>
        <div className="menu-sheet">
          <div className="menu-top">
            <span className="brand">
              <Mark />
              <span>{profile.name}</span>
            </span>
            <button type="button" className="icon-btn" aria-label="Close the menu" onClick={() => menu.current?.close()}>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>
          <nav aria-label="Sections">
            {LINKS.map(([id, label], i) => (
              <a key={id} href={`#${id}`} aria-current={active === id ? "true" : undefined} onClick={() => menu.current?.close()}>
                <small>{String(i + 1).padStart(2, "0")}</small>
                {label}
              </a>
            ))}
          </nav>
        </div>
      </dialog>
    </header>
  );
}
