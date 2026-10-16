import React from "react";
import "../styles/front.css";
import Halftone from "../art/Halftone";
import FrontArt from "../art/FrontArt";
import SocialIcon from "../components/SocialIcon";
import { SECTIONS } from "../components/Masthead";
import { profile, chapters, experience } from "../../../data/journey";
import { socialLinks } from "../../../data/social";
import { scrollToSection } from "../components/hooks";

const current = experience[0];

export default function FrontPage() {
  return (
    <section id="home" className="page front">
      <aside className="front-left">
        <div className="box index-box">
          <h3 className="box-head">Inside today</h3>
          <ul>
            {SECTIONS.slice(1).map((s) => (
              <li key={s.id}>
                <button type="button" onClick={() => scrollToSection(s.id)}>
                  <span>{s.label}</span>
                  <span className="leader" aria-hidden="true" />
                  <span>{s.page}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="archive">
          <h3 className="box-head">From the archive</h3>
          {chapters.map((c) => (
            <article key={c.id} className="archive-item">
              <p className="kicker">{c.span}</p>
              <h4>{c.title}</h4>
              <p>{c.detail}</p>
            </article>
          ))}
        </div>
      </aside>

      <article className="lead">
        <p className="kicker">Profile · {profile.title}</p>
        <h2 className="lead-head">“{profile.lede}”</h2>
        <p className="byline">
          By <b>{profile.name}</b> · Växjö, Sweden
        </p>
        <Halftone drawing className="lead-art" caption="Steel poured, then code shipped: the career in one picture." credit="Chronicle illustration">
          <FrontArt />
        </Halftone>
        <div className="lead-body">
          <p className="dropcap">{profile.blurb}</p>
          <p className="lead-jumps">
            <button type="button" className="jump" onClick={() => scrollToSection("projects")}>
              View my work, continued on A5 →
            </button>
            <button type="button" className="jump" onClick={() => scrollToSection("letters")}>
              Get in touch, see Letters, A8 →
            </button>
          </p>
        </div>
      </article>

      <aside className="front-right">
        <div className="box now-box">
          <h3 className="box-head">Now</h3>
          <p className="kicker">{current.dateLabel}</p>
          <h4>{current.title}</h4>
          <p className="now-org">{current.org}</p>
          {current.quest && (
            <>
              <p className="now-quest">“{current.quest.name}”</p>
              <p>{current.quest.objective}</p>
              <p className="now-status">{current.quest.status}</p>
            </>
          )}
          <button type="button" className="jump" onClick={() => scrollToSection("careers")}>
            Full story on A2 →
          </button>
        </div>

        <div className="box">
          <h3 className="box-head">Find the author</h3>
          <ul className="social-list">
            {socialLinks.map((l) => (
              <li key={l.id}>
                <a href={l.href} target="_blank" rel="noreferrer">
                  <SocialIcon link={l} />
                  <span>{l.label}</span>
                  <span className="handle">{l.handle}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </section>
  );
}
