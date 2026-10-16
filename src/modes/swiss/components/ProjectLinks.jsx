import React from "react";

const LINKS = [
  ["repository", "Code"],
  ["livedemo", null], // labelled by the project's own `button` text
  ["npm", "npm"],
  ["play", "Play"],
];

export default function ProjectLinks({ project, className = "" }) {
  const links = LINKS.filter(([key]) => project[key]);
  if (!links.length) return null;
  return (
    <ul className={`project-links ${className}`.trim()}>
      {links.map(([key, label]) => (
        <li key={key}>
          <a href={project[key]} target="_blank" rel="noopener noreferrer">
            {label || project.button || "Live demo"} ↗
          </a>
        </li>
      ))}
    </ul>
  );
}
