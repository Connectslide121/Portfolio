import gsap from "gsap";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { BEATS, LAYERS, SCENE_W } from "./config";
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

  // The stream is screen-anchored now, so its fill is simply how far through
  // the journey you are: it starts at the left and reaches the right edge on
  // the final beat, reading as a progress bar.
  const drawTo = (i) => `0% ${(((i + 1) / BEATS.length) * 100).toFixed(1)}%`;

  // --- beat 0 --------------------------------------------------------------
  tl.to(stream, { drawSVG: drawTo(0), duration: 1.4 }, 0)
    .to(cards[0], { autoAlpha: 1, y: 0, duration: 0.7 }, 0.5)
    .addLabel(BEATS[0].id);

  // --- beats 1..n ----------------------------------------------------------
  BEATS.slice(1).forEach((beat, idx) => {
    const i = idx + 1;
    // Key the special-case on the beat ID, never the index — adding the
    // closing "work" beat silently moved this onto the wrong beat when it
    // was `i === BEATS.length - 1`.
    const isArchitect = beat.id === "architect";

    tl.to(cards[i - 1], { autoAlpha: 0, y: -24, duration: 0.5 })
      // Camera and heat travel together: one tween, everything follows.
      .to(camera, { x: -i * SCENE_W, heat: beat.heat, duration: 2.4 }, "<")
      .to(stream, { drawSVG: drawTo(i), duration: 2.4 }, "<")
      .to(atmos[i], { autoAlpha: 1, duration: 1.3 }, "<0.5")
      .to(atmos[i - 1], { autoAlpha: 0, duration: 1.3 }, "<");

    if (isArchitect && !narrow) {
      // The payoff: the camera pulls back and the stream stops being a line —
      // it branches into the system that actually shipped.
      tl.to(cameraGroup, { scale: 0.7, duration: 2.2 }, "<0.6")
        .to(archEdges, { drawSVG: "0% 100%", duration: 1.1, stagger: 0.03 }, "<0.7")
        .to(
          archNodes,
          { autoAlpha: 1, scale: 1, duration: 0.5, stagger: 0.04, ease: "back.out(1.6)" },
          "<0.1"
        );
    }

    // Come back to normal framing once past the stack, so the closing beat
    // is not viewed through a zoomed-out camera.
    if (beat.id === "work" && !narrow) {
      tl.to(cameraGroup, { scale: 1, duration: 1.8 }, "<0.3");
    }

    tl.to(cards[i], { autoAlpha: 1, y: 0, duration: 0.7 }, "-=0.5").addLabel(beat.id);
  });

  render();
  return { tl, camera, render };
}
