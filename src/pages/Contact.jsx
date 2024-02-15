import React from "react";
import "../styles/contact.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPaperPlane,
  faSquareEnvelope,
  faSquarePhone
} from "@fortawesome/free-solid-svg-icons";
import logo from "../images/logo.webp";

export default function Contact() {
  return (
    <section id="contact">
      <h2>CONTACT</h2>
      <div className="contact-content">
        <div className="contact-info">
          <div className="contact-info-header">
            <img src={logo} alt="contact icon" />
            <h2>JON MENDIZABAL</h2>
          </div>
          <div className="contact-info-details">
            <h3>
              <span>
                <FontAwesomeIcon icon={faSquareEnvelope} />
              </span>
              <a href="mailto:jonmendi@gmail.com">jonmendi@gmail.com</a>
            </h3>
            <h3>
              <span>
                <FontAwesomeIcon icon={faSquarePhone} />
              </span>
              +46 79-354 10 60
            </h3>
          </div>
        </div>
        <div className="contact-form">
          <form action="">
            <div className="contact-form-group">
              <label htmlFor="name">Name</label>
              <input type="text" id="name" name="name" required />
            </div>
            <div className="contact-form-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email" required />
            </div>
            <div className="contact-form-group">
              <label htmlFor="message">Message</label>
              <textarea id="message" name="message" rows="10" required />
            </div>
            <button type="submit">
              <FontAwesomeIcon icon={faPaperPlane} /> Submit
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
