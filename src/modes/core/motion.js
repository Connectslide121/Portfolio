import { useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

export { gsap, ScrollTrigger, SplitText };

export const MOTION = "(prefers-reduced-motion: no-preference)";
export const WIDE = "(min-width: 900px)";

/**
 * Runs a section's motion inside a GSAP context scoped to `scope`, and only
 * for visitors who allow motion: `setup` is called through gsap.matchMedia,
 * so nothing is created under reduced motion and the section keeps its
 * static, final layout. Everything is reverted on unmount and when the
 * preference changes. `setup` gets the matchMedia conditions ({ motion, wide })
 * so a section can do less on narrow screens.
 *
 * Every animation starts FROM a hidden state in script (gsap.from), never in
 * CSS, so without script, or with reduced motion, all content is simply there.
 */
export function useMotion(scope, setup, deps = []) {
  useLayoutEffect(() => {
    const mm = gsap.matchMedia(scope.current || undefined);
    mm.add({ motion: MOTION, wide: WIDE }, (ctx) => {
      if (!ctx.conditions.motion) return undefined;
      return setup(ctx.conditions, scope.current);
    });
    return () => mm.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

/** Lines that slide up out of a mask: the headline reveal used everywhere. */
export function revealLines(el, vars = {}) {
  const split = SplitText.create(el, { type: "lines", mask: "lines", linesClass: "line" });
  gsap.from(split.lines, { yPercent: 110, duration: 1.1, ease: "expo.out", stagger: 0.08, ...vars });
  return split;
}
