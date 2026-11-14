import React from "react";

/** A section's sheet number and name, its title and a line under it. */
export default function SectionHead({ num, label, title, children }) {
  return (
    <header className="section-head" data-reveal>
      <p className="sheet">
        <span>{num}</span>
        {label}
      </p>
      <h2>{title}</h2>
      {children && <div className="section-lede">{children}</div>}
    </header>
  );
}
