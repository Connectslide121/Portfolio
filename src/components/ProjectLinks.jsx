import React from "react";

const LINKS = [
  ["livedemo", null], // labelled by the project's own `button` text
  ["repository", "Source"],
  ["npm", "npm"],
  ["play", "Play"],
];

export default function ProjectLinks({ project }) {
  const links = LINKS.filter(([key]) => project[key]);
  if (!links.length) return null;
  return (
    <ul className="project-links">
      {links.map(([key, label]) => (
        <li key={key}>
          <a href={project[key]} target="_blank" rel="noopener noreferrer">
            {label || project.button || "Live demo"} <span aria-hidden="true">↗</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
