import React from "react";
import "../styles/about.css";
import SectionHead from "../components/SectionHead";
import ActPoster from "../art/ActPoster";
import { chapters } from "../../../data/journey";
import { toolCategories, toolsIntro } from "../../../data/tools";

export default function About() {
  return (
    <section id="about" className="section">
      <SectionHead num="01" title="Three acts" aside="2005 — today">
        <p>Steel, a reset, then software.</p>
      </SectionHead>

      <ol className="wrap acts">
        {chapters.map((c, i) => (
          <li key={c.id} className="act" data-reveal style={{ "--d": i }}>
            <ActPoster id={c.id} label={`${c.title}: ${c.detail}`} />
            <div className="act-text">
              <p className="act-span">{c.span}</p>
              <h3>{c.title}</h3>
              <p>{c.detail}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="wrap tools">
        <div className="tools-head" data-reveal>
          <h3>{toolsIntro.title}</h3>
          <p>{toolsIntro.tagline}</p>
        </div>
        <dl className="tools-list">
          {toolCategories.map((cat) => (
            <div key={cat.name} className="tools-row" data-reveal>
              <dt>
                <span className="tools-count">{String(cat.tools.length).padStart(2, "0")}</span>
                {cat.name}
              </dt>
              <dd>
                <ul>
                  {cat.tools.map((tool) => (
                    <li key={tool.name}>
                      <img src={tool.image} alt="" width="20" height="20" decoding="async" />
                      {tool.name}
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
