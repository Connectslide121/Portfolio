import React from "react";

/** A section's number, its place on the walk, its title and a line under it. */
export default function SectionHead({ num, label, title, children }) {
  return (
    <header className="section-head" data-reveal>
      <p className="eyebrow">
        <span>{num}</span>
        {label}
      </p>
      <h2>{title}</h2>
      {children && <div className="section-lede">{children}</div>}
    </header>
  );
}
