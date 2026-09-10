import { useEffect, useRef } from "react";

/**
 * Sets --sectionHeat on the timeline wrapper from whichever card is closest to
 * the middle of the viewport, so the section's accent drifts from molten to
 * blue as you read down through the years (Phase 3 in docs/JOURNEY_PLAN.md).
 *
 * Deliberately subtle — most readers won't notice consciously.
 */
export default function useTimelineHeat() {
  const ref = useRef(null);

  useEffect(() => {
    const wrapper = ref.current;
    if (!wrapper) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const items = Array.from(wrapper.querySelectorAll(".timeline-item"));
    if (!items.length) return;

    let queued = false;

    const update = () => {
      queued = false;
      const middle = window.innerHeight / 2;
      let closest = items[0];
      let best = Infinity;

      for (const item of items) {
        const box = item.getBoundingClientRect();
        const distance = Math.abs(box.top + box.height / 2 - middle);
        if (distance < best) {
          best = distance;
          closest = item;
        }
      }

      const heat = closest.style.getPropertyValue("--cardHeat") || "0";
      wrapper.style.setProperty("--sectionHeat", heat.trim());
    };

    const onScroll = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return ref;
}
