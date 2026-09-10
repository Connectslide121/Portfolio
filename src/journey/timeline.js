import gsap from "gsap";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { BEATS, LAYERS, SCENE_W, PATH_START, PATH_SPAN } from "./config";
import { applyHeat } from "./heat";

gsap.registerPlugin(DrawSVGPlugin);

/**
 * Builds the whole journey as ONE PAUSED timeline with a label per beat.
 *
 * This function knows nothing about input. Drivers (wheel, keys, swipe, rail,
 * autoplay) only ever seek this timeline via tweenTo(label). That decoupling is
 * the core of the design — see 4.1 in docs/JOURNEY_PLAN.md.
 *
 * Because every driver scrubs the same timeline at its natural rate, stepping
 * through beats feels identical to letting it autoplay.
 */
export function buildJourney({ root }) {
  const camera = { x: 0, heat: BEATS[0].heat };

  // A portrait phone only shows roughly a quarter of the viewBox's width, so
  // the wide architecture graph cannot be read there however far the camera
  // pulls back. On narrow screens the final beat lists the stack as text in
  // the card instead (see .j-arch-chips), and the pull-back is skipped.
  const narrow = window.matchMedia("(max-width: 768px)").matches;

  // quickSetter avoids per-frame property lookups on the hot path.
  const setters = LAYERS.map((l) => ({
    set: gsap.quickSetter(root.querySelectorAll(`[data-layer="${l.id}"]`), "x", "px"),
    k: l.k,
  }));

  const render = () => {
    setters.forEach((s) => s.set(camera.x * s.k));
    applyHeat(root, camera.heat);
  };

  // Every scene-specific group for a beat — props, numerals, particles — is
  // tagged data-atmos and crossfaded together, which also hides the scene
  // bleed that slow parallax layers unavoidably produce (see config.js).
  const atmos = BEATS.map((b) =>
    Array.from(root.querySelectorAll(`[data-atmos="${b.id}"]`))
  );
  const cards = BEATS.map((b) => root.querySelector(`[data-card="${b.id}"]`));
  const stream = root.querySelectorAll("[data-stream]");
  const cameraGroup = root.querySelector("[data-camera]");
  const archNodes = root.querySelectorAll("[data-arch-node]");
  const archEdges = root.querySelectorAll("[data-arch-edge] path");

  const tl = gsap.timeline({
    paused: true,
    defaults: { ease: "power2.inOut" },
    onUpdate: render,
  });

  // --- initial state -------------------------------------------------------
  gsap.set(cards, { autoAlpha: 0, y: 24 });
  gsap.set(atmos.slice(1).flat(), { autoAlpha: 0 });
  gsap.set(atmos[0], { autoAlpha: 1 });
  gsap.set(stream, { drawSVG: "0% 0%" });
  gsap.set(archNodes, { autoAlpha: 0, scale: 0.86, transformOrigin: "50% 50%" });
  gsap.set(archEdges, { drawSVG: "0% 0%" });
  gsap.set(cameraGroup, { scale: 1, svgOrigin: `${SCENE_W / 2} 540` });

  /**
   * How far the stream should be drawn on arriving at beat i.
   *
   * DrawSVG works in percentages of path LENGTH, but the path overdraws well
   * past the world on both sides (see OVERDRAW), so a naive (i+1)/n runs the
   * leading edge ahead of the camera — by the third beat it has already left
   * the frame and you stop seeing it draw at all. Derive the percentage from
   * the world x we actually want the leading edge at instead: just inside the
   * right-hand edge of the view, so the tip stays visible on every beat.
   */
  const LEAD = 0.82; // fraction across the settled view
  const drawTo = (i) => {
    if (i === BEATS.length - 1) return "0% 100%"; // reach the architecture
    const leadX = i * SCENE_W + SCENE_W * LEAD;
    const pct = ((leadX - PATH_START) / PATH_SPAN) * 100;
    return `0% ${pct.toFixed(1)}%`;
  };

  // --- beat 0 --------------------------------------------------------------
  tl.to(stream, { drawSVG: drawTo(0), duration: 1.4 }, 0)
    .to(cards[0], { autoAlpha: 1, y: 0, duration: 0.7 }, 0.5)
    .addLabel(BEATS[0].id);

  // --- beats 1..n ----------------------------------------------------------
  BEATS.slice(1).forEach((beat, idx) => {
    const i = idx + 1;
    const isFinal = i === BEATS.length - 1;

    tl.to(cards[i - 1], { autoAlpha: 0, y: -24, duration: 0.5 })
      // Camera and heat travel together: one tween, everything follows.
      .to(camera, { x: -i * SCENE_W, heat: beat.heat, duration: 2.4 }, "<")
      .to(stream, { drawSVG: drawTo(i), duration: 2.4 }, "<")
      .to(atmos[i], { autoAlpha: 1, duration: 1.3 }, "<0.5")
      .to(atmos[i - 1], { autoAlpha: 0, duration: 1.3 }, "<");

    if (isFinal && !narrow) {
      // The payoff: the camera pulls back and the stream stops being a line —
      // it branches into the system that actually shipped.
      tl.to(cameraGroup, { scale: 0.82, duration: 2.2 }, "<0.6")
        .to(archEdges, { drawSVG: "0% 100%", duration: 1.6, stagger: 0.08 }, "<0.5")
        .to(
          archNodes,
          { autoAlpha: 1, scale: 1, duration: 0.7, stagger: 0.09, ease: "back.out(1.6)" },
          "<0.2"
        );
    }

    tl.to(cards[i], { autoAlpha: 1, y: 0, duration: 0.7 }, "-=0.5").addLabel(beat.id);
  });

  render();
  return { tl, camera, render };
}
