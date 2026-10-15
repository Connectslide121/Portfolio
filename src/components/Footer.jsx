import React from "react";
import "../styles/footer.css";
import { socialLinks } from "../data/social";
import { scrollToSection } from "./hooks";

export default function Footer() {
  return (
    <footer className="site-footer">
      <p className="footer-end">— End of drawing set —</p>
      <div className="footer-row">
        <p>
          {new Date().getFullYear()} · Made with <span className="heart">♥</span> by Jon Mendizabal
        </p>
        <ul>
          {socialLinks.map((l) => (
            <li key={l.id}>
              <a href={l.href} target="_blank" rel="noreferrer">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <button type="button" className="text-btn" onClick={() => scrollToSection("home")}>
          [ Back to S-01 ↑ ]
        </button>
      </div>
    </footer>
  );
}
