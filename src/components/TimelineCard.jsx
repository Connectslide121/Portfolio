import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUpRightFromSquare,
  faCalendarAlt,
  faMapMarkerAlt,
} from "@fortawesome/free-solid-svg-icons";
import { renderRichText } from "./richText";
import OrgMark from "./OrgMark";
import { orgById } from "../data/orgLogos";

/**
 * One entry in the résumé timeline, rendered from src/data/journey.js.
 *
 * `--cardHeat` carries the entry's hot -> cold position so the marker, dates
 * and tech tags pick up a molten tint on the early entries and cool to the
 * site's blue on the recent ones (Phase 3 in docs/JOURNEY_PLAN.md).
 */
export default function TimelineCard({ entry, current = false }) {
  const { quest } = entry;
  // One canonical link per organisation, shared with the logo marks.
  const org = orgById(entry.orgId);

  return (
    <div className="timeline-item" style={{ "--cardHeat": entry.heat }}>
      <div className={`timeline-marker${current ? " current" : ""}`}></div>
      <div className="timeline-content">
        <div className="experience-card">
          <div className="experience-header">
            <div className="experience-meta">
              <div className="experience-date">
                <FontAwesomeIcon icon={faCalendarAlt} />
                <span>{entry.dateLabel}</span>
              </div>
              <div className="experience-location">
                <FontAwesomeIcon icon={faMapMarkerAlt} />
                <span>{entry.location}</span>
              </div>
            </div>
            {org?.url && (
              <a
                href={org.url}
                target="_blank"
                rel="noreferrer"
                title={`${org.label} — opens in a new tab`}
                className="visit-link"
              >
                Visit site
                <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
              </a>
            )}
          </div>

          <div className="experience-title">
            <h3>{entry.title}</h3>
            <div className="experience-org">
              <OrgMark id={entry.orgId} size="md" />
              <h4>{entry.org}</h4>
            </div>
          </div>

          {quest && (
            <div className="quest-block">
              <p className="quest-name">
                <span className="quest-title">“{quest.name}”</span>
                <span className={`quest-status${quest.status === "In progress" ? " active" : ""}`}>
                  {quest.status}
                </span>
              </p>
              <dl className="quest-brief">
                <dt>Constraint</dt>
                <dd>{quest.constraint}</dd>
                <dt>Objective</dt>
                <dd>{quest.objective}</dd>
              </dl>
            </div>
          )}

          <div className="experience-description">
            <p className="experience-summary">
              {renderRichText(entry.summary, entry.summaryLinks)}
            </p>

            {entry.bullets && (
              <ul className="experience-bullets">
                {entry.bullets.map((bullet, i) => (
                  <li key={i}>{renderRichText(bullet.text, bullet.links)}</li>
                ))}
              </ul>
            )}

            <div className="tech-stack">
              {entry.tech.map((tag) => (
                <span className="tech-tag" key={tag}>
                  {tag}
                </span>
              ))}
            </div>

            <p className="card-material">
              material: <strong>{entry.material}</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
