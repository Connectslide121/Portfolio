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
  const busy = useRef(false);
  const idx = useRef(startIndex);
  const lastSeek = useRef(1);
  const seekTween = useRef(null);

  const goTo = useCallback(
    (next, { fast = false } = {}) => {
      if (!tl) return false;
      const clamped = Math.max(0, Math.min(BEATS.length - 1, next));
      const from = idx.current;
      if (clamped === from) return false;
      // A pick off the map may always interrupt a transition in flight; a
      // stepped move waits its turn so gestures cannot queue up.
      if (busy.current && !fast) return false;

      const target = tl.labels[BEATS[clamped].id];
      seekTween.current?.kill();

      idx.current = clamped;
      setIndex(clamped);

      // A stepped move scrubs at the timeline's OWN rate: duration = the
      // actual time distance, so one step plays at the rate it was authored
      // at.
      //
      // A pick off the map gets its own budget instead, weighted toward the
      // distance travelled: a neighbour is a hop, 2005 -> today is a journey
      // you can actually watch go past. Still far quicker than the natural
      // rate (2.4s per beat, so ~17s end to end), and it never dwells on the
      // beats in between — that was what made replaying them unusable.
      const seconds = fast
        ? Math.min(2.8, 0.6 + Math.abs(clamped - from) * 0.28)
        : Math.max(0.35, Math.abs(target - tl.time()));

      lastSeek.current = seconds;
      busy.current = true;
      seekTween.current = tl.tweenTo(target, {
        duration: seconds,
        // The ease lives here rather than on the timeline's per-beat tweens,
        // which are linear (see timeline.js). One ease across the whole move
        // means a long travel accelerates once and settles once, instead of
        // coming to a halt at every beat it passes through.
        ease: "power2.inOut",
        onComplete: () => {
          busy.current = false;
        },
      });
      return true;
    },
    [tl]
  );

  const next = useCallback(() => goTo(idx.current + 1), [goTo]);
  const prev = useCallback(() => goTo(idx.current - 1), [goTo]);
  const jumpTo = useCallback((i) => goTo(i, { fast: true }), [goTo]);

  // --- wheel: one gesture = one beat, so you always land on a beat ---------
  useEffect(() => {
    const el = stageRef.current;
    if (!el || disabled) return;
    let intent = 0;
    let lastEventAt = 0;
    let readyAt = 0;

    const onWheel = (e) => {
      // The recap's narrow-screen work list scrolls on its own. A wheel over
      // it belongs to the list until the list runs out of travel; only then
      // does the gesture go back to stepping the journey.
      const list = e.target.closest?.(".j-worklist");
      if (list && list.scrollHeight > list.clientHeight + 1) {
        const spent =
          e.deltaY > 0
            ? list.scrollTop + list.clientHeight >= list.scrollHeight - 1
            : list.scrollTop <= 0;
        if (!spent) return;
      }

      e.preventDefault();
      const now = performance.now();

      // Never turn an ignored event near the end of an animation into a new
      // lock. That was the source of the intermittent "scroll a lot" feeling.
      if (busy.current || now < readyAt) return;

      // deltaMode 0 is pixels, 1 is lines and 2 is pages. Normalising lets a
      // mouse-wheel notch and several tiny precision-trackpad events express
      // the same amount of intent.
      const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? window.innerHeight : 1;
      const delta = e.deltaY * unit;
      if (!delta) return;

      // A pause starts a fresh gesture; reversing direction should not have
      // to cancel an old gesture before it can act.
      if (now - lastEventAt > 180 || (intent && Math.sign(delta) !== Math.sign(intent))) {
        intent = 0;
      }
      lastEventAt = now;
      intent += delta;

      if (Math.abs(intent) < 12) return;
      const moved = intent > 0 ? next() : prev();
      intent = 0;

      if (moved) {
        // The inertial tail is ignored until the transition has genuinely
        // finished, plus a tiny settling window. A fresh gesture then reacts
        // immediately instead of inheriting a stale lock.
        readyAt = now + lastSeek.current * 1000 + 100;
      }
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
      // Space reads as "next" in anything slideshow-shaped.
      if (e.key === " ") {
        e.preventDefault();
        next();
        return;
      }
      if (map[e.key]) {
        e.preventDefault();
        map[e.key]();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev, disabled]);

  // --- touch swipe ---------------------------------------------------------
  useEffect(() => {
    const el = stageRef.current;
    if (!el || disabled) return;
    let x0 = null;
    let y0 = null;
    const start = (e) => {
      x0 = e.touches[0].clientX;
      y0 = e.touches[0].clientY;
    };
    const end = (e) => {
      if (x0 == null) return;
      const dx = e.changedTouches[0].clientX - x0;
      const dy = e.changedTouches[0].clientY - y0;
      // Horizontal intent only. The recap's work list scrolls vertically, and
      // a thumb dragging down it drifts sideways enough to have counted as a
      // swipe and thrown the reader onto another beat.
      if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy)) {
        (dx < 0 ? next : prev)();
      }
      x0 = null;
      y0 = null;
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

  return { index, goTo, jumpTo, next, prev };
}
