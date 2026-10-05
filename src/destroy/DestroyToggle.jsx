import React, { useCallback, useEffect, useRef, useState } from "react";
import { canPlay, DZ_START } from "./launch";
import "./toggle.css";

/**
 * The corner badge for destruction mode, and the one place a game starts.
 *
 * In the CV, the hero carries the full button (HeroDestroy). While that is
 * on screen the badge is parked out of sight; when the hero scrolls away
 * the badge FLIES from the hero button's position down into the corner, so
 * the visitor sees where it went, and flies back up when they return. In
 * the journey there is no hero, so the badge is always docked, and opens its
 * label for a few seconds when it first appears so it is not missed.
 *
 * The mode itself is a separate chunk, fetched on the first press.
 */
export default function DestroyToggle({ journeyOpen = false }) {
  const [allowed] = useState(canPlay);
  const [on, setOn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [heroInView, setHeroInView] = useState(false);
  const stop = useRef(null);
  const badge = useRef(null);
  const prevDocked = useRef(undefined);
  const prevEl = useRef(null);
  const introTimer = useRef(0);

  const start = useCallback(async () => {
    if (stop.current || loading) return;
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
  }, [loading]);

  // Either the hero button or the badge can ask for a game.
  useEffect(() => {
    window.addEventListener(DZ_START, start);
    return () => window.removeEventListener(DZ_START, start);
  }, [start]);

  // Leaving the page mid-game repairs it first.
  useEffect(() => () => stop.current && stop.current(), []);

  // Is the hero's button on screen?
  useEffect(() => {
    if (!allowed) return;
    let io = null;
    let tries = 0;
    let retry = 0;
    const attach = () => {
      const target = document.querySelector(".dz-hero-btn");
      if (!target) {
        if (tries++ < 40) retry = setTimeout(attach, 250);
        return;
      }
      // The fixed navbar covers the top of the viewport, so the button counts
      // as gone the moment it slides under it, not when it leaves the window.
      const nav = document.querySelector("nav");
      const top = nav ? Math.round(nav.getBoundingClientRect().height) : 0;
      io = new IntersectionObserver(([e]) => setHeroInView(e.isIntersecting), {
        threshold: 0,
        rootMargin: `-${top}px 0px 0px 0px`,
      });
      io.observe(target);
    };
    attach();
    return () => {
      clearTimeout(retry);
      io && io.disconnect();
    };
  }, [allowed]);

  const docked = journeyOpen || !heroInView;

  // The flight between the hero and the corner.
  useEffect(() => {
    const el = badge.current;
    if (!el) return;
    // A fresh badge (first mount, or back after a game) just takes its place.
    const first = prevDocked.current === undefined || prevEl.current !== el;
    prevEl.current = el;
    const changed = prevDocked.current !== docked;
    prevDocked.current = docked;
    if (!first && !changed) return;

    const intro = (ms) => {
      clearTimeout(introTimer.current);
      el.classList.add("intro");
      introTimer.current = setTimeout(() => el.classList.remove("intro"), ms);
    };

    const icon = document.querySelector(".dz-hero-btn .dz-hero-icon");
    if (first || journeyOpen || !icon) {
      el.classList.toggle("parked", !docked);
      if (docked) intro(journeyOpen ? 4500 : 2600);
      return;
    }

    el.getAnimations().forEach((a) => a.cancel());
    el.classList.remove("parked", "intro");
    const h = icon.getBoundingClientRect();
    const b = el.getBoundingClientRect();
    const dx = h.left + h.width / 2 - (b.left + b.height / 2);
    const dy = h.top + h.height / 2 - (b.top + b.height / 2);

    if (docked) {
      el.animate(
        [
          { translate: `${dx}px ${dy}px`, scale: 1.3, opacity: 0.3 },
          { translate: "0 0", scale: 1, opacity: 1 },
        ],
        { duration: 760, easing: "cubic-bezier(0.3, 1.25, 0.4, 1)" },
      ).onfinish = () => intro(2400);
    } else {
      el.animate(
        [
          { translate: "0 0", scale: 1, opacity: 1 },
          { translate: `${dx}px ${dy}px`, scale: 1.3, opacity: 0 },
        ],
        { duration: 520, easing: "cubic-bezier(0.5, 0, 0.75, 0.4)", fill: "forwards" },
      ).onfinish = (e) => {
        el.classList.add("parked");
        e.target.cancel();
      };
    }
  }, [docked, journeyOpen, on]);

  useEffect(() => () => clearTimeout(introTimer.current), []);

  if (!allowed || on) return null;

  return (
    <button
      type="button"
      ref={badge}
      className="dz-toggle parked"
      onClick={start}
      aria-label="Destruction mode — shoot the portfolio"
      data-no-destroy
      data-no-field
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
