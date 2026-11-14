import React from "react";

/** A project's ways out: the live thing (under its own label) and its code. */
export default function ProjectLinks({ project }) {
  if (!project.livedemo && !project.repository) return null;
  return (
    <ul className="project-links">
      {project.livedemo && (
        <li>
          <a className="btn btn-small" href={project.livedemo} target="_blank" rel="noopener noreferrer">
            {project.button || "Live demo"} <span aria-hidden="true">↗</span>
          </a>
        </li>
      )}
      {project.repository && (
        <li>
          <a className="btn btn-small btn-ghost" href={project.repository} target="_blank" rel="noopener noreferrer">
            Source <span aria-hidden="true">↗</span>
          </a>
        </li>
      )}
    </ul>
  );
}
