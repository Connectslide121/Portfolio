// The live system: three.js, its glow and the scene, in a chunk of their own
// that is only fetched when the hero can run it (motion allowed, WebGL).
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { THEMES, createCore } from "./scene";

/**
 * Runs the system on `canvas`. `state` is shared with the page: GSAP tweens
 * its assemble, explode and focus; this loop adds the pointer, dragging and
 * hovering, and eases everything so the scene glides. `onLabels` gets the
 * products' label positions every frame; `onHover` the product under the
 * pointer when it changes; `onPick` the product clicked.
 */
export function startCore({ canvas, state, dark, light: lite, onLabels, onHover, onPick, onFirstFrame }) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: !lite, powerPreference: "high-performance" });
  const post = lite ? null : { EffectComposer, RenderPass, UnrealBloomPass, OutputPass };
  const core = createCore({ THREE, renderer, theme: dark ? THEMES.dark : THEMES.light, post });
  const ratio = Math.min(window.devicePixelRatio || 1, lite ? 1.5 : 2);

  const box = { w: 1, h: 1 };
  const size = () => {
    const r = canvas.getBoundingClientRect();
    if (!r.width || !r.height) return;
    box.w = r.width;
    box.h = r.height;
    core.resize(r.width, r.height, ratio);
  };
  size();
  const ro = new ResizeObserver(size);
  ro.observe(canvas);

  // Pointer, drag and hover. Dragging turns the system and lets it coast.
  const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const pointer = { x: 0, y: 0, nx: 0, ny: 0, inside: false };
  const drag = { on: false, x: 0, y: 0, yaw: 0, pitch: 0, vy: 0, vp: 0, moved: 0 };
  let hover = -1;

  const toNdc = (e) => {
    const r = canvas.getBoundingClientRect();
    pointer.nx = ((e.clientX - r.left) / r.width) * 2 - 1;
    pointer.ny = -((e.clientY - r.top) / r.height) * 2 + 1;
  };
  const onMove = (e) => {
    pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
    toNdc(e);
    pointer.inside = true;
    if (drag.on) {
      const dx = e.clientX - drag.x;
      const dy = e.clientY - drag.y;
      drag.x = e.clientX;
      drag.y = e.clientY;
      drag.moved += Math.abs(dx) + Math.abs(dy);
      drag.vy = dx * 0.006;
      drag.vp = dy * 0.004;
      drag.yaw += drag.vy;
      drag.pitch = Math.max(-0.5, Math.min(0.6, drag.pitch + drag.vp));
    }
  };
  const onDown = (e) => {
    if (e.button !== 0) return;
    drag.on = true;
    drag.moved = 0;
    drag.x = e.clientX;
    drag.y = e.clientY;
    canvas.setPointerCapture?.(e.pointerId);
    canvas.classList.add("is-dragging");
  };
  const onUp = () => {
    if (drag.on && drag.moved < 6 && hover >= 0) onPick?.(hover);
    drag.on = false;
    canvas.classList.remove("is-dragging");
  };
  const onLeave = () => {
    pointer.inside = false;
  };
  window.addEventListener("pointermove", onMove, { passive: true });
  canvas.addEventListener("pointerdown", onDown);
  window.addEventListener("pointerup", onUp);
  canvas.addEventListener("pointerleave", onLeave);

  const at = { assemble: state.assemble, explode: state.explode, focus: state.focus, px: 0, py: 0 };
  let visible = true;
  let frame = 0;
  let first = true;
  const t0 = performance.now();

  const tick = () => {
    frame = 0;
    if (!visible || document.hidden) return;
    at.assemble = state.assemble;
    at.explode += (state.explode - at.explode) * 0.08;
    at.focus = state.focus;
    at.px += ((fine ? pointer.x : 0) - at.px) * 0.04;
    at.py += ((fine ? pointer.y : 0) - at.py) * 0.04;
    if (!drag.on) {
      drag.yaw += drag.vy;
      drag.vy *= 0.94;
      drag.pitch *= 0.97;
    }

    // Wide: the system sits right of the text. Narrow: below it.
    const wide = box.w / box.h > 1.1;
    const shiftX = wide ? 3.1 * (1 - at.explode * 0.3) : 0;
    // Narrow: low in the frame, clear of the words on arrival; the page
    // scrolls up off it, since the stage stays.
    const shiftY = wide ? -0.2 : -4.3 * (1 - at.explode);
    const distance = wide ? 13.5 : 21;

    core.frame({ t: (performance.now() - t0) / 1000, assemble: at.assemble, explode: at.explode, focus: at.focus, hover, yaw: drag.yaw, pitch: drag.pitch, px: at.px, py: at.py, shiftX, shiftY, distance });

    const next = fine && pointer.inside && !drag.on ? core.pick(pointer.nx, pointer.ny) : drag.on ? hover : -1;
    if (next !== hover) {
      hover = next;
      canvas.style.cursor = hover >= 0 ? "pointer" : "";
      onHover?.(hover);
    }
    onLabels?.(core.labels());
    if (first) {
      first = false;
      onFirstFrame?.();
    }
    frame = requestAnimationFrame(tick);
  };
  const wake = () => {
    if (!frame && visible && !document.hidden) frame = requestAnimationFrame(tick);
  };
  const io = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    wake();
  });
  io.observe(canvas);
  document.addEventListener("visibilitychange", wake);
  wake();

  return {
    setDark(next) {
      core.setTheme(next ? THEMES.dark : THEMES.light);
    },
    stop() {
      cancelAnimationFrame(frame);
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", wake);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointerleave", onLeave);
      core.dispose();
      renderer.dispose();
    },
  };
}
