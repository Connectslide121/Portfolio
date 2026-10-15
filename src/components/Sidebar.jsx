import React from "react";
import "../styles/sidebar.css";
import { socialLinks } from "../data/social";

export default function Sidebar() {
  return (
    <aside>
      <ul>
        {socialLinks.map((link) => (
          <li key={link.id}>
            <a href={link.href} target="_blank" rel="noreferrer" title={link.id}>
              <svg viewBox={link.viewBox}>
                <path d={link.path} />
              </svg>
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}
