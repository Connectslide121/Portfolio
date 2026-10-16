import React, { useState } from "react";
import "../styles/experience.css";
import SectionHead from "../components/SectionHead";
import { experience, education } from "../../../data/journey";
import { orgById } from "../../../data/orgLogos";
import { renderRichText } from "../../../components/richText";

/** "2025 - Present" -> ["2025", "Present"] */
const years = (label) => label.split(/\s*[-—]\s*/);

function Entry({ entry, open, onToggle, current }) {
  const org = orgById(entry.orgId);
  const [from, to] = years(entry.dateLabel);
  const panelId = `${entry.id}-panel`;
  const { quest } = entry;

  return (
    <li className={`entry${open ? " is-open" : ""}${current ? " is-current" : ""}`} data-reveal>
      <button type="button" className="entry-row" aria-expanded={open} aria-controls={panelId} onClick={onToggle}>
        <span className="entry-years">
          <span>{from}</span>
          <span className="entry-to">— {to}</span>
        </span>
        <span className="entry-role">
          <span className="entry-title">{entry.title}</span>
          <span className="entry-org">
            {entry.org} · {entry.location}
          </span>
        </span>
        <span className="entry-material">{entry.material}</span>
        <span className="entry-toggle" aria-hidden="true" />
      </button>

      <div className="entry-panel" id={panelId} hidden={!open}>
        <div className="entry-side">
          {org && (
            <span className="entry-logo" data-tone={org.tone}>
              <img src={org.src} alt={org.label} loading="lazy" />
            </span>
          )}
          {org?.url && (
            <a className="link-arrow" href={org.url} target="_blank" rel="noreferrer">
              Visit site ↗
            </a>
          )}
          {quest && (
            <p className={`entry-status${quest.status === "In progress" ? " is-live" : ""}`}>{quest.status}</p>
          )}
        </div>

        <div className="entry-body">
          {quest && (
            <div className="quest">
              <p className="quest-name">“{quest.name}”</p>
              <dl>
                <dt>Constraint</dt>
                <dd>{quest.constraint}</dd>
                <dt>Objective</dt>
                <dd>{quest.objective}</dd>
              </dl>
            </div>
          )}
          <p className="entry-summary">{renderRichText(entry.summary, entry.summaryLinks)}</p>
          {entry.bullets && (
            <ul className="entry-bullets">
              {entry.bullets.map((b, i) => (
                <li key={i}>{renderRichText(b.text, b.links)}</li>
              ))}
            </ul>
          )}
          <ul className="tag-list">
            {entry.tech.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
          <p className="entry-material-full">
            Material: <strong>{entry.material}</strong>
          </p>
        </div>
      </div>
    </li>
  );
}

function Table({ caption, entries, openId, setOpenId, markCurrent }) {
  return (
    <div className="wrap entries-block">
      <h3 className="entries-caption" data-reveal>
        {caption}
        <span>{String(entries.length).padStart(2, "0")}</span>
      </h3>
      <ol className="entries">
        {entries.map((e, i) => (
          <Entry
            key={e.id}
            entry={e}
            current={markCurrent && i === 0}
            open={openId === e.id}
            onToggle={() => setOpenId(openId === e.id ? null : e.id)}
          />
        ))}
      </ol>
    </div>
  );
}

export default function Experience() {
  const [openId, setOpenId] = useState(experience[0].id);

  return (
    <section id="experience" className="section">
      <SectionHead num="02" title="Experience" aside="Open a row for the full brief">
        <p>From a sand casting foundry in the Basque Country to leading a product platform in Sweden.</p>
      </SectionHead>
      <Table caption="Work" entries={experience} openId={openId} setOpenId={setOpenId} markCurrent />
      <Table caption="Education" entries={education} openId={openId} setOpenId={setOpenId} />
    </section>
  );
}
