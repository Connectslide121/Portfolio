import React, { useRef } from "react";
import { gsap, useMotion } from "../motion";
import OrgMark from "../components/OrgMark";
import { education, experience } from "../../../data/journey";

const rows = [...experience.map((e) => ({ ...e, type: "Work" })), ...education.map((e) => ({ ...e, type: "Training" }))];

/** The CV in brief: every role and course, one row each, newest work first. */
export default function Record() {
  const ref = useRef(null);

  useMotion(ref, () => {
    gsap.from(ref.current.querySelectorAll(".cv-row"), { y: 30, autoAlpha: 0, duration: 0.8, ease: "expo.out", stagger: 0.06, scrollTrigger: { trigger: ref.current, start: "top 75%" } });
  });

  return (
    <section id="record" className="section record" ref={ref}>
      <div className="wrap">
        <header className="record-head">
          <p className="eyebrow">
            <span>07</span>Record
          </p>
          <h2>The CV, in brief.</h2>
        </header>
        <ol className="cv">
          {rows.map((e) => (
            <li key={e.id} id={e.id} className="cv-row">
              <span className="cv-date">{e.dateLabel.replace(" - ", "–")}</span>
              <OrgMark id={e.orgId} />
              <span className="cv-title">{e.title}</span>
              <span className="cv-org">
                {e.org} · {e.location}
              </span>
              <span className="cv-type">{e.type}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
