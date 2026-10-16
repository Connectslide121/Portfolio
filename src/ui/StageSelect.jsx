import React from "react";
import Panel from "./Panel";
import { STAGES, stageInfo } from "../run/level";

export default function StageSelect({ reached, onClose, onTravel }) {
  return (
    <Panel title="Stage select" onClose={onClose} wide>
      <ol className="stage-list">
        {STAGES.map((s, i) =>
          s.quiet ? null : (
            <li key={s.id}>
              <button type="button" className={`stage-btn z-${s.zone}`} onClick={() => onTravel(i)}>
                <span className="sb-n">{STAGES.filter((x) => !x.quiet).indexOf(s) + 1}</span>
                <span className="sb-text">
                  <b>{stageInfo(s).title}</b>
                  <small>
                    {stageInfo(s).when} · {stageInfo(s).org}
                  </small>
                </span>
                <span className="sb-flag" aria-label={reached.includes(s.id) ? "reached" : "not yet"}>
                  {reached.includes(s.id) ? "⚑" : "·"}
                </span>
              </button>
            </li>
          ),
        )}
      </ol>
    </Panel>
  );
}
