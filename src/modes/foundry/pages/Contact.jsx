import React from "react";
import SectionHead from "../components/SectionHead";
import SocialIcon from "../components/SocialIcon";
import { useLocalTime } from "../components/hooks";
import { contact } from "../../../data/site";
import { socialLinks } from "../../../data/social";

export default function Contact() {
  const time = useLocalTime();

  return (
    <section id="contact" className="section contact">
      <div className="wrap">
        <SectionHead num="05" label="Order" title={contact.heading}>
          <p>{contact.intro}</p>
        </SectionHead>

        <div className="contact-grid">
          <div className="contact-details" data-reveal>
            <a className="contact-email" href={`mailto:${contact.email}`}>
              {contact.email}
            </a>
            <dl className="contact-facts">
              <div>
                <dt>Phone</dt>
                <dd>
                  <a href={`tel:${contact.phone.replace(/[^+\d]/g, "")}`}>{contact.phone}</a>
                </dd>
              </div>
              <div>
                <dt>Based in</dt>
                <dd>{contact.location}</dd>
              </div>
              <div>
                <dt>Local time</dt>
                <dd>
                  <time>{time}</time>
                </dd>
              </div>
            </dl>
            <ul className="contact-social">
              {socialLinks.map((l) => (
                <li key={l.id}>
                  <a href={l.href} target="_blank" rel="noreferrer">
                    <SocialIcon link={l} />
                    <b>{l.label}</b>
                    <span>{l.handle}</span>
                    <i aria-hidden="true">↗</i>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <form className="contact-form" action={contact.formAction} method="POST" data-reveal>
            <h3>Send me a message</h3>
            <label>
              <span>Name</span>
              <input type="text" name="name" autoComplete="name" placeholder="Your full name" required />
            </label>
            <label>
              <span>Email</span>
              <input type="email" name="email" autoComplete="email" placeholder="you@example.com" required />
            </label>
            <label>
              <span>Message</span>
              <textarea name="message" rows="6" placeholder="Tell me about your project, or just say hello." required />
            </label>
            <button type="submit" className="btn btn-wide">
              Send message <span aria-hidden="true">→</span>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
