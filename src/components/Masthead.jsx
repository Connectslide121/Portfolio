import React from "react";
import "../styles/masthead.css";
import ThemeToggle from "./ThemeToggle";
import { edition } from "./edition";
import { scrollToSection, useActiveSection } from "./hooks";

export const SECTIONS = [
  { id: "home", label: "Front page", page: "A1" },
  { id: "careers", label: "Careers", page: "A2" },
  { id: "technology", label: "Technology", page: "A4" },
  { id: "projects", label: "Projects", page: "A5" },
  { id: "puzzle", label: "Puzzle", page: "A7" },
  { id: "letters", label: "Letters", page: "A8" },
];

const IDS = SECTIONS.map((s) => s.id);

export default function Masthead() {
  const active = useActiveSection(IDS);
  const { volume, number, date } = edition();

  return (
    <>
      <header className="masthead page">
        <div className="dateline">
          <span>
            Vol. {volume} · No. {number}
          </span>
          <span>Växjö, Sweden</span>
          <span>{date}</span>
          <ThemeToggle />
        </div>
        <h1 className="paper-title">
          <span>The Mendizabal Chronicle</span>
        </h1>
        <p className="motto">
          <span>Established 2005</span>
          <span className="motto-main">“All the code that's fit to ship”</span>
          <span>Free of charge</span>
        </p>
      </header>

      <nav className="section-bar" aria-label="Sections">
        <ol className="page">
          {SECTIONS.map((s) => (
            <li key={s.id}>
              <button
                type="button"
                className={active === s.id ? "is-active" : ""}
                aria-current={active === s.id ? "true" : undefined}
                onClick={() => scrollToSection(s.id)}
              >
                {s.label}
                <span>{s.page}</span>
              </button>
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
