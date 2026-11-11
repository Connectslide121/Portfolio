import React from "react";
import { Contours, Fold } from "../art/Scenery";
import SectionHead from "../components/SectionHead";
import { toolCategories, toolsIntro } from "../../../data/tools";

// Marks drawn in light ink (measured: mean luminance above 0.55). They get a
// dark plate; the rest sit on a light one. Keyed by each tool's `alt`.
const LIGHT_ART = new Set(["cosmos db", "llm", "mithril js", "mongodb", "node.js", "rag", "react.js", "react native", "tailwind css", "vector database"]);

export default function Toolkit() {
  return (
    <section id="toolkit" className="section toolkit tint">
      <Fold seed={37} to="tint" />
      <Contours seed={5} />
      <div className="wrap">
        <SectionHead num="04" label="The pack" title={toolsIntro.title}>
          <p>{toolsIntro.tagline}.</p>
        </SectionHead>

        <dl className="tools">
          {toolCategories.map((c) => (
            <div key={c.name} className="tool-group" data-reveal>
              <dt>
                {c.name}
                <small>{String(c.tools.length).padStart(2, "0")}</small>
              </dt>
              <dd>
                <ul>
                  {c.tools.map((t) => (
                    <li key={t.name}>
                      <span className={`tool-icon${LIGHT_ART.has(t.alt) ? " on-dark" : ""}`}>
                        <img src={t.image} alt="" loading="lazy" />
                      </span>
                      {t.name}
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
