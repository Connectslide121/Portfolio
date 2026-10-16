import React from "react";
import Panel from "./Panel";
import SocialIcon from "../components/SocialIcon";
import { contact } from "../../../data/site";
import { socialLinks } from "../../../data/social";
import { profile } from "../../../data/journey";

/** Today: the end of the run, the score, and the way to get in touch. */
export default function EndScreen({ stats, time, onClose, onAgain, onCollection }) {
  return (
    <Panel title="★ You reached today! ★" onClose={onClose} wide className="end">
      <div className="end-grid">
        <div>
          <p className="end-lede">{profile.title}</p>
          <p className="note">{profile.blurb}</p>
          <dl className="score">
            <dt>Skills</dt>
            <dd>
              {stats.skills}/{stats.totalSkills}
            </dd>
            <dt>Projects</dt>
            <dd>
              {stats.coins}/{stats.totalCoins}
            </dd>
            <dt>Bugs fixed</dt>
            <dd>{stats.bugs}</dd>
            <dt>Time</dt>
            <dd>{time}</dd>
          </dl>
          <p className="end-actions">
            <button type="button" className="nes-btn" onClick={onCollection}>
              See the collection
            </button>
            <button type="button" className="nes-btn" onClick={onAgain}>
              Run again
            </button>
          </p>
          <ul className="end-social">
            {socialLinks.map((l) => (
              <li key={l.id}>
                <a className="nes-btn" href={l.href} target="_blank" rel="noreferrer" aria-label={l.label}>
                  <SocialIcon link={l} />
                </a>
              </li>
            ))}
          </ul>
        </div>
        <form className="end-form" action={contact.formAction} method="POST">
          <h3>{contact.heading}</h3>
          <p className="note">{contact.intro}</p>
          <p className="note">
            <a href={`mailto:${contact.email}`}>{contact.email}</a> · {contact.phone} · {contact.location}
          </p>
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
            <textarea name="message" rows="4" placeholder="Tell me about your project or just say hello..." required />
          </label>
          <button type="submit" className="nes-btn is-gold">
            Send message ✉
          </button>
        </form>
      </div>
    </Panel>
  );
}
