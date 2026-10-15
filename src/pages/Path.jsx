import React from "react";
import "../styles/path.css";
import SectionHead from "../components/SectionHead";
import { experience, education } from "../data/journey";
import { orgById } from "../data/orgLogos";
import { renderRichText } from "../components/richText";

const start = (e) => Number(e.dateLabel.slice(0, 4));

// Work and education on one path, newest first: the comet's head is today,
// its tail runs back through the foundry years.
const entries = [...experience.map((e) => ({ ...e, kind: "Work" })), ...education.map((e) => ({ ...e, kind: "Education" }))].sort(
  (a, b) => start(b) - start(a),
);

/**
 * heat 0 (today) is ice blue, heat 1 (the foundry) is molten orange — the
 * long way round the colour wheel, through violet and rose, never green.
 */
const heatColor = (h) => `hsl(${(210 + h * 175) % 360} ${70 + h * 25}% ${72 - h * 12}%)`;

export default function Path() {
  return (
    <section id="path" className="section">
      <SectionHead sign="☄" title="The path">
        <p>Work and education on one trajectory, from today back to the foundry.</p>
      </SectionHead>
      <ol className="path">
        {entries.map((e, i) => {
          const org = orgById(e.orgId);
          const { quest } = e;
          return (
            <li key={e.id} className={`path-entry${i === 0 ? " is-now" : ""}`} style={{ "--heat": heatColor(e.heat) }}>
              <span className="path-node" aria-hidden="true" />
              <div className="path-when">
                <p className="path-date">{e.dateLabel}</p>
                <p className="path-kind">
                  {e.kind} · {e.location}
                </p>
              </div>
              <article className="path-card">
                <header>
                  {org && (
                    <span className="path-mark" data-tone={org.tone}>
                      <img src={org.src} alt={org.label} loading="lazy" />
                    </span>
                  )}
                  <div>
                    <h3>{e.title}</h3>
                    <p className="path-org">
                      {org?.url ? (
                        <a href={org.url} target="_blank" rel="noreferrer">
                          {e.org} ↗
                        </a>
                      ) : (
                        e.org
                      )}
                    </p>
                  </div>
                </header>
                {quest && (
                  <div className="path-quest">
                    <p className="path-quest-name">
                      “{quest.name}” <span className={quest.status === "In progress" ? "is-live" : ""}>{quest.status}</span>
                    </p>
                    <dl>
                      <dt>Constraint</dt>
                      <dd>{quest.constraint}</dd>
                      <dt>Objective</dt>
                      <dd>{quest.objective}</dd>
                    </dl>
                  </div>
                )}
                <p className="path-summary">{renderRichText(e.summary, e.summaryLinks)}</p>
                {e.bullets && (
                  <ul className="path-bullets">
                    {e.bullets.map((b, bi) => (
                      <li key={bi}>{renderRichText(b.text, b.links)}</li>
                    ))}
                  </ul>
                )}
                <ul className="chips">
                  {e.tech.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
                <p className="path-material">
                  Material: <b>{e.material}</b>
                </p>
              </article>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
