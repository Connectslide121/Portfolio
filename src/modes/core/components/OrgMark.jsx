import React from "react";
import { orgById } from "../../../data/orgLogos";

/**
 * An organisation's logo on a plate chosen from the artwork's tone (light ink
 * gets a dark plate), linking to its site.
 */
export default function OrgMark({ id }) {
  const org = orgById(id);
  if (!org) return null;
  return (
    <a className={`org-mark tone-${org.tone}`} href={org.url} target="_blank" rel="noreferrer" aria-label={`${org.label} (opens in a new tab)`} title={org.label}>
      <img src={org.src} alt="" loading="lazy" />
    </a>
  );
}
