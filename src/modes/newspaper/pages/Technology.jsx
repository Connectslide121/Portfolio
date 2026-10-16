import React from "react";
import "../styles/technology.css";
import SectionFlag from "../components/SectionFlag";
import { toolCategories, toolsIntro } from "../../../data/tools";

/** The tools set like the listings pages: small type, tight columns, rules. */
export default function Technology() {
  return (
    <section id="technology" className="page technology">
      <SectionFlag id="technology" title={toolsIntro.title} aside={toolsIntro.tagline} />
      <div className="listings">
        {toolCategories.map((cat) => (
          <section key={cat.name} className="listing">
            <h3>
              {cat.name}
              <span>{cat.tools.length}</span>
            </h3>
            <ul>
              {cat.tools.map((t) => (
                <li key={t.name}>
                  <img src={t.image} alt="" width="16" height="16" decoding="async" />
                  <span>{t.name}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </section>
  );
}
