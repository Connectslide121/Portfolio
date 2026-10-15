import React from "react";
import "../styles/letters.css";
import SectionFlag from "../components/SectionFlag";
import { contact } from "../data/site";

export default function Letters() {
  return (
    <section id="letters" className="page letters">
      <SectionFlag id="letters" title="Letters to the editor" aside={contact.heading} />
      <div className="letters-grid">
        <div className="editorial">
          <p className="kicker">From the editor</p>
          <p className="editorial-text dropcap">{contact.intro}</p>
          <dl className="reach">
            <dt>Write</dt>
            <dd>
              <a href={`mailto:${contact.email}`}>{contact.email}</a>
            </dd>
            <dt>Telephone</dt>
            <dd>
              <a href={`tel:${contact.phone.replace(/[^+\d]/g, "")}`}>{contact.phone}</a>
            </dd>
            <dt>Office</dt>
            <dd>{contact.location}</dd>
          </dl>
        </div>

        <form className="letter-form" action={contact.formAction} method="POST">
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
            <textarea name="message" rows="7" placeholder="Tell me about your project or just say hello..." required />
          </label>
          <button type="submit" className="press-btn press-btn-solid">
            Send message
          </button>
        </form>
      </div>
    </section>
  );
}
