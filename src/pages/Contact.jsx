import React from "react";
import "../styles/contact.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPaperPlane,
  faEnvelope,
  faPhone,
  faMapMarkerAlt
} from "@fortawesome/free-solid-svg-icons";
import logo from "../images/logo.webp";

export default function Contact() {
  return (
    <section id="contact">
      <div className="contact-header">
        <h2>Get In Touch</h2>
        <p>
          I'm always open to discussing new opportunities and interesting
          projects. Let's connect and create something amazing together!
        </p>
      </div>

      <div className="contact-content">
        <div className="contact-info">
          <div className="contact-info-header">
            <img src={logo} alt="Jon Mendizabal" />
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
                  <a href="mailto:jonmendi@gmail.com">jonmendi@gmail.com</a>
                </p>
              </div>
            </div>

            <div className="contact-detail">
              <div className="contact-detail-icon">
                <FontAwesomeIcon icon={faPhone} />
              </div>
              <div className="contact-detail-content">
                <h4>Phone</h4>
                <p>+46 79-354 10 60</p>
              </div>
            </div>

            <div className="contact-detail">
              <div className="contact-detail-icon">
                <FontAwesomeIcon icon={faMapMarkerAlt} />
              </div>
              <div className="contact-detail-content">
                <h4>Location</h4>
                <p>Växjö, Sweden</p>
              </div>
            </div>
          </div>
        </div>

        <div className="contact-form">
          <h3>Send me a message</h3>
          <form action="https://getform.io/f/penL3Eb7" method="POST">
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
