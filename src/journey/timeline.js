import gsap from "gsap";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import {
  BEATS,
  BASE,
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
  HAZE_MAX,
  HAZE_DEPTH,
  SETTLE_PUSH,
  SETTLE_DROP,
  LEAN_X,
  LEAN_Y,
} from "./config";
import {
  applyHeat,
  heatPalette,
  lerpChannels,
  channelsToHex,
} from "./heat";

gsap.registerPlugin(DrawSVGPlugin);

// The architect scene used to achieve this framing by scaling the entire
// multi-slide SVG world during its reveal. Keeping the scale local preserves
// the composition without repainting every scene, ridge and particle.
const ARCHITECT_SCALE = 0.86;
const ARCHITECT_PIVOT = { x: SCENE_W / 2, y: 540 };

// The heat variables the scene art actually paints with (see scenes.jsx and
// the india sun in World.jsx). Anything else on the ramp belongs to the sky
// and the ground, which stay shared: from above there is one sky, but each
// place keeps its own light.
//
// `far` is on the list because the silhouette gradient's hazy top stop reads
// it (SilGradient in parts.jsx); it was not needed while the masses were a
// flat --j-mid.
const TINT_KEYS = ["mid", "far", "ground", "stream", "streamCore", "accent"];

// Depth haze only touches the two the silhouette itself is painted with.
// Putting sky in front of a place's LIGHTS as well would be wrong: a distant
// window is dimmer, not bluer, and hazing --j-stream drained the one thing
// still identifying a receding beat.
const HAZE_KEYS = ["mid", "far"];

// The camera's zoom pivots on the ground line, not the frame centre: pivoting
// mid-air slides every silhouette off the floor as it breathes.
const ZOOM_PIVOT = { x: SCENE_W / 2, y: BASE };

// The scene plane's parallax rate, for pointer lean. Scenes are not inside a
// [data-layer] group — they are placed by projectScenes — so they do not pick
// the rate up from the layer table and have to be told it.
const SCENE_LEAN_K = LAYERS.find((l) => l.id === "scene").k;

