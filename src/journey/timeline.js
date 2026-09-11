import gsap from "gsap";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import {
  BEATS,
  LAYERS,
  SCENE_W,
  VANISH,
  SCENE_ANCHOR,
  CURRENT_ANCHOR,
  CURRENT_SCALE,
  DEPTH,
  PAST_MIN_OPACITY,
  OVERVIEW,
  OVERVIEW_BY_ID,
} from "./config";
import { applyHeat } from "./heat";

gsap.registerPlugin(DrawSVGPlugin);

// The architect scene used to achieve this framing by scaling the entire
// multi-slide SVG world during its reveal. Keeping the scale local preserves
// the composition without repainting every scene, ridge and particle.
const ARCHITECT_SCALE = 0.86;
const ARCHITECT_PIVOT = { x: SCENE_W / 2, y: 540 };

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
  // `overview` lifts the camera: 0 is the linear stage, 1 is the bird's-eye
  // layout of the closing recap. It is tweened by the timeline itself rather
  // than by a button, so arriving at the last beat IS the camera rising, and
  // stepping back lowers it again.
  const camera = { x: 0, heat: BEATS[0].heat, overview: 0 };

  // A portrait phone only shows roughly a quarter of the viewBox's width, so
  // the wide architecture graph cannot be read there however far the camera
  // pulls back. On narrow screens the final beat lists the stack as text in
  // the card instead (see .j-arch-chips), and the pull-back is skipped.
  const narrow = window.matchMedia("(max-width: 768px)").matches;

  // quickSetter avoids per-frame property lookups on the hot path.
  const setters = LAYERS.map((l) => ({
    set: gsap.quickSetter(
      root.querySelectorAll(`[data-layer="${l.id}"]`),
      "x",
      "px",
    ),
    k: l.k,
  }));

  const sceneEls = BEATS.map((_, i) =>
    root.querySelector(`[data-scene="${i}"]`),
  );

  /**
   * Places every scene from the camera position.
   *
   * A beat that is still ahead waits off to the right at full size and slides
   * in. A beat that has passed does NOT keep panning off to the left — it
   * recedes: its ground-contact point travels toward VANISH near the horizon
   * while it shrinks, so the journey builds up a row of earlier places
   * dwindling into the distance instead of throwing them away.
   *
   * This is a perspective divide, not a lerp: scale is 1/(1 + t·DEPTH), and
   * the anchor moves by that same factor, which is what keeps a shrinking
   * scene sitting on the ground rather than sliding along it.
   */
  const projectScenes = () => {
    const p = -camera.x / SCENE_W; // continuous position along the beats
    for (let i = 0; i < sceneEls.length; i++) {
      const el = sceneEls[i];
      if (!el) continue;
      const d = i - p; // < 0 past, 0 current, > 0 still to come
      const t = -d;

      let tx = 0;
      let ty = 0;
      let scale = 1;
      let opacity = 1;
      let past = false;
      const ov = camera.overview;

      let ax = CURRENT_ANCHOR.x;
      let ay = CURRENT_ANCHOR.y;

      if (d >= 0) {
        scale = CURRENT_SCALE;
        ax += d * SCENE_W * CURRENT_SCALE; // waiting off-stage right
        opacity = d > 0.85 ? 0 : 1;
      } else {
        past = true;
        scale = CURRENT_SCALE / (1 + t * DEPTH);
        // u falls 1 -> 0 with depth, carrying the anchor to the vanishing point.
        const u = scale / CURRENT_SCALE;
        ax = VANISH.x + (CURRENT_ANCHOR.x - VANISH.x) * u;
        ay = VANISH.y + (CURRENT_ANCHOR.y - VANISH.y) * u;
        opacity = Math.max(PAST_MIN_OPACITY, 1 - t * 0.27);
      }

      // Blend toward the bird's-eye placement. Silhouettes stay upright —
      // they are elevations, and laying them flat would read as broken — so
      // the "camera lift" is carried by the layout and the scale, not by
      // skewing the art.
      if (ov > 0) {
        const spot = OVERVIEW_BY_ID[BEATS[i].id];
        if (spot) {
          ax += (spot.x - ax) * ov;
          ay += (spot.y - ay) * ov;
          scale += (spot.s - scale) * ov;
          opacity += (1 - opacity) * ov; // everything is present up there
        } else {
          opacity *= 1 - ov; // no place to show (the work gallery)
        }
      }

      if (BEATS[i].id === "architect") {
        // Ease the local framing back to 1 as the recap camera rises; a hard
        // cutoff here would simply move the hitch to the following slide.
        const restore = Math.min(1, ov / 0.2);
        const localScale = ARCHITECT_SCALE + (1 - ARCHITECT_SCALE) * restore;
        scale *= localScale;
        ax = ARCHITECT_PIVOT.x + (ax - ARCHITECT_PIVOT.x) * localScale;
        ay = ARCHITECT_PIVOT.y + (ay - ARCHITECT_PIVOT.y) * localScale;
      }

      tx = ax - SCENE_ANCHOR.x * scale;
      ty = ay - SCENE_ANCHOR.y * scale;

      el.setAttribute(
        "transform",
        `translate(${tx.toFixed(1)},${ty.toFixed(1)}) scale(${scale.toFixed(4)})`,
      );
      el.setAttribute("opacity", opacity.toFixed(3));

      // Soften the edges once a beat starts receding, and only then — the
      // current scene must always be whole and hard-edged.
      const wantMask = past && t > 0.2 && ov < 0.2;
      const applied = el.getAttribute("mask");
      const next = wantMask ? "url(#jFade)" : "";
      if (applied !== next) {
        if (next) el.setAttribute("mask", next);
        else el.removeAttribute("mask");
      }
    }
  };

  // The parallax environment belongs to the linear stage; from above it is
  // just noise, so it recedes as the camera lifts.
  const envLayers = root.querySelectorAll("[data-layer]");
  const particleGroups = root.querySelectorAll("[data-particle-scene]");
  const ovPath = root.querySelector("[data-ov-path]");
  const ovTrail = root.querySelectorAll("[data-ov-trail]");
  const ovDots = root.querySelectorAll("[data-ov-dot]");
  let activeParticleScene = -1;

  const render = () => {
    setters.forEach((s) => s.set(camera.x * s.k));
    projectScenes();
    applyHeat(root, camera.heat);

    // Only the nearest beat's atmosphere needs to consume animation frames.
    // Previously every hidden scene kept 12-22 GSAP particle tweens alive.
    const nearestScene = Math.max(
      0,
      Math.min(BEATS.length - 1, Math.round(-camera.x / SCENE_W)),
    );
    if (nearestScene !== activeParticleScene) {
      activeParticleScene = nearestScene;
      // Published for Particles: switching season recreates a group's tweens
      // after this loop last ran, and they need to know who is on stage.
      root.dataset.activeScene = String(nearestScene);
      particleGroups.forEach((group) => {
        group.__setParticleActive?.(
          Number(group.getAttribute("data-particle-scene")) ===
            activeParticleScene,
        );
      });
    }

    const ov = camera.overview;
    const env = (1 - ov * 0.82).toFixed(3);
    envLayers.forEach((el) => el.setAttribute("opacity", env));
    // The stack is a diagram, not a place — unreadable once laid out, so it
    // goes as the camera rises and the office behind it carries the beat.
    if (archGroup)
      archGroup.setAttribute("opacity", (1 - Math.min(1, ov * 1.6)).toFixed(3));

    if (ovPath) {
      ovPath.setAttribute("opacity", Math.min(1, ov * 1.4).toFixed(3));
      // Draw the trail on as the camera rises; the road appears as you gain
      // the height to see it.
      const drawn = Math.max(0, Math.min(1, (ov - 0.15) / 0.7));
      ovTrail.forEach((el) => {
        el.setAttribute("stroke-dasharray", "1 1");
        el.setAttribute("stroke-dashoffset", (1 - drawn).toFixed(4));
      });
      ovDots.forEach((el, i) => {
        const lit = Math.max(0, Math.min(1, drawn * OVERVIEW.length - i));
        el.setAttribute("opacity", lit.toFixed(3));
        el.setAttribute("r", (3 + lit * 3).toFixed(2));
      });
    }
  };

  // Every scene-specific group for a beat — props, numerals, particles — is
  // tagged data-atmos and crossfaded together, which also hides the scene
  // bleed that slow parallax layers unavoidably produce (see config.js).
  const atmos = BEATS.map((b) =>
    Array.from(root.querySelectorAll(`[data-atmos="${b.id}"]`)),
  );
  const cards = BEATS.map((b) => root.querySelector(`[data-card="${b.id}"]`));
  const stream = root.querySelectorAll("[data-stream]");
  const architectVisual = root.querySelector("[data-architect-visual]");
  const archGroup = root.querySelector("[data-arch]");
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
  gsap.set(architectVisual, {
    scale: 1 / ARCHITECT_SCALE,
    svgOrigin: `${ARCHITECT_PIVOT.x} ${ARCHITECT_PIVOT.y}`,
  });
  gsap.set(archNodes, {
    autoAlpha: 0,
    scale: 0.86,
    transformOrigin: "50% 50%",
  });
  gsap.set(archEdges, { drawSVG: "0% 0%" });

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
      .to(
        camera,
        {
          x: -i * SCENE_W,
          heat: beat.heat,
          overview: beat.id === "recap" ? 1 : 0,
          duration: 2.4,
        },
        "<",
      )
      .to(stream, { drawSVG: drawTo(i), duration: 2.4 }, "<")
      .to(atmos[i], { autoAlpha: 1, duration: 1.3 }, "<0.5")
      .to(atmos[i - 1], { autoAlpha: 0, duration: 1.3 }, "<");

    if (isArchitect && !narrow) {
      // Keep the full pull-back, connector draw and staggered node build. The
      // surrounding optimisations reduce contention without flattening this
      // signature transition.
      tl.to(architectVisual, { scale: 1, duration: 2.2 }, "<0.6")
        .to(
          archEdges,
          { drawSVG: "0% 100%", duration: 1.1, stagger: 0.03 },
          "<0.7",
        )
        .to(
          archNodes,
          {
            autoAlpha: 1,
            scale: 1,
            duration: 0.5,
            stagger: 0.04,
            ease: "back.out(1.6)",
          },
          "<0.1",
        );
    }

    tl.to(cards[i], { autoAlpha: 1, y: 0, duration: 0.7 }, "-=0.5").addLabel(
      beat.id,
    );
  });

  render();
  return { tl, camera, render };
}
