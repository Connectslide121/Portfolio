import React from "react";
import Wobble from "../components/Wobble";
import "../styles/contact.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPaperPlane,
  faEnvelope,
  faPhone,
  faMapMarkerAlt
} from "@fortawesome/free-solid-svg-icons";
import Monogram from "../components/Monogram";
import { contact } from "../data/site";

export default function Contact() {
  return (
    <section id="contact">
      <div className="contact-header">
        <p className="eyebrow">03 · Contact</p>
        <h2>
          Get in <Wobble>touch</Wobble>
        </h2>
        <p>{contact.intro}</p>
      </div>

      <div className="contact-content">
        <div className="contact-info">
          <div className="contact-info-header">
            <Monogram size="3rem" />
            <h3>Jon Mendizabal</h3>
          </div>

          <div className="contact-info-details">
            <div className="contact-detail">
              <div className="contact-detail-icon">
                <FontAwesomeIcon icon={faEnvelope} />
              </div>
              <div className="contact-detail-content">
                <h4>Email</h4>
                <p>
                  <a href={`mailto:${contact.email}`}>{contact.email}</a>
                </p>
              </div>
            </div>

            <div className="contact-detail">
              <div className="contact-detail-icon">
                <FontAwesomeIcon icon={faPhone} />
              </div>
              <div className="contact-detail-content">
                <h4>Phone</h4>
                <p>{contact.phone}</p>
              </div>
            </div>

            <div className="contact-detail">
              <div className="contact-detail-icon">
                <FontAwesomeIcon icon={faMapMarkerAlt} />
              </div>
              <div className="contact-detail-content">
                <h4>Location</h4>
                <p>{contact.location}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="contact-form">
          <h3>Send me a message</h3>
          <form action={contact.formAction} method="POST">
            <div className="contact-form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Your full name"
                required
              />
            </div>
            <div className="contact-form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="your.email@example.com"
                required
              />
            </div>
            <div className="contact-form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                rows="6"
                placeholder="Tell me about your project or just say hello..."
                required
              />
            </div>
            <button type="submit">
              <FontAwesomeIcon icon={faPaperPlane} />
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
