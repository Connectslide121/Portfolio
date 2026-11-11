import React from "react";
import { Dusk, Mark } from "../art/Scenery";
import { profile } from "../../../data/journey";
import { contact } from "../../../data/site";
import { socialLinks } from "../../../data/social";
import { MODES, pickerHref } from "../../registry";

export default function Footer() {
  return (
    <footer className="footer">
      <Dusk />
      <div className="footer-bar">
        <div className="wrap footer-inner">
          <p className="footer-brand">
            <Mark />
            <span>
              <b>{profile.name}</b>
              <small>
                <i lang="eu">Mendi</i> is Basque for mountain. <i lang="eu">Mendizabal</i>: the wide mountain.
              </small>
            </span>
          </p>
          <ul className="footer-links">
            <li>
              <a href={`mailto:${contact.email}`}>{contact.email}</a>
            </li>
            {socialLinks.map((l) => (
              <li key={l.id}>
                <a href={l.href} target="_blank" rel="noreferrer">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          {/* The same CV in the other designs: also behind the switcher, but said in words here. */}
          <a className="footer-styles" href={pickerHref()}>
            {MODES.length - 1} other styles <span aria-hidden="true">→</span>
          </a>
          <a className="footer-top" href="#top">
            Back to the top <span aria-hidden="true">↑</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
