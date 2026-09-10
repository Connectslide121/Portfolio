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
 */
export function buildJourney({ root }) {
  const camera = { x: 0, heat: BEATS[0].heat };

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

  const drawTo = (i) => `0% ${Math.round(((i + 1) / BEATS.length) * 100)}%`;

  // --- beat 0 --------------------------------------------------------------
  tl.to(stream, { drawSVG: drawTo(0), duration: 1.4 }, 0)
    .to(cards[0], { autoAlpha: 1, y: 0, duration: 0.7 }, 0.5)
    .addLabel(BEATS[0].id);

  // --- beats 1..n ----------------------------------------------------------
  BEATS.slice(1).forEach((beat, idx) => {
    const i = idx + 1;

    tl.to(cards[i - 1], { autoAlpha: 0, y: -24, duration: 0.5 })
      // Camera and heat travel together: one tween, everything follows.
      .to(camera, { x: -i * SCENE_W, heat: beat.heat, duration: 2.4 }, "<")
      .to(stream, { drawSVG: drawTo(i), duration: 2.4 }, "<")
      .to(atmos[i], { autoAlpha: 1, duration: 1.3 }, "<0.5")
      .to(atmos[i - 1], { autoAlpha: 0, duration: 1.3 }, "<")
      .to(cards[i], { autoAlpha: 1, y: 0, duration: 0.7 }, "-=0.5")
      .addLabel(beat.id);

  });

  render();
  return { tl, camera, render };
}
