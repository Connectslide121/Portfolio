import React, { useState } from "react";
import "../styles/projects.css";
import Sheet from "../components/Sheet";
import ProjectMedia from "../components/ProjectMedia";
import ProjectLinks from "../components/ProjectLinks";
import { featuredProjects, allProjects } from "../../../components/projectList";
import { techFor } from "../../../data/projectTech";
import { projectsIntro } from "../../../data/site";

const pad = (n) => String(n).padStart(2, "0");
const techName = (t) => techFor(t)?.name || t;
const dwg = (n) => `JM-04-${pad(n)}`;

function Plate({ project, n }) {
  return (
    <article className="plate" data-reveal>
      <div className="plate-figure">
        <span className="dim-h" aria-hidden="true">
          <span>{project.category || "Web App"}</span>
        </span>
        <span className="dim-v" aria-hidden="true">
          <span>{project.date}</span>
        </span>
        <div className="plate-frame">
          <ProjectMedia title={project.title} className="media" />
          <span className="crop crop-tl" />
          <span className="crop crop-tr" />
          <span className="crop crop-bl" />
          <span className="crop crop-br" />
        </div>
      </div>
      <div className="plate-text">
        <p className="plate-dwg">
          Dwg {dwg(n)} · {project.category || "Web App"} · {project.date}
        </p>
        <h3>{project.title}</h3>
        <p className="plate-desc">{project.description}</p>
        <p className="plate-material">
          <span className="foot-label">Material</span>
          {(project.technologies || []).map(techName).join(" · ")}
        </p>
        <ProjectLinks project={project} />
      </div>
    </article>
  );
}

function Register({ projects, offset }) {
  const [open, setOpen] = useState(null);
  return (
    <div className="register" data-reveal>
      <div className="register-head" aria-hidden="true">
        <span>Dwg no.</span>
        <span>Title</span>
        <span>Type</span>
        <span>Material</span>
        <span>Date</span>
      </div>
      <ol>
        {projects.map((p, i) => {
          const n = offset + i + 1;
          const isOpen = open === p.title;
          const id = `reg-${n}`;
          return (
            <li key={p.title} className={isOpen ? "is-open" : ""}>
              <button
                type="button"
                className="register-row"
                aria-expanded={isOpen}
                aria-controls={id}
                onClick={() => setOpen(isOpen ? null : p.title)}
              >
                <span className="reg-no">{dwg(n)}</span>
                <span className="reg-title">{p.title}</span>
                <span className="reg-type">{p.category || "Web App"}</span>
                <span className="reg-tech">{(p.technologies || []).map(techName).join(" · ")}</span>
                <span className="reg-date">{p.date}</span>
                <span className="reg-toggle" aria-hidden="true">
                  {isOpen ? "−" : "+"}
                </span>
              </button>
              <div className="register-panel" id={id} hidden={!isOpen}>
                {isOpen && (
                  <div className="register-media">
                    <ProjectMedia title={p.title} className="media" />
                  </div>
                )}
                <div className="register-text">
                  <p>{p.description}</p>
                  <ProjectLinks project={p} />
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export default function Projects() {
  return (
    <Sheet id="projects" title={projectsIntro.title} intro={projectsIntro.text}>
      <div className="plates">
        {featuredProjects.map((p, i) => (
          <Plate key={p.title} project={p} n={i + 1} />
        ))}
      </div>

      <h3 className="sub-head" data-reveal>
        <span>Table 2</span> Drawing register — all projects
      </h3>
      <Register projects={allProjects} offset={featuredProjects.length} />
    </Sheet>
  );
}
