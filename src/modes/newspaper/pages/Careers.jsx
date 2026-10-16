import React from "react";
import "../styles/careers.css";
import SectionFlag from "../components/SectionFlag";
import { experience, education } from "../../../data/journey";
import { orgById } from "../../../data/orgLogos";
import { renderRichText } from "../../../components/richText";

function Story({ entry, lead }) {
  const org = orgById(entry.orgId);
  const { quest } = entry;
  return (
    <article className={`story${lead ? " story-lead" : ""}`}>
      <p className="kicker">
        {entry.dateLabel} · {entry.location}
      </p>
      <h3>{entry.title}</h3>
      <p className="story-deck">
        {entry.org}
        {org?.url && (
          <>
            {" "}
            ·{" "}
            <a href={org.url} target="_blank" rel="noreferrer">
              Visit site ↗
            </a>
          </>
        )}
      </p>
      <div className="story-body">
        <p className="dropcap">{renderRichText(entry.summary, entry.summaryLinks)}</p>
        {quest && (
          <blockquote className="pull">
            <p>“{quest.objective}”</p>
            <footer>
              The brief, “{quest.name}” — <span>{quest.status}</span>
            </footer>
          </blockquote>
        )}
        {quest && (
          <p>
            <b>The constraint.</b> {quest.constraint}
          </p>
        )}
        {entry.bullets?.map((b, i) => (
          <p key={i}>{renderRichText(b.text, b.links)}.</p>
        ))}
        <p className="filed">
          Filed under: {entry.tech.join(", ")}. Material: <i>{entry.material}</i>.
        </p>
      </div>
    </article>
  );
}

export default function Careers() {
  return (
    <section id="careers" className="page careers">
      <SectionFlag id="careers" aside="Work & education" />
      <div className="careers-grid">
        <div className="careers-main">
          {experience.map((e, i) => (
            <Story key={e.id} entry={e} lead={i === 0} />
          ))}
        </div>
        <aside className="notices">
          <h3 className="box-head">Education notices</h3>
          {education.map((e) => {
            const org = orgById(e.orgId);
            return (
              <article key={e.id} className="notice">
                {org && (
                  <span className="notice-mark" data-tone={org.tone}>
                    <img src={org.src} alt={org.label} loading="lazy" />
                  </span>
                )}
                <p className="kicker">
                  {e.dateLabel} · {e.location}
                </p>
                <h4>{e.title}</h4>
                <p className="notice-org">
                  {org?.url ? (
                    <a href={org.url} target="_blank" rel="noreferrer">
                      {e.org}
                    </a>
                  ) : (
                    e.org
                  )}
                </p>
                {e.quest && <p className="notice-quest">“{e.quest.name}” — {e.quest.objective}</p>}
                <p>{e.summary}</p>
                <p className="filed">Filed under: {e.tech.join(", ")}.</p>
              </article>
            );
          })}
        </aside>
      </div>
    </section>
  );
}
