import React, { useState } from "react";
import { Fold } from "../art/Scenery";
import ProjectDialog from "../components/ProjectDialog";
import ProjectLinks from "../components/ProjectLinks";
import ProjectMedia from "../components/ProjectMedia";
import SectionHead from "../components/SectionHead";
import { allProjects, featuredProjects } from "../../../components/projectList";
import { projectBlurbs } from "../../../data/journey";
import { techFor } from "../../../data/projectTech";
import { projectsIntro } from "../../../data/site";

const everything = [...featuredProjects, ...allProjects];
const kind = (p) => p.category || "Web app";
const tech = (p) => p.technologies.map((k) => techFor(k)?.name || k);

export default function Projects() {
  // The project open in the dialog, as its place in `everything`.
  const [open, setOpen] = useState(null);
  const step = (by) => setOpen((at) => (at == null ? at : (at + by + everything.length) % everything.length));

  return (
    <section id="projects" className="section projects">
      <Fold seed={23} to="paper" />
      <div className="wrap">
        <SectionHead num="03" label="Side trails" title={projectsIntro.title}>
          <p>{projectsIntro.text}</p>
        </SectionHead>

        <ol className="featured">
          {featuredProjects.map((p, i) => (
            <li key={p.title} className="project" data-reveal>
              <div className="project-media">
                <ProjectMedia title={p.title} />
              </div>
              <div className="project-body">
                <p className="project-meta">
                  <span>{kind(p)}</span>
                  <time>{p.date}</time>
                </p>
                <h3>
                  {/* The button's hit area is the whole card; the links sit above it. */}
                  <button type="button" className="project-open" onClick={() => setOpen(i)} aria-haspopup="dialog">
                    {p.title}
                  </button>
                </h3>
                <p className="project-text">{projectBlurbs[p.title] || p.description}</p>
                <p className="project-tech">{tech(p).join(" · ")}</p>
                <div className="project-foot">
                  <ProjectLinks project={p} />
                  <span className="project-more" aria-hidden="true">
                    Details →
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ol>

        <div className="archive">
          <div className="archive-head" data-reveal>
            <h3 className="sub-head">
              Everything <em>else</em>
            </h3>
            <p>{allProjects.length} more, newest first. Open any row for the full story and its links.</p>
          </div>
          <ol className="index" data-reveal>
            {allProjects.map((p, i) => (
              <li key={p.title}>
                <button type="button" className="index-row" onClick={() => setOpen(featuredProjects.length + i)} aria-haspopup="dialog">
                  <span className="index-no">{String(i + 1).padStart(2, "0")}</span>
                  <span className="index-title">{p.title}</span>
                  <span className="index-kind">{kind(p)}</span>
                  <span className="index-tech">{tech(p).join(" · ")}</span>
                  <span className="index-date">{p.date}</span>
                  <span className="index-arrow" aria-hidden="true">
                    →
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <ProjectDialog projects={everything} index={open} onStep={step} onClose={() => setOpen(null)} />
    </section>
  );
}
