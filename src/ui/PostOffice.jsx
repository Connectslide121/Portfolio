import React from "react";
import Panel from "./Panel";
import SocialIcon from "../components/SocialIcon";
import { contact } from "../data/site";
import { socialLinks } from "../data/social";

export default function PostOffice({ onClose }) {
  return (
    <Panel title={`Post Office · ${contact.heading}`} onClose={onClose} wide>
      <div className="post">
        <div>
          <p className="panel-note">{contact.intro}</p>
          <dl className="post-details">
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
          <ul className="post-social">
            {socialLinks.map((l) => (
              <li key={l.id}>
                <a className="rpg-btn" href={l.href} target="_blank" rel="noreferrer">
                  <SocialIcon link={l} /> {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <form className="letter" action={contact.formAction} method="POST">
          <h3>Send me a message</h3>
          <label>
            <span>Name</span>
            <input type="text" name="name" placeholder="Your full name" required />
          </label>
          <label>
            <span>Email</span>
            <input type="email" name="email" placeholder="your.email@example.com" required />
          </label>
          <label>
            <span>Message</span>
            <textarea name="message" rows="5" placeholder="Tell me about your project or just say hello..." required />
          </label>
          <button type="submit" className="rpg-btn">
            ✉ Send message
          </button>
        </form>
      </div>
    </Panel>
  );
}
