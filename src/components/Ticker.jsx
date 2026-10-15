import React from "react";
import { toolCategories } from "../data/tools";

const names = toolCategories.flatMap((c) => c.tools.map((t) => t.name));

/** A red band of every tool, running past like a departures board. */
export default function Ticker() {
  const run = (hidden) => (
    <ul aria-hidden={hidden || undefined}>
      {names.map((n) => (
        <li key={n}>{n}</li>
      ))}
    </ul>
  );
  return (
    <div className="ticker" aria-label="Technologies">
      <div className="ticker-track">
        {run(false)}
        {run(true)}
      </div>
    </div>
  );
}
