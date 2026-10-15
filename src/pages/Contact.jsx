import React from "react";
import "../styles/contact.css";
import Sheet from "../components/Sheet";
import SocialIcon from "../components/SocialIcon";
import { contact } from "../data/site";
import { socialLinks } from "../data/social";

export default function Contact() {
  return (
    <Sheet id="contact" title={contact.heading} intro={contact.intro}>
      <div className="contact">
        <dl className="issued" data-reveal>
          <div className="issued-head">
            <dt>Issued by</dt>
            <dd>Jon Mendizabal</dd>
          </div>
          <div>
            <dt>Email</dt>
            <dd>
              <a href={`mailto:${contact.email}`}>{contact.email}</a>
            </dd>
          </div>
          <div>
            <dt>Phone</dt>
            <dd>
              <a href={`tel:${contact.phone.replace(/[^+\d]/g, "")}`}>{contact.phone}</a>
            </dd>
          </div>
          <div>
            <dt>Location</dt>
            <dd>{contact.location}</dd>
          </div>
          <div>
            <dt>Elsewhere</dt>
            <dd>
              <ul className="profiles">
                {socialLinks.map((l) => (
                  <li key={l.id}>
                    <a href={l.href} target="_blank" rel="noreferrer">
                      <SocialIcon link={l} />
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        </dl>

        <form className="cr-form" action={contact.formAction} method="POST" data-reveal>
          <p className="cr-head">
            <span>Form CR-01</span>
            <span>Send me a message</span>
          </p>
          <label className="cr-cell">
            <span>1 · Name</span>
            <input type="text" name="name" placeholder="Your full name" required />
          </label>
          <label className="cr-cell">
            <span>2 · Email</span>
            <input type="email" name="email" placeholder="your.email@example.com" required />
          </label>
          <label className="cr-cell cr-wide">
            <span>3 · Message</span>
            <textarea name="message" rows="6" placeholder="Tell me about your project or just say hello..." required />
          </label>
          <div className="cr-foot">
            <p>All fields required.</p>
            <button type="submit" className="stamp">
              Send message
            </button>
          </div>
        </form>
      </div>
    </Sheet>
  );
}
