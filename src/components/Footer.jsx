import React from "react";
import { socialLinks } from "../data/social";

export default function Footer() {
  return (
    <footer className="footer">
      <p>
        {new Date().getFullYear()} · Made with <span className="heart">♥</span> by Jon Mendizabal · observed from 56.88° N, 14.81° E
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
    </footer>
  );
}
