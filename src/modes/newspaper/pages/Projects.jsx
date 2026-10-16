import React from "react";
import "../styles/projects.css";
import SectionFlag from "../components/SectionFlag";
import Halftone from "../art/Halftone";
import ProjectMedia from "../components/ProjectMedia";
import ProjectLinks from "../components/ProjectLinks";
import { featuredProjects, allProjects } from "../../../components/projectList";
import { techFor } from "../../../data/projectTech";
import { projectsIntro } from "../../../data/site";

const techName = (t) => techFor(t)?.name || t;
const techLine = (p) => (p.technologies || []).map(techName).join(", ");

function Feature({ project, big }) {
  return (
    <article className={`feature${big ? " feature-big" : ""}`}>
      <Halftone className="feature-art">
        <ProjectMedia title={project.title} className="media" />
      </Halftone>
      <p className="kicker">
        {project.category || "Web App"} · {project.date}
      </p>
      <h3>{project.title}</h3>
      <p className={big ? "dropcap" : undefined}>{project.description}</p>
      <p className="filed">Built with {techLine(project)}.</p>
      <ProjectLinks project={project} />
    </article>
  );
}

export default function Projects() {
  return (
    <section id="projects" className="page projects">
      <SectionFlag id="projects" title={projectsIntro.title} aside={`${featuredProjects.length + allProjects.length} reports`} />
      <p className="standfirst">{projectsIntro.text}</p>

      <div className="features">
        {featuredProjects.map((p, i) => (
          <Feature key={p.title} project={p} big={i < 2} />
        ))}
      </div>

      <h3 className="briefs-head">
        <span>In brief</span>
      </h3>
      <div className="briefs">
        {allProjects.map((p) => (
          <article key={p.title} className="brief">
            <h4>{p.title}</h4>
            <p className="kicker">
              {p.category || "Web App"} · {p.date}
            </p>
            <p>{p.description.trim()}</p>
            <p className="filed">Built with {techLine(p)}.</p>
            <ProjectLinks project={p} />
          </article>
        ))}
      </div>
    </section>
  );
}
