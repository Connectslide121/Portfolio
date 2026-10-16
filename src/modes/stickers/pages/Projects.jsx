import React, { useState } from "react";
import "../styles/projects.css";
import ProjectMedia from "../components/ProjectMedia";
import ProjectLinks from "../components/ProjectLinks";
import { featuredProjects, allProjects } from "../../../components/projectList";
import { techFor } from "../../../data/projectTech";
import { projectsIntro } from "../../../data/site";

const techName = (t) => techFor(t)?.name || t;

const kind = (p) => {
  const c = p.category || "Web App";
  if (/Game/.test(c)) return "Games";
  if (/Package|API|Console/.test(c)) return "Tools & APIs";
  return "Apps & sites";
};

const FILTERS = [
  { id: "all", label: "Everything", test: () => true, color: "white" },
  { id: "ai", label: "AI", test: (p) => (p.technologies || []).includes("ai"), color: "yellow" },
  { id: "apps", label: "Apps & sites", test: (p) => kind(p) === "Apps & sites", color: "blue" },
  { id: "games", label: "Games", test: (p) => kind(p) === "Games", color: "purple" },
  { id: "tools", label: "Tools & APIs", test: (p) => kind(p) === "Tools & APIs", color: "green" },
];

const ALL = [...featuredProjects.map((p) => ({ ...p, featured: true })), ...allProjects];
const HEADS = ["yellow", "pink", "blue", "green", "orange", "purple"];

export default function Projects() {
  const [filter, setFilter] = useState("all");
  const f = FILTERS.find((x) => x.id === filter);
  const shown = ALL.filter(f.test);

  return (
    <section id="projects" className="section">
      <h2 className="section-title">
        <span className="tag tag-xl bg-green">{projectsIntro.title}</span>
        <span className="hand">{ALL.length} things I made</span>
      </h2>
      <p className="section-intro">{projectsIntro.text}</p>

      <div className="filters" role="group" aria-label="Filter projects">
        {FILTERS.map((x) => (
          <button
            key={x.id}
            type="button"
            className={`chunky chunky-sm bg-${x.color}`}
            aria-pressed={filter === x.id}
            onClick={() => setFilter(x.id)}
          >
            {x.label} <span className="filter-count">{ALL.filter(x.test).length}</span>
          </button>
        ))}
      </div>

      <p className="sr-only" aria-live="polite">
        Showing {shown.length} projects
      </p>

      <div className="cards">
        {shown.map((p, i) => (
          <article key={p.title} className={`card${p.featured ? " is-featured" : ""}`} style={{ "--tilt": `${((i * 53) % 5) - 2}deg` }}>
            <div className={`card-head bg-${HEADS[i % HEADS.length]}`}>
              <span>{p.category || "Web App"}</span>
              <span>{p.date}</span>
            </div>
            <div className="card-media">
              <ProjectMedia title={p.title} className="media" />
              {p.featured && <span className="badge">★ Featured</span>}
            </div>
            <div className="card-body">
              <h3>{p.title}</h3>
              <p>{p.description.trim()}</p>
              <ul className="tech">
                {(p.technologies || []).map((t) => (
                  <li key={t}>{techName(t)}</li>
                ))}
              </ul>
              <ProjectLinks project={p} />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
