import React from "react";

export default function SectionHead({ sign, title, children }) {
  return (
    <header className="section-head">
      <p className="eyebrow">
        <span className="sign" aria-hidden="true">
          {sign}
        </span>
      </p>
      <h2>{title}</h2>
      {children && <div className="section-intro">{children}</div>}
    </header>
  );
}
