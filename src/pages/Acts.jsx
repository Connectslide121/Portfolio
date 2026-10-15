import React from "react";
import "../styles/acts.css";
import SectionHead from "../components/SectionHead";
import ActBody from "../art/ActBody";
import { chapters } from "../data/journey";

export default function Acts() {
  return (
    <section id="acts" className="section">
      <SectionHead sign="☉ ☾ ✦" title="Three ages">
        <p>Steel, a reset, then software.</p>
      </SectionHead>
      <ol className="acts">
        {chapters.map((c) => (
          <li key={c.id}>
            <ActBody id={c.id} label={`${c.title}: ${c.detail}`} />
            <p className="act-span">{c.span}</p>
            <h3>{c.title}</h3>
            <p>{c.detail}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
