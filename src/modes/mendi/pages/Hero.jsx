import React, { useRef } from "react";
import Landscape from "../art/Landscape";
import { blurbOpening, degrees } from "../components/copy";
import { useLocalTime, useParallax } from "../components/hooks";
import { beats, profile } from "../../../data/journey";
import { contact } from "../../../data/site";

// The two halves of the story, set in italics inside the headline.
const EMPHASIS = /(steel|production code)/;
const home = beats.find((b) => b.id === "intro")?.coords;

export default function Hero() {
  const ref = useRef(null);
  const time = useLocalTime();
  useParallax(ref);

  return (
    <section id="top" className="hero" ref={ref}>
      <Landscape />

      <div className="wrap hero-copy">
        <h1>
          <span className="hero-kicker">
            <b>{profile.name}</b>
            <span>{profile.title}</span>
          </span>
          <span className="hero-lede">{profile.lede.split(EMPHASIS).map((part, i) => (EMPHASIS.test(part) ? <em key={i}>{part}</em> : part))}</span>
        </h1>
        <p className="hero-sub">{blurbOpening}</p>
        <div className="hero-actions">
          <a className="btn" href="#projects">
            See the work <span aria-hidden="true">→</span>
          </a>
          <a className="btn btn-ghost" href="#contact">
            Get in touch
          </a>
        </div>
        <p className="field-note">
          <span className="pulse" aria-hidden="true" />
          <span>{contact.location}</span>
          {home && (
            <span>
              {degrees(home.lat, "N", "S")}, {degrees(home.lon, "E", "W")}
            </span>
          )}
          <span>
            <time>{time}</time> local time
          </span>
        </p>
      </div>

      <a className="hero-scroll" href="#story">
        The story <span aria-hidden="true">↓</span>
      </a>
    </section>
  );
}
