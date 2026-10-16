import React, { useEffect, useRef } from "react";

/** A dialog laid on the table: titled, closes with Escape, the X or a click outside. */
export default function Panel({ title, eyebrow, onClose, children, className = "" }) {
  const ref = useRef(null);

  useEffect(() => {
    const previous = document.activeElement;
    ref.current?.querySelector("button, a, input, [tabindex]")?.focus();
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      previous?.focus?.();
    };
  }, [onClose]);

  return (
    <div className="scrim" onPointerDown={(e) => e.target === e.currentTarget && onClose()}>
      <section ref={ref} className={`panel ${className}`.trim()} role="dialog" aria-modal="true" aria-label={title}>
        <header className="panel-head">
          <div>
            {eyebrow && <p className="eyebrow">{eyebrow}</p>}
            <h2>{title}</h2>
          </div>
          <button type="button" className="btn btn-sm" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </header>
        <div className="panel-body">{children}</div>
      </section>
    </div>
  );
}
