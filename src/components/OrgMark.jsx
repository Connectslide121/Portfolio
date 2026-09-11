import React from "react";
import { orgById } from "../data/orgLogos";
import "../styles/orgmark.css";

/**
 * A logo on a plate, linking to the organisation's own site.
 *
 * The plate colour comes from the artwork's tone, so one component reads
 * correctly on the journey's dark scenes and the CV's light theme (see
 * src/data/orgLogos.js). Falls back to a plain span if the organisation has
 * no URL, so the mark never becomes a dead link.
 */
export default function OrgMark({ id, size = "md" }) {
  const org = orgById(id);
  if (!org) return null;

  const mark = (
    <>
      <img src={org.src} alt={org.label} loading="lazy" />
      <span className="org-mark-cue" aria-hidden="true">
        ↗
      </span>
    </>
  );

  if (!org.url) {
    return (
      <span className="org-mark" data-tone={org.tone} data-size={size}>
        {mark}
      </span>
    );
  }

  return (
    <a
      className="org-mark"
      data-tone={org.tone}
      data-size={size}
      href={org.url}
      target="_blank"
      rel="noreferrer"
      title={`${org.label} — opens in a new tab`}
    >
      {mark}
    </a>
  );
}

/** Several marks in a row — the studies and India beats each cover two. */
export function OrgMarks({ ids = [], size = "md" }) {
  if (!ids.length) return null;
  return (
    <span className="org-marks">
      {ids.map((id) => (
        <OrgMark key={id} id={id} size={size} />
      ))}
    </span>
  );
}
