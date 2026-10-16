import React, { useEffect, useRef, useState } from "react";
import "../styles/projects.css";
import SectionHead from "../components/SectionHead";
import ProjectMedia from "../components/ProjectMedia";
import ProjectLinks from "../components/ProjectLinks";
import { featuredProjects, allProjects } from "../../../components/projectList";
import { techFor } from "../../../data/projectTech";
import { projectsIntro } from "../../../data/site";

const year = (date = "") => date.split(" ").pop();
const pad = (n) => String(n).padStart(2, "0");
const techName = (t) => techFor(t)?.name || t;

function TechList({ technologies = [] }) {
  return (
    <ul className="tag-list">
      {technologies.map((t) => (
        <li key={t}>{techName(t)}</li>
      ))}
    </ul>
  );
}

function Featured({ project, index }) {
  return (
    <article className="feature" data-reveal>
      <div className="feature-media">
        <ProjectMedia title={project.title} className="media" />
        <span className="feature-num">{pad(index + 1)}</span>
      </div>
      <div className="feature-text">
        <p className="feature-meta">
          <span>{project.category || "Web App"}</span>
          <span>{project.date}</span>
        </p>
        <h3>{project.title}</h3>
        <p className="feature-desc">{project.description}</p>
        <TechList technologies={project.technologies} />
        <ProjectLinks project={project} />
      </div>
    </article>
  );
}

/**
 * The index: every other project as one row of a catalogue. On a mouse, the
 * row under the pointer shows its picture next to the cursor; a click opens
 * the row in place.
 */
function Index({ projects, offset }) {
  const [openTitle, setOpenTitle] = useState(null);
  const [hover, setHover] = useState(null);
  const previewRef = useRef(null);
  const [canHover, setCanHover] = useState(false);

  useEffect(() => {
    setCanHover(window.matchMedia("(hover: hover) and (pointer: fine)").matches);
  }, []);

  const move = (e) => {
    const el = previewRef.current;
    if (!el) return;
    el.style.setProperty("--px", `${e.clientX}px`);
    el.style.setProperty("--py", `${e.clientY}px`);
  };

  return (
    <div className="wrap index" onMouseMove={canHover ? move : undefined}>
      <div className="index-head" aria-hidden="true">
        <span>No.</span>
        <span>Title</span>
        <span>Type</span>
        <span>Built with</span>
        <span>Year</span>
      </div>
      <ol className="index-list" onMouseLeave={() => setHover(null)}>
        {projects.map((p, i) => {
          const open = openTitle === p.title;
          const id = `idx-${i}`;
          return (
            <li key={p.title} className={`index-item${open ? " is-open" : ""}`}>
              <button
                type="button"
                className="index-row"
                aria-expanded={open}
                aria-controls={id}
                onClick={() => setOpenTitle(open ? null : p.title)}
                onMouseEnter={() => canHover && setHover(p.title)}
              >
                <span className="index-num">{pad(offset + i + 1)}</span>
                <span className="index-title">{p.title}</span>
                <span className="index-type">{p.category || "Web App"}</span>
                <span className="index-tech">{(p.technologies || []).map(techName).join(", ")}</span>
                <span className="index-year">{year(p.date)}</span>
              </button>
              <div className="index-panel" id={id} hidden={!open}>
                {open && <ProjectMedia title={p.title} className="media" />}
                <div>
                  <p>{p.description}</p>
                  <ProjectLinks project={p} />
                </div>
              </div>
            </li>
          );
        })}
      </ol>
      {canHover && (
        <div ref={previewRef} className={`index-preview${hover && !openTitle ? " is-on" : ""}`} aria-hidden="true">
          {hover && <ProjectMedia key={hover} title={hover} className="media" />}
        </div>
      )}
    </div>
  );
}

export default function Projects() {
  return (
    <section id="projects" className="section">
      <SectionHead num="03" title={projectsIntro.title} aside={`${featuredProjects.length + allProjects.length} works`}>
        <p>{projectsIntro.text}</p>
      </SectionHead>

      <div className="wrap features">
        {featuredProjects.map((p, i) => (
          <Featured key={p.title} project={p} index={i} />
        ))}
      </div>

      <h3 className="wrap index-caption" data-reveal>
        Index of all works
      </h3>
      <Index projects={allProjects} offset={featuredProjects.length} />
    </section>
  );
}
