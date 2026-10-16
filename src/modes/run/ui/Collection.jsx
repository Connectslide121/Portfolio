import React, { useState } from "react";
import Panel from "./Panel";
import ProjectMedia from "../components/ProjectMedia";
import { STAGES, stageInfo } from "../run/level";
import { featuredProjects, allProjects } from "../../../components/projectList";
import { toolCategories, toolsIntro } from "../../../data/tools";
import { techFor } from "../../../data/projectTech";
import { projectsIntro } from "../../../data/site";

const PROJECTS = [...featuredProjects.map((p) => ({ ...p, featured: true })), ...allProjects];
const LINKS = [
  ["livedemo", null],
  ["repository", "Source code"],
  ["npm", "npm"],
  ["play", "Play"],
];

/**
 * Everything collectable, found or not yet. Found things are shown in full;
 * the rest are shown greyed — this is a portfolio, nothing is hidden.
 */
export default function Collection({ skills, coins, onClose }) {
  const [tab, setTab] = useState("projects");
  const [sel, setSel] = useState(null);
  const p = sel && PROJECTS.find((x) => x.title === sel);

  return (
    <Panel title="Collection" onClose={onClose} wide className="collection">
      <div className="tabs" role="tablist">
        {[
          ["projects", `Projects ${coins.length}/${PROJECTS.length}`],
          ["skills", `Skills ${skills.length}`],
          ["tools", "Toolbox"],
        ].map(([id, label]) => (
          <button key={id} type="button" role="tab" aria-selected={tab === id} className="nes-btn" onClick={() => setTab(id)}>
            {label}
          </button>
        ))}
      </div>

      {tab === "projects" && !p && (
        <>
          <p className="note">{projectsIntro.text}</p>
          <ul className="coin-grid">
            {PROJECTS.map((x) => {
              const got = coins.includes(x.title);
              return (
                <li key={x.title}>
                  <button type="button" className={`coin-card${got ? " is-got" : ""}`} onClick={() => setSel(x.title)}>
                    <span className={`big-coin${x.featured ? " is-featured" : ""}`} aria-hidden="true" />
                    <span className="cc-title">{x.title}</span>
                    <span className="cc-meta">{got ? x.date : "not found yet"}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </>
      )}

      {tab === "projects" && p && (
        <div className="project-view">
          <div className="pv-media">
            <ProjectMedia title={p.title} className="media" />
          </div>
          <div className="pv-info">
            <h3>{p.title}</h3>
            <p className="cc-meta">
              {p.category || "Web App"} · {p.date}
            </p>
            <p>{p.description.trim()}</p>
            <p className="cc-meta">{(p.technologies || []).map((t) => techFor(t)?.name || t).join(" · ")}</p>
            <p className="pv-links">
              {LINKS.filter(([k]) => p[k]).map(([k, label]) => (
                <a key={k} className="nes-btn is-gold" href={p[k]} target="_blank" rel="noopener noreferrer">
                  {label || p.button || "Live demo"} ↗
                </a>
              ))}
            </p>
            <button type="button" className="nes-btn" onClick={() => setSel(null)}>
              ◀ All projects
            </button>
          </div>
        </div>
      )}

      {tab === "skills" && (
        <div className="skill-stages">
          {STAGES.filter((s) => !s.quiet).map((s) => {
            const info = stageInfo(s);
            return (
              <section key={s.id}>
                <h4>
                  {info.when} · {info.title}
                </h4>
                <ul>
                  {info.tech.map((t) => {
                    const got = skills.some((k) => k.skill === t && k.stage === s.id);
                    return (
                      <li key={t} className={got ? "is-got" : ""}>
                        <span className="mini-q" aria-hidden="true">
                          {got ? "✓" : "?"}
                        </span>
                        {t}
                      </li>
                    );
                  })}
                </ul>
              </section>
            );
          })}
        </div>
      )}

      {tab === "tools" && (
        <>
          <p className="note">{toolsIntro.tagline}</p>
          <div className="toolbox">
            {toolCategories.map((c) => (
              <section key={c.name}>
                <h4>{c.name}</h4>
                <ul>
                  {c.tools.map((t) => (
                    <li key={t.name}>
                      <img src={t.image} alt="" width="22" height="22" />
                      {t.name}
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </>
      )}
    </Panel>
  );
}
