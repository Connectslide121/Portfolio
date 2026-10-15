import React from "react";
import { socialLinks } from "../data/social";
import { scrollToSection } from "./hooks";

export default function Footer() {
  return (
    <footer className="page imprint">
      <p>
        © {new Date().getFullYear()} The Mendizabal Chronicle · Printed in Växjö, Sweden · Made with ♥ by Jon Mendizabal
      </p>
      <p>
        {socialLinks.map((l, i) => (
          <React.Fragment key={l.id}>
            {i > 0 && " · "}
            <a href={l.href} target="_blank" rel="noreferrer">
              {l.label}
            </a>
          </React.Fragment>
        ))}
      </p>
      <button type="button" className="jump" onClick={() => scrollToSection("home")}>
        Back to the front page ↑
      </button>
    </footer>
  );
}
