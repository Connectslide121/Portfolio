import React, { useState } from "react";
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
const part = (n) => `P-${String(n).padStart(2, "0")}`;

export default function Work() {
  // The project open in the dialog, as its place in `everything`.
  const [open, setOpen] = useState(null);
  const step = (by) => setOpen((at) => (at == null ? at : (at + by + everything.length) % everything.length));

  return (
    <section id="work" className="section work">
      <div className="wrap">
        <SectionHead num="02" label="Parts" title={projectsIntro.title}>
          <p>{projectsIntro.text}</p>
        </SectionHead>

        <ol className="parts">
          {featuredProjects.map((p, i) => (
            <li key={p.title} className="part" data-reveal>
              <div className="part-media">
                <ProjectMedia title={p.title} />
              </div>
              <div className="part-body">
                <p className="part-meta">
                  <span>{part(i + 1)}</span>
                  <span>{kind(p)}</span>
                  <time>{p.date}</time>
                </p>
                <h3>
                  {/* The button's hit area is the whole card; the links sit above it. */}
                  <button type="button" className="part-open" onClick={() => setOpen(i)} aria-haspopup="dialog">
                    {p.title}
                  </button>
                </h3>
                <p className="part-text">{projectBlurbs[p.title] || p.description}</p>
                <p className="part-tech">{tech(p).join(" · ")}</p>
                <div className="part-foot">
                  <ProjectLinks project={p} />
                  <span className="part-more" aria-hidden="true">
                    Details →
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ol>

        <div className="stock">
          <div className="stock-head" data-reveal>
            <h3>In stock</h3>
            <p>{allProjects.length} more, newest first. Open any row for the full story and its links.</p>
          </div>
          <ol className="stock-list" data-reveal>
            {allProjects.map((p, i) => (
              <li key={p.title}>
                <button type="button" className="stock-row" onClick={() => setOpen(featuredProjects.length + i)} aria-haspopup="dialog">
                  <span className="stock-no">{part(featuredProjects.length + i + 1)}</span>
                  <span className="stock-title">{p.title}</span>
                  <span className="stock-kind">{kind(p)}</span>
                  <span className="stock-tech">{tech(p).join(" · ")}</span>
                  <span className="stock-date">{p.date}</span>
                  <span className="stock-arrow" aria-hidden="true">
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
