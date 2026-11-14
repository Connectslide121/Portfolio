import React from "react";
import OrgMark from "../components/OrgMark";
import SectionHead from "../components/SectionHead";
import { renderRichText } from "../../../components/richText";
import { education, experience } from "../../../data/journey";

/** The heat of an entry, as a gauge at the row's right edge. */
function Gauge({ heat }) {
  return (
    <span className="gauge" aria-hidden="true" style={{ "--g": heat }}>
      <i />
    </span>
  );
}

export default function Record() {
  return (
    <section id="record" className="section record">
      <div className="wrap">
        <SectionHead num="03" label="Record" title="Where I have worked">
          <p>Newest first. The gauge on each row is its heat: full for the foundry years, cold for today.</p>
        </SectionHead>

        <ol className="rows" aria-label="Experience">
          {experience.map((e) => (
            <li key={e.id} id={e.id} className="row" data-reveal>
              <p className="row-date">{e.dateLabel.replace(" - ", "–")}</p>
              <OrgMark id={e.orgId} />
              <div className="row-body">
                <h3>{e.title}</h3>
                <p className="row-org">
                  {e.org} · {e.location}
                </p>
                <p className="row-summary">{renderRichText(e.summary, e.summaryLinks)}</p>
                <ul className="row-points">
                  {e.bullets.map((b) => (
                    <li key={b.text}>{renderRichText(b.text, b.links)}</li>
                  ))}
                </ul>
                <ul className="chips" aria-label="Technologies and skills">
                  {e.tech.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>
              <Gauge heat={e.heat} />
            </li>
          ))}
        </ol>

        <h3 className="rows-head" data-reveal>
          Training
        </h3>
        <ol className="rows rows-compact" aria-label="Education">
          {education.map((e) => (
            <li key={e.id} id={e.id} className="row" data-reveal>
              <p className="row-date">{e.dateLabel.replace(" - ", "–")}</p>
              <OrgMark id={e.orgId} />
              <div className="row-body">
                <h4>{e.title}</h4>
                <p className="row-org">
                  {e.org} · {e.location}
                </p>
                <p className="row-summary">{e.summary}</p>
              </div>
              <Gauge heat={e.heat} />
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
