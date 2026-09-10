import React from "react";
import { orgById } from "../data/orgLogos";
import "../styles/orgmark.css";

/**
 * A logo on a plate. The plate colour comes from the artwork's tone, so one
 * component reads correctly on the journey's dark scenes and the CV's light
 * theme (see src/data/orgLogos.js).
 */
export default function OrgMark({ id, size = "md" }) {
  const org = orgById(id);
  if (!org) return null;

  return (
    <span className="org-mark" data-tone={org.tone} data-size={size}>
      <img src={org.src} alt={org.label} loading="lazy" />
    </span>
  );
}

/** Several marks in a row — the studies beat covers two institutions. */
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
