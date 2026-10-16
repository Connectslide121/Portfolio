import React from "react";
import { toolCategories } from "../../../data/tools";

const names = toolCategories.flatMap((c) => c.tools.map((t) => t.name));

/** A tilted tape of every tool, running across the page. */
export default function Marquee({ reverse = false, color = "yellow" }) {
  const run = (hidden) => (
    <ul aria-hidden={hidden || undefined}>
      {names.map((n) => (
        <li key={n}>{n}</li>
      ))}
    </ul>
  );
  return (
    <div className={`marquee bg-${color}${reverse ? " is-reverse" : ""}`} aria-label="Technologies">
      <div className="marquee-track">
        {run(false)}
        {run(true)}
      </div>
    </div>
  );
}

