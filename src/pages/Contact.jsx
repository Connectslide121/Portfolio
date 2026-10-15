import React from "react";
import "../styles/contact.css";
import SectionHead from "../components/SectionHead";
import SocialIcon from "../components/SocialIcon";
import { contact } from "../data/site";
import { socialLinks } from "../data/social";

export default function Contact() {
  return (
    <section id="contact" className="section contact">
      <SectionHead num="04" title={contact.heading}>
        <p>{contact.intro}</p>
      </SectionHead>

      <div className="wrap contact-grid">
        <div className="contact-details" data-reveal>
          <a className="contact-email" href={`mailto:${contact.email}`}>
            {contact.email}
          </a>
          <dl>
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
                <ul className="contact-social">
                  {socialLinks.map((l) => (
                    <li key={l.id}>
                      <a href={l.href} target="_blank" rel="noreferrer">
                        <SocialIcon link={l} />
                        <span>{l.label}</span>
                        <span className="muted">{l.handle}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          </dl>
        </div>

        <form className="contact-form" action={contact.formAction} method="POST" data-reveal>
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
            <textarea
              name="message"
              rows="6"
              placeholder="Tell me about your project or just say hello..."
              required
            />
          </label>
          <button type="submit" className="btn btn-solid btn-wide">
            Send message <span aria-hidden="true">→</span>
          </button>
        </form>
      </div>
    </section>
  );
}
