import { useCallback, useEffect, useRef, useState } from "react";
import { BEATS } from "./config";

/**
 * Every input funnels into exactly one operation: tweenTo(label).
 * Adding a new way to advance never touches the animation (4.1 in the plan).
 *
 * Nothing here waits its turn. A move in flight is always interruptible: the
 * next one retargets from wherever the playhead has got to, rather than being
 * dropped on the floor until the first has finished (D69).
 */

/**
 * The knobs for how the wheel feels. All three are about telling a hand that
 * means it apart from a trackpad's inertial tail.
 */
// Between one beat and the next while the wheel keeps turning. Long enough
// that a flick is one beat, short enough that a real scroll flows.
const STEP_GAP = 300;
// Pixels to start moving at all, from rest.
const FIRST_NUDGE = 12;
// Pixels to take ANOTHER beat without the gesture having paused. Higher than
// the first on purpose: a decaying inertial tail should not keep spending.
const NEXT_NUDGE = 48;
// A quiet this long starts a fresh gesture.
const GESTURE_GAP = 180;

/** The longest a single stepped move may take, however far behind it is. */
const STEP_MAX = 2.4;

export function useJourneyDriver(tl, stageRef, disabled = false, startIndex = 0) {
  // startIndex matters: a deep link seeks the timeline directly, and if the
  // driver still believed it was at beat 0 it would ignore a click on beat 0.
  const [index, setIndex] = useState(startIndex);
  const idx = useRef(startIndex);
  const seekTween = useRef(null);

  const goTo = useCallback(
    (next, { fast = false } = {}) => {
      if (!tl) return false;
      const clamped = Math.max(0, Math.min(BEATS.length - 1, next));
      const from = idx.current;
      if (clamped === from) return false;

      const target = tl.labels[BEATS[clamped].id];
      // Whatever was moving, this is moving now. There used to be a lock here
      // that dropped any input until the previous move had finished, plus a
      // settling window after it — about two and a half seconds during which
      // the journey ignored you. That is what "I have to scroll a couple of
      // times" was.
      seekTween.current?.kill();

      idx.current = clamped;
      setIndex(clamped);

      // A stepped move scrubs at the timeline's OWN rate: duration = the
      // actual time distance, so one step plays at the rate it was authored
      // at — but capped, because an interrupted move measures from where the
      // playhead actually is. Without the cap, each chained step had further
      // to go than the last and took longer doing it, so the story fell
      // steadily further behind the hand.
      //
      // A pick off the map gets its own budget instead, weighted toward the
      // distance travelled: a neighbour is a hop, 2005 -> today is a journey
      // you can actually watch go past. Still far quicker than the natural
      // rate (2.4s per beat, so ~17s end to end), and it never dwells on the
      // beats in between — that was what made replaying them unusable.
      const seconds = fast
        ? Math.min(2.8, 0.6 + Math.abs(clamped - from) * 0.28)
        : Math.max(0.35, Math.min(STEP_MAX, Math.abs(target - tl.time())));

      seekTween.current = tl.tweenTo(target, {
        duration: seconds,
        // The ease lives here rather than on the timeline's per-beat tweens,
        // which are linear (see timeline.js). One ease across the whole move
        // means a long travel accelerates once and settles once, instead of
        // coming to a halt at every beat it passes through.
        ease: "power2.inOut",
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
    let lastStepAt = 0;
    let stepsThisGesture = 0;

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

      // deltaMode 0 is pixels, 1 is lines and 2 is pages. Normalising lets a
      // mouse-wheel notch and several tiny precision-trackpad events express
      // the same amount of intent.
      const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? window.innerHeight : 1;
      const delta = e.deltaY * unit;
      if (!delta) return;

      // A pause starts a fresh gesture; reversing direction should not have
      // to cancel an old gesture before it can act.
      if (
        now - lastEventAt > GESTURE_GAP ||
        (intent && Math.sign(delta) !== Math.sign(intent))
      ) {
        intent = 0;
        stepsThisGesture = 0;
      }
      lastEventAt = now;
      intent += delta;

      // The only thing between beats now is a short rhythm, not the length of
      // the animation: keep scrolling and the journey keeps stepping, each
      // move picking up from wherever the last one had reached.
      if (now - lastStepAt < STEP_GAP) return;
      if (Math.abs(intent) < (stepsThisGesture ? NEXT_NUDGE : FIRST_NUDGE)) return;

      const moved = intent > 0 ? next() : prev();
      intent = 0;
      if (moved) {
        stepsThisGesture++;
        lastStepAt = now;
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
    let scrolling = false;

    const start = (e) => {
      x0 = e.touches[0].clientX;
      y0 = e.touches[0].clientY;
      // A gesture that begins inside something that scrolls belongs to that
      // thing, vertically. The recap's work list and an open sheet are the
      // only two, and on both a drag down means "read on", not "next beat" —
      // a sideways flick over them still steps the journey.
      scrolling = !!e.target.closest?.(".j-worklist, .j-sheet-panel");
    };

    const end = (e) => {
      if (x0 == null) return;
      const dx = e.changedTouches[0].clientX - x0;
      const dy = e.changedTouches[0].clientY - y0;
      const horizontal = Math.abs(dx) > Math.abs(dy);

      // Whichever way the thumb actually went. The journey travels sideways,
      // so left means forward — but a phone reader flicks UP to go on, the
      // way every other page on their screen works, and before this that
      // gesture did nothing at all.
      if (horizontal) {
        if (Math.abs(dx) > 48) (dx < 0 ? next : prev)();
      } else if (!scrolling && Math.abs(dy) > 48) {
        (dy < 0 ? next : prev)();
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
