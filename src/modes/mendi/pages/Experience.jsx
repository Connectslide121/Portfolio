import React from "react";
import { Fold } from "../art/Scenery";
import { heatTone } from "../art/terrain";
import OrgMark from "../components/OrgMark";
import SectionHead from "../components/SectionHead";
import { renderRichText } from "../../../components/richText";
import { education, experience } from "../../../data/journey";

export default function Experience() {
  return (
    <section id="experience" className="section experience tint">
      <Fold seed={11} to="tint" />
      <div className="wrap">
        <SectionHead
          num="02"
          label="The climb"
          title={
            <>
              Where I have <em>worked</em>.
            </>
          }
        >
          <p>Newest first. The colour of each entry is its temperature: ember for the foundry years, glacier for today.</p>
        </SectionHead>

        <ol className="roles">
          {experience.map((e) => (
            <li key={e.id} id={e.id} className="role" data-reveal style={{ "--tone": heatTone(e.heat) }}>
              <div className="role-meta">
                <p className="role-date">{e.dateLabel}</p>
                <p className="role-place">{e.location}</p>
                <OrgMark id={e.orgId} />
                <p className="role-material">
                  <span>Material</span>
                  {e.material}
                </p>
              </div>
              <div className="role-body">
                <h3>{e.title}</h3>
                <p className="role-org">{e.org}</p>
                <p className="role-summary">{renderRichText(e.summary, e.summaryLinks)}</p>
                <ul className="role-points">
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
            </li>
          ))}
        </ol>

        <div className="schools">
          <h3 className="sub-head" data-reveal>
            Where I <em>learned</em>
          </h3>
          <ol className="school-list">
            {education.map((e) => (
              <li key={e.id} id={e.id} className="school" data-reveal style={{ "--tone": heatTone(e.heat) }}>
                <div className="school-top">
                  <p className="role-date">{e.dateLabel}</p>
                  <OrgMark id={e.orgId} />
                </div>
                <h4>{e.title}</h4>
                <p className="role-org">
                  {e.org} · {e.location}
                </p>
                <p className="school-summary">{e.summary}</p>
                <ul className="chips" aria-label="Subjects">
                  {e.tech.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
