import React from "react";
import Panel from "./Panel";
import { renderRichText } from "../components/richText";
import { orgById } from "../data/orgLogos";
import { stageInfo, STAGES } from "../run/level";

/** What a checkpoint flag opens: the stage's story, in full. */
export default function StageCard({ stage, onClose }) {
  const info = stageInfo(stage);
  const e = info.entry;
  const b = info.beat;
  const org = orgById(e ? e.orgId : "atpl");
  const number = STAGES.filter((s) => !s.quiet).findIndex((s) => s.id === stage.id) + 1;
  return (
    <Panel title={`Stage ${number} · ${info.when}`} onClose={onClose} wide className="stage-card">
      <div className="sc-head">
        {org && (
          <span className="sc-mark" data-tone={org.tone}>
            <img src={org.src} alt={org.label} />
          </span>
        )}
        <div>
          <h3>{info.title}</h3>
          <p>
            {info.org} · {info.where}
          </p>
        </div>
      </div>

      {e?.quest && (
        <div className="sc-quest">
          <p className="sc-q-name">
            ★ “{e.quest.name}” <span>{e.quest.status}</span>
          </p>
          <p>
            <b>Constraint:</b> {e.quest.constraint}
          </p>
          <p>
            <b>Objective:</b> {e.quest.objective}
          </p>
        </div>
      )}
      {b && (
        <div className="sc-quest">
          <p className="sc-q-name">★ {b.headline.join(" ")}</p>
          <p>
            <b>Constraint:</b> {b.constraint}
          </p>
          <p>
            <b>Objective:</b> {b.objective}
          </p>
        </div>
      )}

      {e && <p className="sc-summary">{renderRichText(e.summary, e.summaryLinks)}</p>}
      {e?.bullets && (
        <ul className="sc-bullets">
          {e.bullets.map((x, i) => (
            <li key={i}>{renderRichText(x.text, x.links)}</li>
          ))}
        </ul>
      )}

      <p className="sc-skills">
        <b>Hidden in this stage’s ? blocks:</b> {info.tech.join(", ")}
        {e && (
          <>
            {" "}
            · material: <i>{e.material}</i>
          </>
        )}
      </p>
      <div className="sc-actions">
        {org?.url && (
          <a className="nes-btn" href={org.url} target="_blank" rel="noreferrer">
            Visit site ↗
          </a>
        )}
        <button type="button" className="nes-btn is-gold" onClick={onClose}>
          Continue ▶
        </button>
      </div>
    </Panel>
  );
}
