// The live billet: three.js and the scene, in a chunk of their own that is
// only fetched when the hero can show it (wide screen, motion allowed, WebGL).
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { THEMES, createForge } from "./scene";

/**
 * Runs the billet on `canvas`, easing towards `target.current` ({ heat, open })
 * and the pointer. Draws only while the canvas is on screen and the tab is
 * visible. Calls `onFirstFrame` once there is a picture to show over the still.
 */
export function startForge({ canvas, target, dark, onFirstFrame }) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  const forge = createForge({ THREE, RoundedBoxGeometry, RoomEnvironment, renderer, theme: dark ? THEMES.dark : THEMES.light });

  const size = () => {
    const { width, height } = canvas.getBoundingClientRect();
    if (width && height) forge.resize(width, height, Math.min(window.devicePixelRatio || 1, 2));
  };
  size();
  const ro = new ResizeObserver(size);
  ro.observe(canvas);

  const follows = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const pointer = { x: 0, y: 0 };
  const onMove = (e) => {
    pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
  };
  if (follows) window.addEventListener("pointermove", onMove, { passive: true });

  const at = { heat: target.current.heat, open: target.current.open, px: 0, py: 0 };
  let visible = true;
  let frame = 0;
  let first = true;
  const t0 = performance.now();

  const tick = () => {
    frame = 0;
    if (!visible || document.hidden) return;
    const to = target.current;
    at.heat += (to.heat - at.heat) * 0.06;
    at.open += (to.open - at.open) * 0.06;
    at.px += (pointer.x - at.px) * 0.05;
    at.py += (pointer.y - at.py) * 0.05;
    forge.frame({ t: (performance.now() - t0) / 1000, ...at });
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
      forge.setTheme(next ? THEMES.dark : THEMES.light);
    },
    stop() {
      cancelAnimationFrame(frame);
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", wake);
      window.removeEventListener("pointermove", onMove);
      forge.dispose();
      renderer.dispose();
    },
  };
}
