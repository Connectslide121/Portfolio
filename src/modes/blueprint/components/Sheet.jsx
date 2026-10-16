import React from "react";
import "../styles/sheet.css";

export const SHEETS = [
  { id: "home", no: "01", label: "General arrangement" },
  { id: "about", no: "02", label: "Process & parts" },
  { id: "experience", no: "03", label: "Revision history" },
  { id: "projects", no: "04", label: "Details — works" },
  { id: "contact", no: "05", label: "Change request" },
];

const COLS = 8;
const ROWS = "ABCDEF";
const YEAR = new Date().getFullYear();

/** The zone references printed around the border of every drawing. */
function Zones() {
  const nums = Array.from({ length: COLS }, (_, i) => <span key={i}>{i + 1}</span>);
  const letters = Array.from(ROWS, (l) => <span key={l}>{l}</span>);
  return (
    <div className="zones" aria-hidden="true">
      <div className="zones-row zones-top">{nums}</div>
      <div className="zones-row zones-bottom">{nums}</div>
      <div className="zones-col zones-left">{letters}</div>
      <div className="zones-col zones-right">{letters}</div>
    </div>
  );
}

export function TitleBlock({ no, title, scale = "NTS" }) {
  return (
    <dl className="title-block">
      <div className="tb-project">
        <dt>Project</dt>
        <dd>Jon Mendizabal — Portfolio</dd>
      </div>
      <div className="tb-title">
        <dt>Title</dt>
        <dd>{title}</dd>
      </div>
      <div>
        <dt>Dwg no.</dt>
        <dd>JM-{no}</dd>
      </div>
      <div>
        <dt>Sheet</dt>
        <dd>
          {Number(no)} of {SHEETS.length}
        </dd>
      </div>
      <div>
        <dt>Scale</dt>
        <dd>{scale}</dd>
      </div>
      <div>
        <dt>Rev</dt>
        <dd>{YEAR}</dd>
      </div>
      <div>
        <dt>Drawn</dt>
        <dd>J.M.</dd>
      </div>
    </dl>
  );
}

/**
 * One drawing sheet: a double-ruled frame with zone references, the sheet
 * heading and, at the foot, the title block.
 */
export default function Sheet({ id, title, kicker, intro, children, scale, className = "" }) {
  const sheet = SHEETS.find((s) => s.id === id);
  return (
    <section id={id} className={`sheet ${className}`.trim()}>
      <div className="sheet-frame">
        <Zones />
        <div className="sheet-inner">
          <header className="sheet-head" data-reveal>
            <p className="sheet-kicker">
              <span className="sheet-no">S-{sheet.no}</span>
              {kicker || sheet.label}
            </p>
            {title && <h2>{title}</h2>}
            {intro && <p className="sheet-intro">{intro}</p>}
          </header>
          {children}
          <TitleBlock no={sheet.no} title={sheet.label} scale={scale} />
        </div>
      </div>
    </section>
  );
}
