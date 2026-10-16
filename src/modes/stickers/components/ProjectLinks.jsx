import React from "react";

const LINKS = [
  ["livedemo", null, "yellow"], // labelled by the project's own `button` text
  ["repository", "Code", "white"],
  ["npm", "npm", "pink"],
  ["play", "Play", "green"],
];

export default function ProjectLinks({ project }) {
  const links = LINKS.filter(([key]) => project[key]);
  if (!links.length) return null;
  return (
    <ul className="project-links">
      {links.map(([key, label, color]) => (
        <li key={key}>
          <a className={`chunky chunky-sm bg-${color}`} href={project[key]} target="_blank" rel="noopener noreferrer">
            {label || project.button || "Live demo"} ↗
          </a>
        </li>
      ))}
    </ul>
  );
}
