import React from "react";

// Data-driven bullet text: {Label} becomes a link resolved from `links`,
// *Label* becomes <strong>. Keeps src/data/journey.js readable as plain text
// while preserving the inline links the résumé cards had as literal JSX.
const TOKEN = /(\{[^}]+\}|\*[^*]+\*)/g;

export function renderRichText(text, links = {}) {
  return text.split(TOKEN).map((part, i) => {
    if (part.startsWith("{") && part.endsWith("}")) {
      const label = part.slice(1, -1);
      const href = links[label];
      return href ? (
        <a
          key={i}
          href={href}
          target="_blank"
          rel="noreferrer"
          className="product-link"
        >
          {label}
        </a>
      ) : (
        label
      );
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return <strong key={i}>{part.slice(1, -1)}</strong>;
    }
    return part;
  });
}
