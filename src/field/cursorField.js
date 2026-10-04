// The cursor field: a visible ring around the pointer that physically pushes
// every letter and every art shape it overlaps, which then spring home when
// it moves on.
//
// HOW IT STAYS CHEAP WITH THOUSANDS OF PIECES
//
//   * Text is split once into one inline-block span per letter (words kept
//     together in a nowrap span, so line breaking is unchanged). Spans are
//     moved with the individual `translate` property, which composes with
//     any transform an element already animates (the Wobble letters, the
//     tipping ladle) instead of replacing it, and never triggers layout.
//   * Rest positions are measured into a coarse grid of viewport cells, and
//     only re-measured when stale (scroll, resize, the journey moving), and
//     only for pieces whose host is on screen (IntersectionObserver).
//   * Each frame only touches the pieces in the cells under the ring, plus
//     the ones still springing home. When nothing is moving the loop stops.
//
// SVG shapes are moved in their parent's user space: the screen-space push
// is mapped through the inverse of the parent's screen matrix, so a shape
// inside the journey's scaled camera, or the rotating ladle, moves exactly
// as far and in the same direction as a letter does.

const R = 58; // ring radius, px
const CELL = 120; // grid cell, px
const STALE = 220; // ms before rest positions are re-measured while moving
const PUSH = 1.0; // how far past the ring's edge a piece is shoved
const K = 0.16; // spring stiffness
const DAMP = 0.74; // velocity kept per frame

const SKIP_TEXT = new Set(["SCRIPT", "STYLE", "TEXTAREA", "INPUT", "SELECT", "OPTION", "NOSCRIPT", "CODE", "PRE"]);
const SHAPES = "path, circle, rect, ellipse, polygon, polyline, line, text, image";
// Never pieces: definitions, the screen-wide parallax bands and ground, the
// globe (redrawn every frame), weather particles (already animated), the
// overview trail, and anything that opts out.
const NOT_ART = [
  "defs", "clipPath", "mask", "pattern", "linearGradient", "radialGradient",
  ".j-globe", "[data-layer='far']", "[data-layer='mid']", "[data-layer='ground']",
  "[data-particle-scene]", ".season-sun", "[data-ov-path]", ".j-progress",
  "[data-no-field]",
].join(", ");

let items = []; // { el, svg, host, x, y, vx, vy, tx, ty, rect, mass }
let grid = new Map();
let builtAt = 0;
let pointer = { x: -9999, y: -9999, in: false };
let raf = 0;
let active = new Set();
let visibleHosts = new Set();
let io = null;
let mo = null;
let ring = null;
let dirty = true;
let root = null;
let getRoot = () => document.body;

/* --- splitting ----------------------------------------------------------- */

function splitTextNode(node) {
  const text = node.nodeValue;
  if (!text || !text.trim()) return;
  const parent = node.parentNode;
  if (!parent) return;
  const wrap = document.createElement("span");
  wrap.className = "fx-t";
  for (const token of text.split(/(\s+)/)) {
    if (!token) continue;
    if (/^\s+$/.test(token)) {
      wrap.appendChild(document.createTextNode(token));
      continue;
    }
    const word = document.createElement("span");
    word.className = "fx-w";
    for (const ch of Array.from(token)) {
      const l = document.createElement("span");
      l.className = "fx-l";
      l.textContent = ch;
      word.appendChild(l);
    }
    wrap.appendChild(word);
  }
  parent.replaceChild(wrap, node);
  dirty = true;
}

function splittable(node) {
  for (let el = node.parentElement; el; el = el.parentElement) {
    if (SKIP_TEXT.has(el.tagName)) return false;
    if (el.isContentEditable) return false;
    if (el.namespaceURI === "http://www.w3.org/2000/svg") return false;
    const c = el.classList;
    if (c && (c.contains("fx-t") || c.contains("wobble") || c.contains("wb-sr") || c.contains("j-rail-now"))) return false;
    if (el.hasAttribute && el.hasAttribute("data-no-field")) return false;
  }
  return true;
}

function splitWithin(scope) {
  const walker = document.createTreeWalker(scope, NodeFilter.SHOW_TEXT);
  const nodes = [];
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    if (n.nodeValue.trim() && splittable(n)) nodes.push(n);
  }
  nodes.forEach(splitTextNode);
}

/* --- collecting pieces ---------------------------------------------------- */

function hostOf(el) {
  // The nearest block-ish ancestor, for visibility tracking.
  return el.closest("p, h1, h2, h3, h4, h5, h6, li, dd, dt, button, a, label, span.eyebrow, div") || el.parentElement;
}

