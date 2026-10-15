import React from "react";
import { SECTIONS } from "./Masthead";

/** The running header at the top of each "page" of the paper. */
export default function SectionFlag({ id, title, aside }) {
  const s = SECTIONS.find((x) => x.id === id);
  return (
    <header className="section-flag">
      <span className="flag-page">{s.page}</span>
      <h2>{title || s.label}</h2>
      {aside && <span className="flag-aside">{aside}</span>}
    </header>
  );
}
