import React from "react";

/** A section's number and name, its title and a line under it. */
export default function SectionHead({ num, label, title, children }) {
  return (
    <header className="section-head">
      <p className="eyebrow">
        <span>{num}</span>
        {label}
      </p>
      <h2>{title}</h2>
      {children && <div className="section-lede">{children}</div>}
    </header>
  );
}
