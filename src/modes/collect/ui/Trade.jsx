import React from "react";
import Panel from "./Panel";
import Card from "../components/Card";
import SocialIcon from "../components/SocialIcon";
import { cardById } from "../cards/catalog";
import { contact } from "../../../data/site";
import { socialLinks } from "../../../data/social";

/** The contact form, as a trade offer. */
export default function Trade({ onClose }) {
  return (
    <Panel title="The trade desk" eyebrow={contact.heading} onClose={onClose} className="is-wide">
      <div className="trade">
        <div className="trade-card">
          <Card card={cardById.hero} />
          <p className="trade-status">● Open to offers</p>
        </div>
        <div className="trade-copy">
          <p>{contact.intro}</p>
          <dl className="trade-details">
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
          <ul className="trade-social">
            {socialLinks.map((l) => (
              <li key={l.id}>
                <a className="btn btn-sm" href={l.href} target="_blank" rel="noreferrer">
                  <SocialIcon link={l} /> {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <form className="trade-form" action={contact.formAction} method="POST">
          <h3>Make an offer</h3>
          <label>
            <span>Name</span>
            <input type="text" name="name" placeholder="Your full name" required />
          </label>
          <label>
            <span>Email</span>
            <input type="email" name="email" placeholder="your.email@example.com" required />
          </label>
          <label>
            <span>Your offer</span>
            <textarea name="message" rows="5" placeholder="Tell me about your project or just say hello..." required />
          </label>
          <button type="submit" className="btn btn-gold">
            Send the offer
          </button>
        </form>
      </div>
    </Panel>
  );
}
