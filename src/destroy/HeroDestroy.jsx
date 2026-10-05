import React, { useCallback, useEffect, useRef, useState } from "react";
import { canPlay } from "./launch";
import "./toggle.css";

/**
 * The Destruction mode button — ONE button, which lives in the hero and
 * docks itself in the corner.
 *
 * Scroll a little way down and the button lifts out of the hero row (a slot
 * of its own size holds the row in place) and flies into the bottom-right
 * corner, collapsing to its crosshair. Scroll back up and the same button
 * flies back to wherever its slot is at that moment, so it always lands
 * exactly in place. Open the journey and it docks too, above the stage.
 *
 * The flight is FLIP: measure, switch the layout, measure again, then
 * animate `translate` from the old position to zero. The size and style
 * changes (pill to badge) ride their own CSS transitions alongside.
 *
 * The game is a separate chunk, fetched on the first press.
 */
const DOCK_AT = 200; // px scrolled before the button docks…
const UNDOCK_AT = 140; // …and back above this before it returns (no flicker)

export default function HeroDestroy({ journeyOpen = false }) {
  const [allowed] = useState(canPlay);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const btn = useRef(null);
  const slot = useRef(null);
  const docked = useRef(false);
  const introTimer = useRef(0);
  const stop = useRef(null);

  const start = useCallback(async () => {
    if (stop.current || loading) return;
    setLoading(true);
    try {
      const { startDestruction } = await import("./destroyMode");
      stop.current = startDestruction({
        onExit: () => {
          stop.current = null;
          setPlaying(false);
        },
      });
      setPlaying(true);
    } finally {
      setLoading(false);
    }
  }, [loading]);

  // Leaving the page mid-game repairs it first.
  useEffect(() => () => stop.current && stop.current(), []);

  const setDocked = useCallback((next, animate = true) => {
    const el = btn.current;
    const holder = slot.current;
    if (!el || !holder || docked.current === next) return;
    docked.current = next;

    el.getAnimations().forEach((a) => a.cancel());
    clearTimeout(introTimer.current);
    el.classList.remove("intro");

    const from = el.getBoundingClientRect();
    if (next) {
      // hold the row open while the button is away
      holder.style.width = `${from.width}px`;
      holder.style.height = `${from.height}px`;
    }
    el.classList.toggle("docked", next);
    if (!next) {
      holder.style.width = "";
      holder.style.height = "";
    }
    if (!animate) return;

    const to = el.getBoundingClientRect();
    el.animate(
      [
        { translate: `${from.left - to.left}px ${from.top - to.top}px` },
        { translate: "0 0" },
      ],
      { duration: next ? 720 : 620, easing: "cubic-bezier(0.3, 1.2, 0.4, 1)" },
    ).onfinish = () => {
      if (!next) return;
      el.classList.add("intro");
      introTimer.current = setTimeout(() => el.classList.remove("intro"), 2400);
    };
  }, []);

  // Dock on scroll (with a gap between the two thresholds) or in the journey.
  useEffect(() => {
    if (!allowed) return;
    let raf = 0;
    const check = () => {
      raf = 0;
      const y = window.scrollY;
      const want = journeyOpen || (docked.current ? y > UNDOCK_AT : y > DOCK_AT);
      setDocked(want, !journeyOpen);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(check);
    };
    check();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [allowed, journeyOpen, setDocked]);

  // In the journey the docked badge introduces itself once it appears.
  useEffect(() => {
    const el = btn.current;
    if (!el || !journeyOpen) return;
    el.classList.add("intro");
    clearTimeout(introTimer.current);
    introTimer.current = setTimeout(() => el.classList.remove("intro"), 4500);
  }, [journeyOpen]);

  useEffect(() => () => clearTimeout(introTimer.current), []);

  if (!allowed) return null;

  return (
    <span className="dz-slot" ref={slot}>
      <button
        type="button"
        ref={btn}
        className="dz-dest"
        onClick={start}
        title="Rather not read? Blow the whole thing up."
        aria-label="Destruction mode — shoot the portfolio"
        style={playing ? { visibility: "hidden" } : undefined}
        data-no-destroy
        data-no-field
      >
        <span className="dz-dest-icon" aria-hidden="true">
          <svg viewBox="-16 -16 32 32">
            <circle r="9" />
            <path d="M0 -14 V-5 M0 5 V14 M-14 0 H-5 M5 0 H14" />
            <circle className="dz-dest-dot" r="2" />
          </svg>
        </span>
        <span className="dz-dest-label">{loading ? "Arming…" : "Destruction mode"}</span>
        <span className="dz-dest-new" aria-hidden="true">
          new
        </span>
      </button>
    </span>
  );
}