function collect() {
  const scope = root;
  const next = [];
  const seen = new Set();

  const add = (el, svg) => {
    if (seen.has(el)) return;
    seen.add(el);
    const prev = el.__fx;
    const it = prev || { el, svg, x: 0, y: 0, vx: 0, vy: 0, tx: 0, ty: 0, rect: null, mass: 1 };
    it.host = svg ? el.ownerSVGElement || el : hostOf(el);
    el.__fx = it;
    next.push(it);
  };

  scope.querySelectorAll(".fx-l, .wb-l").forEach((el) => add(el, false));

  scope.querySelectorAll("svg").forEach((svg) => {
    if (svg.closest(NOT_ART)) return;
    const r = svg.getBoundingClientRect();
    // Small inline icons move as one piece.
    if (r.width && r.width < 64 && r.height < 64) {
      add(svg, false);
      return;
    }
    svg.querySelectorAll(SHAPES).forEach((el) => {
      if (el.closest(NOT_ART)) return;
      add(el, true);
    });
  });

  // Pieces that left the document go home and are forgotten.
  for (const it of items) {
    if (!seen.has(it.el)) {
      it.el.style.translate = "";
      delete it.el.__fx;
      active.delete(it);
    }
  }
  items = next;

  // Visibility: observe each distinct host once.
  if (io) io.disconnect();
  visibleHosts = new Set();
  io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) visibleHosts.add(e.target);
        else visibleHosts.delete(e.target);
      }
      builtAt = 0;
    },
    { rootMargin: `${R * 2}px` },
  );
  new Set(items.map((i) => i.host).filter(Boolean)).forEach((h) => io.observe(h));
  dirty = false;
  builtAt = 0;
}

/* --- measuring ------------------------------------------------------------ */

/**
 * The inverse of the parent's screen matrix (linear part only). `translate`
 * on an SVG element is applied in its PARENT's user space, which may be
 * scaled by the journey camera, rotated (the tipping ladle) or flipped — so
 * a screen-space push is mapped through this before it is written.
 */
function localBasis(it) {
  const p = it.el.parentNode;
  const m = p && p.getScreenCTM && p.getScreenCTM();
  if (!m) return null;
  const det = m.a * m.d - m.b * m.c;
  if (!det) return null;
  return { a: m.d / det, b: -m.b / det, c: -m.c / det, d: m.a / det };
}

function build() {
  grid = new Map();
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  for (const it of items) {
    if (!it.el.isConnected) continue;
    if (it.host && !visibleHosts.has(it.host)) {
      it.rect = null;
      continue;
    }
    const b = it.el.getBoundingClientRect();
    if (!b.width && !b.height) {
      it.rect = null;
      continue;
    }
    // Rest position: what is on screen minus the push currently applied.
    const left = b.left - it.x;
    const top = b.top - it.y;
    if (left > vw + R || top > vh + R || left + b.width < -R || top + b.height < -R) {
      it.rect = null;
      continue;
    }
    it.rect = { l: left, t: top, r: left + b.width, b: top + b.height };
    // Heavier things move less — a letter takes the full push, a 500px disc
    // about a third of it — but nothing is so heavy it ignores the ring.
    const size = Math.sqrt(b.width * b.height);
    it.mass = Math.min(1, Math.max(0.35, 110 / Math.max(size, 1)));
    if (it.svg) it.basis = localBasis(it);
    const c0 = Math.floor(left / CELL);
    const c1 = Math.floor((left + b.width) / CELL);
    const r0 = Math.floor(top / CELL);
    const r1 = Math.floor((top + b.height) / CELL);
    for (let cx = c0; cx <= c1; cx++) {
      for (let cy = r0; cy <= r1; cy++) {
        const key = cx * 100003 + cy;
        let cell = grid.get(key);
        if (!cell) grid.set(key, (cell = []));
        cell.push(it);
      }
    }
  }
  builtAt = performance.now();
}

/* --- the loop ------------------------------------------------------------- */

function near() {
  const out = new Set();
  if (!pointer.in) return out;
  const c0 = Math.floor((pointer.x - R) / CELL);
  const c1 = Math.floor((pointer.x + R) / CELL);
  const r0 = Math.floor((pointer.y - R) / CELL);
  const r1 = Math.floor((pointer.y + R) / CELL);
  for (let cx = c0; cx <= c1; cx++) {
    for (let cy = r0; cy <= r1; cy++) {
      const cell = grid.get(cx * 100003 + cy);
      if (cell) cell.forEach((it) => out.add(it));
    }
  }
  return out;
}

