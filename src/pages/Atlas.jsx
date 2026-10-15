import React from "react";
import "../styles/atlas.css";
import SectionHead from "../components/SectionHead";
import StarAtlas, { constellations } from "../art/StarAtlas";
import { toolsIntro } from "../data/tools";

export default function Atlas() {
  return (
    <section id="atlas" className="section atlas-section">
      <SectionHead sign="✧" title={toolsIntro.title}>
        <p>{toolsIntro.tagline}</p>
      </SectionHead>
      <div className="atlas-layout">
        <StarAtlas />
        <dl className="atlas-legend">
          {constellations.map((con) => (
            <div key={con.name}>
              <dt>
                <i>{con.latin}</i> · {con.name}
              </dt>
              <dd>
                <ul>
                  {con.stars.map((s) => (
                    <li key={s.tool.name}>
                      <img src={s.tool.image} alt="" width="16" height="16" decoding="async" />
                      {s.tool.name}
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
