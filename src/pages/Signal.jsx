import React from "react";
import "../styles/signal.css";
import SectionHead from "../components/SectionHead";
import RadioDish from "../art/RadioDish";
import SocialIcon from "../components/SocialIcon";
import { contact } from "../data/site";
import { socialLinks } from "../data/social";

export default function Signal() {
  return (
    <section id="signal" className="section">
      <SectionHead sign="⌁" title={contact.heading}>
        <p>{contact.intro}</p>
      </SectionHead>
      <div className="signal">
        <div className="signal-side">
          <RadioDish />
          <dl className="coords">
            <dt>Email</dt>
            <dd>
              <a href={`mailto:${contact.email}`}>{contact.email}</a>
            </dd>
            <dt>Phone</dt>
            <dd>
              <a href={`tel:${contact.phone.replace(/[^+\d]/g, "")}`}>{contact.phone}</a>
            </dd>
            <dt>Location</dt>
            <dd>{contact.location} · 56.88° N, 14.81° E</dd>
          </dl>
          <ul className="profiles">
            {socialLinks.map((l) => (
              <li key={l.id}>
                <a href={l.href} target="_blank" rel="noreferrer" aria-label={l.label}>
                  <SocialIcon link={l} />
                </a>
              </li>
            ))}
          </ul>
        </div>
        <form className="signal-form" action={contact.formAction} method="POST">
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
            <textarea name="message" rows="6" placeholder="Tell me about your project or just say hello..." required />
          </label>
          <button type="submit" className="btn btn-glow">
            Send message
          </button>
        </form>
      </div>
    </section>
  );
}
