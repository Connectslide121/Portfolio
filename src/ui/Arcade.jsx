import React, { useState } from "react";
import Panel from "./Panel";
import ProjectMedia from "../components/ProjectMedia";
import { featuredProjects, allProjects } from "../components/projectList";
import { techFor } from "../data/projectTech";
import { projectsIntro } from "../data/site";

const ALL = [...featuredProjects.map((p) => ({ ...p, featured: true })), ...allProjects];
const LINKS = [
  ["livedemo", null],
  ["repository", "Source code"],
  ["npm", "npm"],
  ["play", "Play"],
];

/** Every project as an arcade cabinet. Pick one to see it running. */
export default function Arcade({ onClose, onPlay }) {
  const [sel, setSel] = useState(null);
  const p = sel && ALL.find((x) => x.title === sel);

  return (
    <Panel title={p ? p.title : `Arcade · ${ALL.length} cabinets`} onClose={onClose} wide className="arcade">
      {!p ? (
        <>
          <p className="panel-note">{projectsIntro.text}</p>
          <ul className="cabinets">
            {ALL.map((x, i) => (
              <li key={x.title}>
                <button
                  type="button"
                  className={`cabinet c-${i % 6}`}
                  onClick={() => {
                    setSel(x.title);
                    onPlay?.(x.title);
                  }}
                >
                  <span className="cab-marquee">{x.featured ? "★ HOT ★" : x.category || "Web App"}</span>
                  <span className="cab-screen">
                    <span>{x.title}</span>
                  </span>
                  <span className="cab-controls" aria-hidden="true">
                    <i />
                    <i />
                    <i />
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <div className="cab-detail">
          <div className="cab-big">
            <ProjectMedia title={p.title} className="media" />
          </div>
          <div className="cab-info">
            <p className="q-status">
              {p.category || "Web App"} · {p.date}
              {p.featured && " · ★ featured"}
            </p>
            <p>{p.description.trim()}</p>
            <ul className="chips">
              {(p.technologies || []).map((t) => (
                <li key={t}>{techFor(t)?.name || t}</li>
              ))}
            </ul>
            <p className="cab-links">
              {LINKS.filter(([k]) => p[k]).map(([k, label]) => (
                <a key={k} className="rpg-btn" href={p[k]} target="_blank" rel="noopener noreferrer">
                  ▸ {label || p.button || "Live demo"}
                </a>
              ))}
            </p>
            <button type="button" className="rpg-btn ghost" onClick={() => setSel(null)}>
              ◂ All cabinets
            </button>
          </div>
        </div>
      )}
    </Panel>
  );
}
