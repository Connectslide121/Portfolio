import React, { useCallback, useEffect, useRef, useState } from "react";
import "./toggle.css";

/**
 * The way into destruction mode: a small printed crosshair badge in the
 * bottom-right corner. The mode itself is a separate chunk, fetched the
 * first time someone presses this, so nobody who never plays pays for it.
 *
 * Desktop only (it needs a mouse to aim) and never under reduced motion.
 */
const canPlay = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(pointer: fine)").matches &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function DestroyToggle() {
  const [on, setOn] = useState(false);
  const [loading, setLoading] = useState(false);
  const stop = useRef(null);
  const [allowed] = useState(canPlay);

  const start = useCallback(async () => {
    if (on || loading) return;
    setLoading(true);
    try {
      const { startDestruction } = await import("./destroyMode");
      stop.current = startDestruction({
        onExit: () => {
          stop.current = null;
          setOn(false);
        },
      });
      setOn(true);
    } finally {
      setLoading(false);
    }
  }, [on, loading]);

  // Leaving the page mid-game repairs it first.
  useEffect(() => () => stop.current && stop.current(), []);

  if (!allowed || on) return null;

  return (
    <button
      type="button"
      className="dz-toggle"
      onClick={start}
      aria-label="Destruction mode — shoot the portfolio"
      data-no-destroy
    >
      <svg viewBox="-16 -16 32 32" aria-hidden="true">
        <circle r="9" />
        <path d="M0 -14 V-5 M0 5 V14 M-14 0 H-5 M5 0 H14" />
        <circle className="dz-toggle-dot" r="2" />
      </svg>
      <span>{loading ? "Arming…" : "Destruction mode"}</span>
    </button>
  );
}
