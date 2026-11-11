import React, { useEffect, useRef } from "react";
import ProjectMedia from "./ProjectMedia";
import ProjectLinks from "./ProjectLinks";
import { usePageLock } from "./hooks";
import { techFor } from "../../../data/projectTech";

/**
 * One project in full, over the page. A native <dialog>, so focus is held
 * inside it and Escape closes it; the arrow keys step through the list. Its
 * size is fixed, so stepping from one project to the next moves nothing.
 */
export default function ProjectDialog({ projects, index, onStep, onClose }) {
  const ref = useRef(null);
  const project = index == null ? null : projects[index];
  usePageLock(Boolean(project));

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (project && !el.open) {
      el.showModal();
      // Not the video, which is first in the dialog and would keep the arrow
      // keys for scrubbing.
      el.querySelector(".pd-close")?.focus();
    }
    if (!project && el.open) el.close();
  }, [project]);

  const onKeyDown = (e) => {
    if (e.target.closest("video")) return;
    if (e.key === "ArrowRight") onStep(1);
    if (e.key === "ArrowLeft") onStep(-1);
  };

  return (
    <dialog ref={ref} className="project-dialog" aria-labelledby="project-dialog-title" onClose={onClose} onKeyDown={onKeyDown} onClick={(e) => e.target === ref.current && onClose()}>
      {project && (
        <div className="pd">
          <div className="pd-media">
            <ProjectMedia key={project.title} title={project.title} controls />
          </div>
          <div className="pd-info">
            <p className="project-meta">
              <span>{project.category || "Web app"}</span>
              <time>{project.date}</time>
            </p>
            <h3 id="project-dialog-title">{project.title}</h3>
            <p className="pd-text">{project.description.trim()}</p>
            {project.details && (
              <ul className="pd-details">
                {project.details.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            )}
            <ul className="chips" aria-label="Built with">
              {project.technologies.map((k) => (
                <li key={k}>{techFor(k)?.name || k}</li>
              ))}
            </ul>
            <ProjectLinks project={project} />
          </div>
          <div className="pd-bar">
            <button type="button" className="pd-step" onClick={() => onStep(-1)} aria-label="Previous project">
              <span aria-hidden="true">←</span> Previous
            </button>
            <span className="pd-count">
              {index + 1} / {projects.length}
            </span>
            <button type="button" className="pd-step" onClick={() => onStep(1)} aria-label="Next project">
              Next <span aria-hidden="true">→</span>
            </button>
          </div>
          <button type="button" className="icon-btn pd-close" onClick={onClose} aria-label="Close">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
      )}
    </dialog>
  );
}
