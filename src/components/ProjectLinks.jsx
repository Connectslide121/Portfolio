import React from "react";

const LINKS = [
  ["livedemo", null], // labelled by the project's own `button` text
  ["repository", "Source code"],
  ["npm", "npm"],
  ["play", "Play"],
];

export default function ProjectLinks({ project }) {
  const links = LINKS.filter(([key]) => project[key]);
  if (!links.length) return null;
  return (
    <p className="project-links">
      {links.map(([key, label], i) => (
        <React.Fragment key={key}>
          {i > 0 && " · "}
          <a href={project[key]} target="_blank" rel="noopener noreferrer">
            {label || project.button || "Live demo"} →
          </a>
        </React.Fragment>
      ))}
    </p>
  );
}
