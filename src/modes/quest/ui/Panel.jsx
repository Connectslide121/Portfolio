import React, { useEffect, useRef } from "react";

/** An RPG menu window: framed, titled, closes with Escape or the X. */
export default function Panel({ title, onClose, children, className = "", wide = false }) {
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
    <div className="panel-scrim" onPointerDown={(e) => e.target === e.currentTarget && onClose()}>
      <section ref={ref} className={`panel window${wide ? " is-wide" : ""} ${className}`.trim()} role="dialog" aria-modal="true" aria-label={title}>
        <header className="panel-head">
          <h2>{title}</h2>
          <button type="button" className="x-btn" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </header>
        <div className="panel-body">{children}</div>
      </section>
    </div>
  );
}
