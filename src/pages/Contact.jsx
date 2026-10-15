import React, { useState } from "react";
import "../styles/contact.css";
import { contact } from "../data/site";

export default function Contact() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(contact.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${contact.email}`;
    }
  };

  return (
    <section id="contact" className="section">
      <div className="contact">
        <div className="contact-side">
          <div className="bubble bg-yellow">
            <h2>{contact.heading}!</h2>
            <p>{contact.intro}</p>
          </div>
          <div className="details">
            <div className="detail">
              <span className="detail-label">Email</span>
              <a href={`mailto:${contact.email}`}>{contact.email}</a>
              <button type="button" className="chunky chunky-sm bg-pink" onClick={copy}>
                {copied ? "Copied! ✓" : "Copy"}
              </button>
            </div>
            <div className="detail">
              <span className="detail-label">Phone</span>
              <a href={`tel:${contact.phone.replace(/[^+\d]/g, "")}`}>{contact.phone}</a>
            </div>
            <div className="detail">
              <span className="detail-label">Location</span>
              <span>{contact.location}</span>
            </div>
          </div>
        </div>

        <form className="form bg-white" action={contact.formAction} method="POST">
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
          <button type="submit" className="chunky bg-green">
            Send message ✉
          </button>
        </form>
      </div>
    </section>
  );
}
