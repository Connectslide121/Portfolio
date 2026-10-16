import React from "react";
import "../styles/about.css";
import Sheet from "../components/Sheet";
import { chapters } from "../../../data/journey";
import { toolCategories, toolsIntro } from "../../../data/tools";

// Flowchart symbols, one per act: a terminator to start, a decision for
// the reset, a process box for what runs now.
const SHAPE = { steel: "terminator", reset: "decision", software: "process" };
const SECTIONS = "ABCDE";

export default function About() {
  return (
    <Sheet id="about" title="Process & parts" intro={toolsIntro.tagline} scale="NTS">
      <h3 className="sub-head" data-reveal>
        <span>Fig. 2</span> Process flow, {chapters[0].span.split(" ")[0]} — today
      </h3>
      <ol className="flow" data-reveal>
        {chapters.map((c, i) => (
          <li key={c.id} className={`flow-step shape-${SHAPE[c.id]}`}>
            <span className="flow-symbol" aria-hidden="true" />
            <div className="flow-body">
              <p className="flow-span">{c.span}</p>
              <h4>{c.title}</h4>
              <p>{c.detail}</p>
            </div>
            {i < chapters.length - 1 && <span className="flow-arrow" aria-hidden="true" />}
          </li>
        ))}
      </ol>

      <h3 className="sub-head" data-reveal>
        <span>Table 1</span> Parts list — {toolsIntro.title}
      </h3>
      <div className="bom">
        {toolCategories.map((cat, ci) => (
          <section key={cat.name} className="bom-group" data-reveal>
            <h4>
              <span className="bom-sec">Sec. {SECTIONS[ci]}</span>
              {cat.name}
              <span className="bom-qty">Qty {cat.tools.length}</span>
            </h4>
            <ol>
              {cat.tools.map((tool, ti) => (
                <li key={tool.name}>
                  <span className="bom-ref">
                    {SECTIONS[ci]}-{String(ti + 1).padStart(2, "0")}
                  </span>
                  <span className="bom-mark">
                    <img src={tool.image} alt="" width="22" height="22" decoding="async" />
                  </span>
                  <span className="bom-name">{tool.name}</span>
                </li>
              ))}
            </ol>
          </section>
        ))}
      </div>
    </Sheet>
  );
}