// Each beat's own palette, built once per theme rather than per frame.
const OWN_PALETTES = { true: null, false: null };
const ownPalettes = (dark) => {
  const key = String(dark);
  if (!OWN_PALETTES[key])
    OWN_PALETTES[key] = BEATS.map((b) => heatPalette(b.heat, dark));
  return OWN_PALETTES[key];
};

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
  // leanX/leanY are the pointer tilt. They are NOT tweened by the timeline —
  // they belong to the viewer, not to the story — but they feed the same
  // render(), so the two compose without either knowing about the other.
  const camera = {
    x: 0,
    heat: BEATS[0].heat,
    overview: 0,
    leanX: 0,
    leanY: 0,
  };

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
  // How much sky sits in front of each scene this frame, filled by
  // projectScenes and consumed by the colour pass below it.
  const hazes = new Array(sceneEls.length).fill(0);

  const projectScenes = () => {
    const p = -camera.x / SCENE_W; // continuous position along the beats

    // The camera breathes with the move: eased back and lifted while
    // travelling, settled on arrival. Derived from the FRACTIONAL position
    // rather than tweened per beat, which is what makes it scrub correctly in
    // both directions, at any speed, and from any starting point — a tween
    // bolted onto each beat segment would have to be unwound by hand on the
    // way back.
    //
    // It rests at 1 and pulls back, never the other way round: the framing on
    // a beat is the one CURRENT_SCALE and CURRENT_ANCHOR were tuned against,
    // so arrival must not crop tighter than it does today.
    const travel = Math.min(1, Math.abs(p - Math.round(p)) * 2);
    const still = 1 - camera.overview; // the lift owns the framing up there
    const zoom = 1 - SETTLE_PUSH * travel * still;
    const rise = SETTLE_DROP * travel * still;
    const leanX = camera.leanX * SCENE_LEAN_K * still;

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

      // Camera breath, about the ground line so a scene cannot drift off the
      // floor while it happens, then the pointer tilt.
      if (zoom !== 1) {
        scale *= zoom;
        ax = ZOOM_PIVOT.x + (ax - ZOOM_PIVOT.x) * zoom;
        ay = ZOOM_PIVOT.y + (ay - ZOOM_PIVOT.y) * zoom;
      }
      ax += leanX;
      ay += rise;

      // Aerial perspective. Depth used to be carried by opacity alone, which
      // reads as a thing fading out rather than a thing far away; this is how
      // much of the sky's own colour the colour pass puts in front of it. It
      // is scaled out early in the lift because from above there is no depth
      // left to describe — every place is the same distance from the camera.
      hazes[i] = past
        ? Math.min(1, t / HAZE_DEPTH) *
          HAZE_MAX *
          Math.max(0, 1 - camera.overview / 0.25)
        : 0;

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
  const cameraGroup = root.querySelector("[data-camera]");
  let activeParticleScene = -1;
  // What was last written to each scene's style, so a frame that changes
  // nothing costs no setProperty calls. Replaces a single "are any overrides
  // live" flag, which was enough while only the lift wrote them and is not
  // now that depth haze writes them on ordinary travel too.
  const tintCache = sceneEls.map(() => ({}));
  // Whether any overrides are currently written, so the clearing pass runs
  // once on the way out instead of every frame.
  let tintsLive = false;

  const render = () => {
    // Pointer lean rides the same depth rates as the camera's own travel, so
    // a near layer tips further than a far one for free. It is scaled out by
    // the lift: from above, tilting the plan would just be wobble.
    const leanStill = 1 - camera.overview;
    const lean = camera.leanX * leanStill;
    setters.forEach((s) => s.set((camera.x + lean) * s.k));
    if (cameraGroup) {
      cameraGroup.setAttribute(
        "transform",
        `translate(0,${(camera.leanY * leanStill).toFixed(2)})`,
      );
    }
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

    // Laid out from above, every place was painted in the CURRENT heat, so
    // the foundry years arrived looking like the cold Swedish evening of the
    // beat you just left. As the camera lifts, each place blends back to its
    // own heat: the arc from molten to cold becomes visible in the art
    // itself, not only in the trail drawn between the places.
    // Two effects want to override a scene's colour, and both land on
    // --j-mid, so they are resolved together in one pass rather than being
    // allowed to overwrite each other:
    //
    //   * the LIFT blends each place back toward its own heat, because laid
    //     out from above every place was painted in the CURRENT heat — the
    //     foundry years arrived looking like the cold Swedish evening of the
    //     beat you just left;
    //   * DEPTH HAZE puts the sky's own colour in front of a receding place.
    //
    // Haze is already scaled out by the lift in projectScenes, so by the time
    // the blend matters the two no longer disagree about any key.
    const hazing = hazes.some((h) => h > 0.004);
    if (ov > 0.001 || hazing || tintsLive) {
      const dark = document.body.classList.contains("dark-theme");
      const now = heatPalette(camera.heat, dark);
      const own = ownPalettes(dark);
      const sky = now.sky1;
      tintsLive = false;

      for (let i = 0; i < sceneEls.length; i++) {
        const el = sceneEls[i];
        if (!el) continue;
        const cache = tintCache[i];
        const haze = hazes[i];
        // The work gallery is not a place, so it has no laid-out spot and
        // nothing to blend back toward.
        const blendOwn = ov > 0.001 && !!OVERVIEW_BY_ID[BEATS[i].id];

        if (!blendOwn && haze <= 0.004) {
          for (const key in cache) el.style.removeProperty(`--j-${key}`);
          if (Object.keys(cache).length) tintCache[i] = {};
          continue;
        }

        tintsLive = true;
        // Haze alone only needs the two keys the silhouette is painted with;
        // the lift needs the full set.
        const keys = blendOwn ? TINT_KEYS : HAZE_KEYS;
        for (const key of keys) {
          let channels = blendOwn
            ? lerpChannels(now[key], own[i][key], ov)
            : now[key];
          if (haze > 0.004 && HAZE_KEYS.includes(key)) {
            channels = lerpChannels(channels, sky, haze);
          }
          const value = channelsToHex(channels);
          if (cache[key] !== value) {
            el.style.setProperty(`--j-${key}`, value);
            cache[key] = value;
          }
        }
        // Keys this frame no longer writes (the lift just ended, haze alone
        // remains) would otherwise stay frozen at their last lift value.
        for (const key in cache) {
          if (!keys.includes(key)) {
            el.style.removeProperty(`--j-${key}`);
            delete cache[key];
          }
        }
      }
    }

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
  const numerals = BEATS.map((b) =>
    root.querySelector(`[data-numeral="${b.id}"]`),
  );
  const bloom = root.querySelector("[data-bloom]");
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
  gsap.set(bloom, { autoAlpha: 0 });
  // The numerals are the loudest thing in the frame and they used to arrive
  // by crossfade, which is the one entrance that cannot land. They are set up
  // oversized and offset so each one can be driven home on arrival instead.
  gsap.set(numerals.filter(Boolean), {
    transformOrigin: "50% 50%",
    scale: 1.18,
    x: 54,
  });
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
      //
      // LINEAR, against the timeline's power2.inOut default. The ease for a
      // move belongs to the playhead, not to each segment: with it here, the
      // camera decelerated to a standstill at every beat boundary, so a pick
      // that crossed six of them stopped six times on the way. The driver now
      // eases the playhead instead, which gives a single step exactly the
      // same motion and a long travel one continuous glide.
      .to(
        camera,
        {
          x: -i * SCENE_W,
          heat: beat.heat,
          overview: beat.id === "recap" ? 1 : 0,
          duration: 2.4,
          ease: "none",
        },
        "<",
      )
      // Travels with the camera, so it has to share the camera's ease or the
      // progress bar drifts against the move it is reporting.
      .to(stream, { drawSVG: drawTo(i), duration: 2.4, ease: "none" }, "<")
      .to(atmos[i], { autoAlpha: 1, duration: 1.3 }, "<0.5")
      .to(atmos[i - 1], { autoAlpha: 0, duration: 1.3 }, "<");

    // The year lands rather than fades: it comes in oversized and trailing
    // the camera, then is driven home. power3.out so it arrives fast and
    // settles, which is what makes it read as a title card and not a
    // dissolve.
    if (numerals[i]) {
      tl.to(
        numerals[i],
        { scale: 1, x: 0, duration: 1.25, ease: "power3.out" },
        "<0.15",
      );
    }
    // And the one you are leaving pulls back out the way it came in, so
    // stepping backwards is the same move reversed rather than a fade.
    if (numerals[i - 1]) {
      tl.to(
        numerals[i - 1],
        { scale: 1.18, x: 54, duration: 1.1, ease: "power2.in" },
        "<",
      );
    }

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

    // A breath of the beat's own accent across the whole frame as it lands.
    // Positioned ABSOLUTELY, back from the label rather than appended, so it
    // cannot push the label later than the card it belongs to — and so the
    // flash is over before you arrive, which is what makes it read as light
    // in the scene rather than as a transition effect played at you.
    if (bloom) {
      const at = tl.labels[beat.id];
      tl.to(bloom, { autoAlpha: 0.62, duration: 0.14, ease: "power1.out" }, at - 0.95)
        .to(bloom, { autoAlpha: 0, duration: 0.8, ease: "power2.in" }, at - 0.81);
    }
  });

  // --- pointer lean --------------------------------------------------------
  //
  // The world tips toward the cursor, each layer by its own depth rate. The
  // layers were already separated; they simply never had a reason to move
  // independently while the camera was standing still, which is why a beat
  // you had arrived at read as a flat picture.
  //
  // It runs on its OWN rAF, not the GSAP ticker, and only while there is
  // distance left to close. A stage nobody is touching therefore still
  // renders nothing at all — which matters, because this is the default
  // landing (D17) and a permanent render loop on it would be a battery bill
  // charged to every visitor.
  let leanRaf = 0;
  const leanTo = { x: 0, y: 0 };

  const stepLean = () => {
    const dx = leanTo.x - camera.leanX;
    const dy = leanTo.y - camera.leanY;
    if (Math.abs(dx) < 0.06 && Math.abs(dy) < 0.06) {
      camera.leanX = leanTo.x;
      camera.leanY = leanTo.y;
      leanRaf = 0;
      render();
      return;
    }
    camera.leanX += dx * 0.08;
    camera.leanY += dy * 0.08;
    render();
    leanRaf = requestAnimationFrame(stepLean);
  };

  const wakeLean = () => {
    if (!leanRaf) leanRaf = requestAnimationFrame(stepLean);
  };

  const onPointerMove = (e) => {
    const rect = root.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    // -1..1 from the centre of the stage. Negated: the world moves AWAY from
    // the cursor, which is what reads as looking around a space rather than
    // dragging a picture about.
    leanTo.x = (0.5 - (e.clientX - rect.left) / rect.width) * 2 * LEAN_X;
    leanTo.y = (0.5 - (e.clientY - rect.top) / rect.height) * 2 * LEAN_Y;
    wakeLean();
  };

  const onPointerLeave = () => {
    leanTo.x = 0;
    leanTo.y = 0;
    wakeLean();
  };

  // Touch only ever reports a pointer mid-gesture, so on a phone this would
  // be a lurch on every swipe rather than a lean.
  const fine = window.matchMedia("(pointer: fine)").matches;
  if (fine) {
    root.addEventListener("pointermove", onPointerMove);
    root.addEventListener("pointerleave", onPointerLeave);
  }

  const destroy = () => {
    if (leanRaf) cancelAnimationFrame(leanRaf);
    leanRaf = 0;
    if (fine) {
      root.removeEventListener("pointermove", onPointerMove);
      root.removeEventListener("pointerleave", onPointerLeave);
    }
    tl.kill();
  };

  render();
  return { tl, camera, render, destroy };
}
