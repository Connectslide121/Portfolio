import React from "react";
import "../styles/footer.css";
import { socialLinks } from "../../../data/social";
import { scrollToSection } from "./hooks";

export default function Footer({ gridVisible, onToggleGrid }) {
  return (
    <footer className="site-footer">
      <div className="wrap footer-grid">
        <p className="footer-mark">
          {new Date().getFullYear()} — Made with <span className="heart">♥</span> by Jon Mendizabal
        </p>
        <ul className="footer-social">
          {socialLinks.map((l) => (
            <li key={l.id}>
              <a href={l.href} target="_blank" rel="noreferrer">
                {l.label} ↗
              </a>
            </li>
          ))}
        </ul>
        <div className="footer-colophon">
          <p>Typeset in Archivo on a twelve-column grid.</p>
          <button type="button" className="link-btn" aria-pressed={gridVisible} onClick={onToggleGrid}>
            {gridVisible ? "Hide the grid" : "Show the grid"} <kbd>G</kbd>
          </button>
        </div>
        <button type="button" className="link-btn footer-top" onClick={() => scrollToSection("home")}>
          Back to top ↑
        </button>
      </div>
    </footer>
  );
}
