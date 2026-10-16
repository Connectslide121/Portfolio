import React from "react";

/** The rule, number and title every section opens with. */
export default function SectionHead({ num, title, aside, children }) {
  return (
    <header className="section-head wrap" data-reveal>
      <span className="section-num" aria-hidden="true">
        {num}
      </span>
      <div className="section-title">
        <h2>{title}</h2>
        {children && <div className="section-intro">{children}</div>}
      </div>
      {aside && <p className="section-aside">{aside}</p>}
    </header>
  );
}
