import React from "react";
import "../styles/about.css";
import { chapters } from "../data/journey";
import { toolCategories, toolsIntro } from "../data/tools";

const NOTE_COLORS = ["orange", "pink", "blue"];
const SHEET_COLORS = ["pink", "blue", "green", "yellow", "purple"];

export default function About() {
  return (
    <section id="about" className="section">
      <h2 className="section-title">
        <span className="tag tag-xl bg-pink">The story</span>
        <span className="hand">in three chapters</span>
      </h2>
      <ol className="notes">
        {chapters.map((c, i) => (
          <li key={c.id} className={`note bg-${NOTE_COLORS[i]}`} style={{ "--tilt": `${[-2.5, 1.5, -1][i]}deg` }}>
            <span className="tape" aria-hidden="true" />
            <span className="note-num">0{i + 1}</span>
            <p className="note-span">{c.span}</p>
            <h3>{c.title}</h3>
            <p>{c.detail}</p>
          </li>
        ))}
      </ol>

      <h2 className="section-title">
        <span className="tag tag-xl bg-green">{toolsIntro.title}</span>
        <span className="hand">{toolsIntro.tagline}</span>
      </h2>
      <div className="sheets">
        {toolCategories.map((cat, i) => (
          <section key={cat.name} className={`sheet bg-${SHEET_COLORS[i % SHEET_COLORS.length]}`}>
            <h3>
              {cat.name}
              <span className="count">{cat.tools.length}</span>
            </h3>
            <ul>
              {cat.tools.map((t, ti) => (
                <li key={t.name} className="tool-sticker" style={{ "--tilt": `${((ti * 37) % 15) - 7}deg` }}>
                  <span className="tool-disc">
                    <img src={t.image} alt="" width="34" height="34" decoding="async" />
                  </span>
                  <span className="tool-name">{t.name}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </section>
  );
}
