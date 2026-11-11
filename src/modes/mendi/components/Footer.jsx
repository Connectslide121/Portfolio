import React from "react";
import { Dusk, Mark } from "../art/Scenery";
import { profile } from "../../../data/journey";
import { contact } from "../../../data/site";
import { socialLinks } from "../../../data/social";

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
          <a className="footer-top" href="#top">
            Back to the top <span aria-hidden="true">↑</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
