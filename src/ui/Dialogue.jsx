import React, { useEffect, useMemo, useRef, useState } from "react";
import { orgById } from "../data/orgLogos";

/**
 * The JRPG text box. Text types itself out; Space, Enter or a click
 * finishes the line, then turns the page. Links on a page are buttons
 * under the text; a page with choices waits for one.
 */
export default function Dialogue({ script, onClose }) {
  const [pages, setPages] = useState(script);
  const [i, setI] = useState(0);
  const [shown, setShown] = useState(0);
  const boxRef = useRef(null);
  const page = pages[i];
  const full = page.text.length;
  const done = shown >= full;
  const reduce = useMemo(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches, []);

  useEffect(() => {
    setShown(reduce ? full : 0);
  }, [i, pages, full, reduce]);

  useEffect(() => {
    if (done) return;
    const id = window.setInterval(() => setShown((n) => Math.min(full, n + 2)), 18);
    return () => window.clearInterval(id);
  }, [done, full]);

  useEffect(() => {
    boxRef.current?.focus();
  }, []);

  const next = () => {
    if (!done) return setShown(full);
    if (page.choices) return;
    if (i < pages.length - 1) setI(i + 1);
    else onClose();
  };

  const onKey = (e) => {
    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    } else if ((e.key === "Enter" || e.key === " ") && e.target === boxRef.current) {
      e.preventDefault();
      next();
    }
  };

  const org = page.mark ? orgById(page.mark) : null;

  return (
    <div className="dialogue-wrap">
      <div ref={boxRef} className="dialogue window" tabIndex={0} role="dialog" aria-label={page.speaker} onKeyDown={onKey} onClick={(e) => e.target.closest("button, a") || next()}>
        <div className="speaker">{page.speaker}</div>
        {org && (
          <span className="dialogue-mark" data-tone={org.tone}>
            <img src={org.src} alt={org.label} />
          </span>
        )}
        <p className="dialogue-text" aria-live="polite">
          {page.text.slice(0, shown)}
          <span className="sr-only">{page.text.slice(shown)}</span>
        </p>
        {done && page.links?.length > 0 && (
          <p className="dialogue-links">
            {page.links.map((l) => (
              <a key={l.href} className="rpg-btn" href={l.href} target="_blank" rel="noreferrer">
                {l.label} ↗
              </a>
            ))}
          </p>
        )}
        {done && page.choices && (
          <ul className="choices">
            {page.choices.map((c) => (
              <li key={c.label}>
                <button
                  type="button"
                  className="choice"
                  onClick={() => {
                    setPages(c.script());
                    setI(0);
                    boxRef.current?.focus();
                  }}
                >
                  ▸ {c.label}
                </button>
              </li>
            ))}
          </ul>
        )}
        <div className="dialogue-foot">
          <span>
            {i + 1}/{pages.length}
          </span>
          {done && !page.choices && <span className="blink">{i < pages.length - 1 ? "▼" : "■"}</span>}
        </div>
      </div>
    </div>
  );
}
