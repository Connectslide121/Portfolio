import gsap from "gsap";
import { useCallback, useEffect, useRef, useState } from "react";
import { BEATS } from "./config";

const SEEK = 1.5; // seconds to travel one beat

/**
 * Every input funnels into exactly one operation: tweenTo(label).
 * Adding a new way to advance never touches the animation (4.1 in the plan).
 */
export function useJourneyDriver(tl, stageRef) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const busy = useRef(false);
  const idx = useRef(0);

  const goTo = useCallback(
    (next) => {
      if (!tl) return;
      const clamped = Math.max(0, Math.min(BEATS.length - 1, next));
      if (clamped === idx.current || busy.current) return;
      busy.current = true;
      const dist = Math.abs(clamped - idx.current) || 1;
      idx.current = clamped;
      setIndex(clamped);
      setPlaying(false);
      tl.tweenTo(BEATS[clamped].id, {
        duration: SEEK * dist,
        ease: "power2.inOut",
        onComplete: () => {
          busy.current = false;
        },
      });
    },
    [tl]
  );

  const next = useCallback(() => goTo(idx.current + 1), [goTo]);
  const prev = useCallback(() => goTo(idx.current - 1), [goTo]);

  // Autoplay: same timeline, just let it run and keep the rail in sync.
  const togglePlay = useCallback(() => {
    if (!tl) return;
    if (playing) {
      tl.pause();
      setPlaying(false);
      return;
    }
    if (idx.current === BEATS.length - 1) {
      idx.current = 0;
      setIndex(0);
      tl.pause(0);
    }
    setPlaying(true);
    tl.play();
  }, [tl, playing]);

  // Keep the rail honest while autoplaying. Uses the ticker rather than
  // hijacking the timeline's onUpdate, which already belongs to render().
  useEffect(() => {
    if (!tl || !playing) return;
    const sync = () => {
      let at = 0;
      BEATS.forEach((b, i) => {
        if (tl.time() >= tl.labels[b.id] - 0.01) at = i;
      });
      if (at !== idx.current) {
        idx.current = at;
        setIndex(at);
      }
      if (!tl.isActive()) setPlaying(false);
    };
    gsap.ticker.add(sync);
    return () => gsap.ticker.remove(sync);
  }, [tl, playing]);

  // --- wheel: one gesture = one beat, so you always land on a beat ---------
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    let locked = false;
    const onWheel = (e) => {
      e.preventDefault();
      if (locked || Math.abs(e.deltaY) < 4) return;
      locked = true;
      setTimeout(() => {
        locked = false;
      }, SEEK * 1000 * 0.75);
      e.deltaY > 0 ? next() : prev();
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [stageRef, next, prev]);

  // --- keyboard ------------------------------------------------------------
  useEffect(() => {
    const onKey = (e) => {
      const map = {
        ArrowRight: next,
        ArrowDown: next,
        PageDown: next,
        ArrowLeft: prev,
        ArrowUp: prev,
        PageUp: prev,
      };
      if (e.key === " ") {
        e.preventDefault();
        togglePlay();
        return;
      }
      if (map[e.key]) {
        e.preventDefault();
        map[e.key]();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev, togglePlay]);

  // --- touch swipe ---------------------------------------------------------
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    let x0 = null;
    const start = (e) => (x0 = e.touches[0].clientX);
    const end = (e) => {
      if (x0 == null) return;
      const dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 48) (dx < 0 ? next : prev)();
      x0 = null;
    };
    el.addEventListener("touchstart", start, { passive: true });
    el.addEventListener("touchend", end, { passive: true });
    return () => {
      el.removeEventListener("touchstart", start);
      el.removeEventListener("touchend", end);
    };
  }, [stageRef, next, prev]);

  return { index, goTo, next, prev, playing, togglePlay };
}