function frame() {
  raf = 0;
  if (dirty) collect();
  if (performance.now() - builtAt > STALE) build();

  const hit = near();
  // Everything currently pushed is retargeted: home unless the ring is on it.
  for (const it of active) {
    it.tx = 0;
    it.ty = 0;
  }
  for (const it of hit) {
    const r = it.rect;
    if (!r) continue;
    // Distance from the ring's centre to the piece's box.
    const nx = Math.max(r.l, Math.min(pointer.x, r.r));
    const ny = Math.max(r.t, Math.min(pointer.y, r.b));
    const d = Math.hypot(pointer.x - nx, pointer.y - ny);
    if (d >= R) continue;
    // Push direction: from the centre toward the piece's middle.
    let dx = (r.l + r.r) / 2 - pointer.x;
    let dy = (r.t + r.b) / 2 - pointer.y;
    const len = Math.hypot(dx, dy) || 1;
    dx /= len;
    dy /= len;
    const amount = (R - d) * PUSH * it.mass;
    it.tx = dx * amount;
    it.ty = dy * amount;
    active.add(it);
  }

  let moving = false;
  for (const it of active) {
    it.vx = (it.vx + (it.tx - it.x) * K) * DAMP;
    it.vy = (it.vy + (it.ty - it.y) * K) * DAMP;
    it.x += it.vx;
    it.y += it.vy;
    const settled =
      Math.abs(it.x - it.tx) < 0.05 && Math.abs(it.y - it.ty) < 0.05 &&
      Math.abs(it.vx) < 0.05 && Math.abs(it.vy) < 0.05;
    if (settled && it.tx === 0 && it.ty === 0) {
      it.x = it.y = it.vx = it.vy = 0;
      it.el.style.translate = "";
      active.delete(it);
      continue;
    }
    moving = true;
    let lx = it.x;
    let ly = it.y;
    if (it.svg && it.basis) {
      const q = it.basis;
      lx = q.a * it.x + q.c * it.y;
      ly = q.b * it.x + q.d * it.y;
    }
    it.el.style.translate = `${lx.toFixed(2)}px ${ly.toFixed(2)}px`;
  }

  if (moving || pointer.in) wake();
}

function wake() {
  if (!raf) raf = requestAnimationFrame(frame);
}

/* --- wiring --------------------------------------------------------------- */

function onMove(e) {
  if (e.pointerType && e.pointerType !== "mouse" && e.pointerType !== "pen") return;
  pointer.x = e.clientX;
  pointer.y = e.clientY;
  pointer.in = true;
  if (ring) {
    ring.style.translate = `${e.clientX - R}px ${e.clientY - R}px`;
    ring.style.opacity = "1";
  }
  wake();
}

function onLeave() {
  pointer.in = false;
  if (ring) ring.style.opacity = "0";
  wake();
}

function onScroll() {
  builtAt = 0;
  wake();
}

function retarget() {
  const next = getRoot() || document.body;
  if (next !== root) {
    root = next;
    splitWithin(root);
    dirty = true;
  }
}

let pending = 0;
function onMutations(records) {
  // Our own splitting adds nodes too; only react to content that is not ours.
  const foreign = records.some((r) =>
    Array.from(r.addedNodes).some(
      (n) => !(n.nodeType === 1 && (n.classList.contains("fx-t") || n.classList.contains("fx-ring"))),
    ),
  );
  if (!foreign) return;
  if (pending) return;
  pending = requestAnimationFrame(() => {
    pending = 0;
    retarget();
    splitWithin(root);
    dirty = true;
    wake();
  });
}

/**
 * Start the field. `rootFn` returns the element whose content takes part —
 * called again whenever the DOM changes, so switching between the journey
 * and the CV moves the field with it. Returns a stop function.
 */
export function startField(rootFn) {
  if (!window.matchMedia("(pointer: fine)").matches) return () => {};
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return () => {};
  getRoot = rootFn;
  // A fresh start (React StrictMode runs effects twice in development): the
  // spans from a previous run are still in the DOM, but the piece list was
  // cleared, so force a re-collect.
  root = null;
  dirty = true;

  ring = document.createElement("div");
  ring.className = "fx-ring";
  ring.style.width = ring.style.height = `${R * 2}px`;
  document.body.appendChild(ring);

  retarget();

  window.addEventListener("pointermove", onMove, { passive: true });
  document.documentElement.addEventListener("mouseleave", onLeave);
  window.addEventListener("blur", onLeave);
  window.addEventListener("scroll", onScroll, { passive: true, capture: true });
  window.addEventListener("resize", onScroll);
  mo = new MutationObserver(onMutations);
  mo.observe(document.body, { childList: true, subtree: true });

  return () => {
    window.removeEventListener("pointermove", onMove);
    document.documentElement.removeEventListener("mouseleave", onLeave);
    window.removeEventListener("blur", onLeave);
    window.removeEventListener("scroll", onScroll, { capture: true });
    window.removeEventListener("resize", onScroll);
    mo && mo.disconnect();
    io && io.disconnect();
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    items.forEach((it) => (it.el.style.translate = ""));
    items = [];
    active.clear();
    ring && ring.remove();
    ring = null;
  };
}
