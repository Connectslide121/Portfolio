import React from "react";
import { socialLinks } from "../../../data/social";
import SocialIcon from "./SocialIcon";
import { scrollToSection } from "./hooks";

export default function Footer() {
  return (
    <footer className="footer">
      <p className="footer-big">
        Made with <span className="heart">♥</span> by Jon Mendizabal
      </p>
      <ul className="footer-social">
        {socialLinks.map((l) => (
          <li key={l.id}>
            <a className="chunky chunky-icon bg-white" href={l.href} target="_blank" rel="noreferrer" aria-label={l.label}>
              <SocialIcon link={l} />
            </a>
          </li>
        ))}
      </ul>
      <p className="footer-small">
        © {new Date().getFullYear()} ·{" "}
        <button type="button" className="text-link" onClick={() => scrollToSection("home")}>
          back to the top ↑
        </button>
      </p>
    </footer>
  );
}
