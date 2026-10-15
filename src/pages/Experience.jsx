import React, { useState } from "react";
import "../styles/experience.css";
import { experience, education } from "../data/journey";
import { orgById } from "../data/orgLogos";
import { renderRichText } from "../components/richText";

const COLORS = ["yellow", "blue", "orange", "green", "purple", "pink"];

function Ticket({ entry, color, open, onToggle }) {
  const org = orgById(entry.orgId);
  const { quest } = entry;
  const live = quest?.status === "In progress";
  const id = `${entry.id}-more`;
  return (
    <article className={`ticket${open ? " is-open" : ""}`}>
      <div className={`ticket-stub bg-${color}`}>
        <p className="stub-date">{entry.dateLabel}</p>
        <p className="stub-place">{entry.location}</p>
        {org && (
          <span className="stub-mark" data-tone={org.tone}>
            <img src={org.src} alt={org.label} loading="lazy" />
          </span>
        )}
      </div>
      <div className="ticket-main">
        {quest && <span className={`stamp${live ? " is-live" : ""}`}>{quest.status}</span>}
        <h3>{entry.title}</h3>
        <p className="ticket-org">
          {entry.org}
          {org?.url && (
            <>
              {" "}
              ·{" "}
              <a href={org.url} target="_blank" rel="noreferrer">
                visit site ↗
              </a>
            </>
          )}
        </p>
        {quest && (
          <div className="quest">
            <p className="hand quest-name">“{quest.name}”</p>
            <p>
              <b>Constraint:</b> {quest.constraint}
            </p>
            <p>
              <b>Objective:</b> {quest.objective}
            </p>
          </div>
        )}
        <p className="ticket-summary">{renderRichText(entry.summary, entry.summaryLinks)}</p>
        {entry.bullets && (
          <>
            <div id={id} className="ticket-more" hidden={!open}>
              <ul>
                {entry.bullets.map((b, i) => (
                  <li key={i}>{renderRichText(b.text, b.links)}</li>
                ))}
              </ul>
            </div>
            <button type="button" className="chunky chunky-sm bg-white" aria-expanded={open} aria-controls={id} onClick={onToggle}>
              {open ? "Less ↑" : `What I did (${entry.bullets.length}) ↓`}
            </button>
          </>
        )}
        <ul className="tech">
          {entry.tech.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
        <p className="material">
          made of: <b>{entry.material}</b>
        </p>
      </div>
    </article>
  );
}

export default function Experience() {
  const [open, setOpen] = useState(experience[0].id);
  const toggle = (id) => setOpen((o) => (o === id ? null : id));
  return (
    <section id="experience" className="section">
      <h2 className="section-title">
        <span className="tag tag-xl bg-blue">Experience</span>
        <span className="hand">foundry → code</span>
      </h2>
      <div className="tickets">
        {experience.map((e, i) => (
          <Ticket key={e.id} entry={e} color={COLORS[i]} open={open === e.id} onToggle={() => toggle(e.id)} />
        ))}
      </div>
      <h2 className="section-title">
        <span className="tag tag-xl bg-purple">Education</span>
      </h2>
      <div className="tickets">
        {education.map((e, i) => (
          <Ticket key={e.id} entry={e} color={COLORS[i + 3]} />
        ))}
      </div>
    </section>
  );
}
