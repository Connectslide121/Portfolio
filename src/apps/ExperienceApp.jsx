import React, { useState } from "react";
import { Icon } from "../os/PixelArt";
import { experience, education } from "../data/journey";
import { orgById } from "../data/orgLogos";
import { renderRichText } from "../components/richText";

const GROUPS = [
  { id: "work", label: "Work", entries: experience, icon: "briefcase" },
  { id: "education", label: "Education", entries: education, icon: "notepad" },
];

function Details({ entry }) {
  const org = orgById(entry.orgId);
  const { quest } = entry;
  return (
    <article className="xp-detail">
      <header className="xp-head">
        {org && (
          <span className="xp-logo" data-tone={org.tone}>
            <img src={org.src} alt={org.label} loading="lazy" />
          </span>
        )}
        <div>
          <h3>{entry.title}</h3>
          <p>
            {entry.org} · {entry.location} · {entry.dateLabel}
          </p>
        </div>
      </header>

      {quest && (
        <fieldset className="group-box">
          <legend>
            Quest: “{quest.name}” — <span className={quest.status === "In progress" ? "is-live" : ""}>{quest.status}</span>
          </legend>
          <dl className="xp-quest">
            <dt>Constraint:</dt>
            <dd>{quest.constraint}</dd>
            <dt>Objective:</dt>
            <dd>{quest.objective}</dd>
          </dl>
        </fieldset>
      )}

      <p className="xp-summary">{renderRichText(entry.summary, entry.summaryLinks)}</p>

      {entry.bullets && (
        <ul className="xp-bullets">
          {entry.bullets.map((b, i) => (
            <li key={i}>{renderRichText(b.text, b.links)}</li>
          ))}
        </ul>
      )}

      <fieldset className="group-box">
        <legend>Tech</legend>
        <ul className="chips">
          {entry.tech.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </fieldset>

      <div className="xp-foot">
        <span>
          Material: <b>{entry.material}</b>
        </span>
        {org?.url && (
          <a className="btn95 btn95-link" href={org.url} target="_blank" rel="noreferrer">
            Visit site ↗
          </a>
        )}
      </div>
    </article>
  );
}

/** Experience, as an Explorer window: a tree on the left, the record on the right. */
export default function ExperienceApp() {
  const [selected, setSelected] = useState(experience[0].id);
  const all = GROUPS.flatMap((g) => g.entries.map((e) => ({ ...e, group: g.label })));
  const entry = all.find((e) => e.id === selected) || all[0];

  return (
    <div className="explorer">
      <div className="address-bar">
        <span>Address</span>
        <span className="address-field">
          C:\Career\{entry.group}\{entry.org}
        </span>
      </div>
      <div className="explorer-split">
        <ul className="tree" aria-label="Career">
          {GROUPS.map((g) => (
            <li key={g.id}>
              <span className="tree-folder">
                <Icon name="folder" scale={1} /> {g.label}
              </span>
              <ul>
                {g.entries.map((e) => (
                  <li key={e.id}>
                    <button
                      type="button"
                      aria-current={selected === e.id ? "true" : undefined}
                      className={selected === e.id ? "is-selected" : ""}
                      onClick={() => setSelected(e.id)}
                    >
                      <Icon name={g.icon} scale={1} />
                      <span>
                        {e.title}
                        <small>{e.dateLabel}</small>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
        <div className="explorer-pane sunken">
          <Details entry={entry} />
        </div>
      </div>
      <footer className="status-bar">
        <span>{entry.dateLabel}</span>
        <span>{entry.location}</span>
        <span>{all.length} object(s)</span>
      </footer>
    </div>
  );
}
