import React from "react";
import "../styles/catalogue.css";
import SectionHead from "../components/SectionHead";
import ProjectMedia from "../components/ProjectMedia";
import ProjectLinks from "../components/ProjectLinks";
import { featuredProjects, allProjects } from "../components/projectList";
import { techFor } from "../data/projectTech";
import { projectsIntro } from "../data/site";

const techName = (t) => techFor(t)?.name || t;

function Body({ project, n, major }) {
  return (
    <article id={`obj-${n}`} className={`body${major ? " is-major" : ""}`}>
      <div className="body-disc">
        <ProjectMedia title={project.title} className="media" />
        <span className="body-ring" aria-hidden="true" />
      </div>
      <div className="body-text">
        <p className="body-cat">
          JM {n} · {project.category || "Web App"} · {project.date}
        </p>
        <h3>{project.title}</h3>
        <p className="body-desc">{project.description}</p>
        <ul className="chips">
          {(project.technologies || []).map((t) => (
            <li key={t}>{techName(t)}</li>
          ))}
        </ul>
        <ProjectLinks project={project} />
      </div>
    </article>
  );
}

export default function Catalogue() {
  return (
    <section id="catalogue" className="section">
      <SectionHead sign="◎" title={projectsIntro.title}>
        <p>{projectsIntro.text}</p>
      </SectionHead>
      <h3 className="cat-group">Major bodies</h3>
      <div className="bodies bodies-major">
        {featuredProjects.map((p, i) => (
          <Body key={p.title} project={p} n={i + 1} major />
        ))}
      </div>
      <h3 className="cat-group">The catalogue</h3>
      <div className="bodies">
        {allProjects.map((p, i) => (
          <Body key={p.title} project={p} n={featuredProjects.length + i + 1} />
        ))}
      </div>
    </section>
  );
}
