import React from "react";
import SocialIcon from "../components/SocialIcon";
import { contact } from "../data/site";
import { socialLinks } from "../data/social";
import { profile } from "../data/journey";

/** A new message to Jon, with his address book card beside it. */
export default function MailApp() {
  return (
    <div className="mail">
      <form className="mail-form" action={contact.formAction} method="POST">
        <div className="toolbar">
          <button type="submit" className="btn95 btn95-tool">
            <span aria-hidden="true">✉</span> Send message
          </button>
          <span className="toolbar-note">{contact.heading}</span>
        </div>
        <div className="mail-fields">
          <label className="mail-row">
            <span>To:</span>
            <input className="field95" type="text" value={`${profile.name} <${contact.email}>`} readOnly tabIndex={-1} aria-readonly="true" />
          </label>
          <label className="mail-row">
            <span>Name:</span>
            <input className="field95" type="text" name="name" placeholder="Your full name" required />
          </label>
          <label className="mail-row">
            <span>Email:</span>
            <input className="field95" type="email" name="email" placeholder="your.email@example.com" required />
          </label>
        </div>
        <label className="mail-body">
          <span className="sr-only">Message</span>
          <textarea className="field95" name="message" rows="8" placeholder="Tell me about your project or just say hello..." required />
        </label>
      </form>

      <aside className="address-card">
        <p className="address-intro">{contact.intro}</p>
        <fieldset className="group-box">
          <legend>Address book</legend>
          <dl>
            <dt>Email</dt>
            <dd>
              <a href={`mailto:${contact.email}`}>{contact.email}</a>
            </dd>
            <dt>Phone</dt>
            <dd>
              <a href={`tel:${contact.phone.replace(/[^+\d]/g, "")}`}>{contact.phone}</a>
            </dd>
            <dt>Location</dt>
            <dd>{contact.location}</dd>
          </dl>
          <ul className="address-links">
            {socialLinks.map((l) => (
              <li key={l.id}>
                <a href={l.href} target="_blank" rel="noreferrer">
                  <SocialIcon link={l} />
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </fieldset>
      </aside>
    </div>
  );
}
