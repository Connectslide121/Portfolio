import React from "react";
import "../styles/experience.css";
import Sheet from "../components/Sheet";
import CareerChain from "../art/CareerChain";
import RevCloud from "../art/RevCloud";
import { experience, education } from "../data/journey";
import { orgById } from "../data/orgLogos";
import { renderRichText } from "../components/richText";

const LETTERS = "ABCDEFGH";

function Detail({ entry, letter }) {
  const org = orgById(entry.orgId);
  const { quest } = entry;
  const live = quest?.status === "In progress";
  const status = quest?.status && <span className="detail-status">Status: {quest.status}</span>;

  return (
    <article className={`detail${live ? " is-live" : ""}`} data-reveal>
      <header className="detail-strip">
        <span className="detail-letter" aria-hidden="true">
          {letter}
        </span>
        <span>Detail {letter}</span>
        <span className="detail-date">{entry.dateLabel}</span>
        <span className="detail-loc">{entry.location}</span>
        {status && (live ? <RevCloud className="status-cloud">{status}</RevCloud> : status)}
      </header>

      <div className="detail-main">
        <div className="detail-id">
          <h3>{entry.title}</h3>
          <p className="detail-org">{entry.org}</p>
          {org && (
            <div className="detail-mark">
              <span className="logo-plate" data-tone={org.tone}>
                <img src={org.src} alt={org.label} loading="lazy" />
              </span>
              {org.url && (
                <a href={org.url} target="_blank" rel="noreferrer" className="text-link">
                  [ Visit site ↗ ]
                </a>
              )}
            </div>
          )}
        </div>

        <div className="detail-spec">
          {quest && (
            <div className="spec">
              <p className="spec-name">Spec. “{quest.name}”</p>
              <dl>
                <dt>Constraint</dt>
                <dd>{quest.constraint}</dd>
                <dt>Objective</dt>
                <dd>{quest.objective}</dd>
              </dl>
            </div>
          )}
          <div className="notes">
            <p className="notes-label">Notes</p>
            <p className="notes-summary">{renderRichText(entry.summary, entry.summaryLinks)}</p>
            {entry.bullets && (
              <ol>
                {entry.bullets.map((b, i) => (
                  <li key={i}>{renderRichText(b.text, b.links)}</li>
                ))}
              </ol>
            )}
          </div>
        </div>
      </div>

      <footer className="detail-foot">
        <p>
          <span className="foot-label">Material</span> {entry.material}
        </p>
        <ul className="tag-list">
          {entry.tech.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </footer>
    </article>
  );
}

export default function Experience() {
  return (
    <Sheet id="experience" title="Revision history" intro="Work and education, dimensioned in years.">
      <h3 className="sub-head" data-reveal>
        <span>Fig. 3</span> Career, chain-dimensioned
      </h3>
      <div data-reveal>
        <CareerChain />
      </div>

      <h3 className="sub-head" data-reveal>
        <span>Details</span> Work
      </h3>
      <div className="details">
        {experience.map((e, i) => (
          <Detail key={e.id} entry={e} letter={LETTERS[i]} />
        ))}
      </div>

      <h3 className="sub-head" data-reveal>
        <span>Details</span> Education
      </h3>
      <div className="details">
        {education.map((e, i) => (
          <Detail key={e.id} entry={e} letter={LETTERS[experience.length + i]} />
        ))}
      </div>
    </Sheet>
  );
}
