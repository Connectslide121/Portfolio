import gsap from "gsap";
import { useCallback, useEffect, useRef, useState } from "react";
import { BEATS } from "./config";

/**
 * Every input funnels into exactly one operation: tweenTo(label).
 * Adding a new way to advance never touches the animation (4.1 in the plan).
 */
export function useJourneyDriver(tl, stageRef, disabled = false, startIndex = 0) {
  // startIndex matters: a deep link seeks the timeline directly, and if the
  // driver still believed it was at beat 0 it would ignore a click on beat 0.
  const [index, setIndex] = useState(startIndex);
  const [playing, setPlaying] = useState(false);
  const busy = useRef(false);
  const idx = useRef(startIndex);
  const lastSeek = useRef(1);
  const seekTween = useRef(null);

  const goTo = useCallback(
    (next, { instant = false } = {}) => {
      if (!tl) return;
      const clamped = Math.max(0, Math.min(BEATS.length - 1, next));
      if (clamped === idx.current) return;
      // An instant jump may always interrupt a transition in flight; a stepped
      // move waits its turn so gestures cannot queue up.
      if (busy.current && !instant) return;

      const target = tl.labels[BEATS[clamped].id];
      seekTween.current?.kill();

      idx.current = clamped;
      setIndex(clamped);
      setPlaying(false);

      if (instant) {
        // Picking a year off the rail should land on it, not replay the years
        // in between. suppressEvents must be false or onUpdate never fires and
        // the camera/heat never move.
        busy.current = false;
        lastSeek.current = 0.35;
        tl.pause();
        tl.seek(target, false);
        return;
      }

      // Otherwise scrub at the timeline's OWN rate: duration = the actual time
      // distance, ease "none". Anything else replays the beat faster or slower
      // than the Play button does, and the mismatch is very noticeable.
      const seconds = Math.max(0.35, Math.abs(target - tl.time()));
      lastSeek.current = seconds;
      busy.current = true;
      seekTween.current = tl.tweenTo(target, {
        duration: seconds,
        ease: "none",
        onComplete: () => {
          busy.current = false;
        },
      });
    },
    [tl]
  );

  const next = useCallback(() => goTo(idx.current + 1), [goTo]);
  const prev = useCallback(() => goTo(idx.current - 1), [goTo]);
  const jumpTo = useCallback((i) => goTo(i, { instant: true }), [goTo]);

  // Autoplay: same timeline, just let it run and keep the rail in sync.
  const togglePlay = useCallback(() => {
    if (!tl) return;
    seekTween.current?.kill();
    busy.current = false;
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
    if (!el || disabled) return;
    let locked = false;
    const onWheel = (e) => {
      e.preventDefault();
      if (locked || Math.abs(e.deltaY) < 4) return;
      locked = true;
      e.deltaY > 0 ? next() : prev();
      // Lock for however long the transition actually takes, so a trackpad's
      // long inertia tail cannot queue up and skip beats. Read after the move,
      // since goTo is what measures the distance.
      setTimeout(() => {
        locked = false;
      }, lastSeek.current * 1000 * 0.85);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [stageRef, next, prev, disabled]);

  // --- keyboard ------------------------------------------------------------
  useEffect(() => {
    if (disabled) return;
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
  }, [next, prev, togglePlay, disabled]);

  // --- touch swipe ---------------------------------------------------------
  useEffect(() => {
    const el = stageRef.current;
    if (!el || disabled) return;
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
  }, [stageRef, next, prev, disabled]);

  // Kill any in-flight scrub when the stage unmounts.
  useEffect(() => () => seekTween.current?.kill(), []);

  return { index, goTo, jumpTo, next, prev, playing, togglePlay };
}
