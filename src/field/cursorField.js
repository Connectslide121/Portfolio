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
//   * A coarse grid of viewport cells indexes pieces by group (a word, an
//     SVG group), rebuilt a few times a second and only for hosts on screen
//     (IntersectionObserver). It only answers "what might be under the ring".
//   * Each frame measures just the pieces the index finds near the ring, so
//     collisions use where they really are, and touches only those plus the
//     ones still springing home. When nothing is moving the loop stops.
//
// SVG shapes are moved in their parent's user space: the screen-space push
// is mapped through the inverse of the parent's screen matrix, so a shape
// inside the journey's scaled camera, or the rotating ladle, moves exactly
// as far and in the same direction as a letter does.

const R = 58; // ring radius, px
// Controls hold their own letters still while hovered or focused: a label
// you are about to click has to be readable.
const CONTROL = "button, a, label, summary, [role='button'], [role='tab'], .hero-teaser, .j-trail button";
const CELL = 120; // grid cell, px
// Pieces are indexed by group — a word, or the SVG group a shape sits in —
// rather than one by one: the index only has to say which pieces MIGHT be
// under the ring, and a few hundred words measure far faster than thousands
// of letters. The pieces that are near the ring are then measured fresh
// every frame (measure()), so a collision follows art that is moving — the
// journey's pointer lean, a wobbling letter — instead of snapping to where it
// was when the index was last built.
const MARGIN = 40; // px a group may drift between index rebuilds
const BIG = 360; // px: a larger SVG group is indexed shape by shape
const STALE = 200; // ms between index rebuilds
const STALE_SCROLL = 90; // …while the page or the journey is scrolling
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
let grid = new Map(); // cell -> [{ list, l, t, r, b }]
let groups = new Map(); // group element -> its pieces
let scrolled = false;
let builtAt = 0;
let pointer = { x: -9999, y: -9999, in: false };
let hovered = null; // the control under the pointer, if any
let raf = 0;
let active = new Set();
let visibleHosts = new Set();
let io = null;
let mo = null;
let ring = null;
let dirty = true;
let root = null;
let getRoot = () => document.body;
let paused = false;
let missed = false; // content changed while paused; rescan on resume

/**
 * Stand the field down (destruction mode owns the pointer while it runs).
 * Everything pushed springs home and the ring hides; splitting and the piece
 * registry stay as they are, so resuming is instant. While paused the field
 * neither splits nor measures — destruction mode rewrites its HUD every
 * frame, and rescanning the page for each of those writes was most of its
 * lag.
 */
export function setFieldPaused(next) {
  paused = next;
  if (paused) {
    pointer.in = false;
    hovered = null;
    if (ring) ring.style.opacity = "0";
    // The visibility observer would recompute for every host on each frame
    // of screen shake; it is rebuilt on resume.
    if (io) io.disconnect();
    io = null;
    visibleHosts.clear();
    dirty = true;
  } else if (missed) {
    missed = false;
    rescan();
  }
  wake();
}

/* --- splitting ----------------------------------------------------------- */

/** Whether text here is drawn with an inherited underline (a link, usually). */
function underlined(el) {
  for (let e = el; e && e.nodeType === 1; e = e.parentElement) {
    const cs = getComputedStyle(e);
    if (cs.textDecorationLine && cs.textDecorationLine !== "none") return true;
    // decoration only propagates through inline boxes
    if (!cs.display.startsWith("inline")) return false;
  }
  return false;
}

function splitTextNode(node) {
  const text = node.nodeValue;
  if (!text || !text.trim()) return;
  const parent = node.parentNode;
  if (!parent) return;
  const wrap = document.createElement("span");
  wrap.className = "fx-t";
  // Inside an underlined link, a plain space between words would keep the
  // link's own underline painted under it — a dash left behind when the
  // letters around it are pushed. There, each space becomes a piece too.
  const decorated = underlined(parent);
  for (const token of text.split(/(\s+)/)) {
    if (!token) continue;
    if (/^\s+$/.test(token)) {
      if (decorated) {
        const sp = document.createElement("span");
        sp.className = "fx-l fx-sp";
        sp.textContent = " ";
        wrap.appendChild(sp);
      } else {
        wrap.appendChild(document.createTextNode(token));
      }
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
    // what it is indexed with: its word, its SVG group, or itself (an icon)
    it.group = svg ? el.parentNode : el.tagName === "svg" ? el : el.closest(".fx-w") || el.parentElement;
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
  groups = new Map();
  for (const it of items) {
    let list = groups.get(it.group);
    if (!list) groups.set(it.group, (list = []));
    list.push(it);
  }

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

/** File a group's pieces in every grid cell its (padded) box touches. */
function index(list, l, t, r, b) {
  const e = { list, l: l - MARGIN, t: t - MARGIN, r: r + MARGIN, b: b + MARGIN };
  const c0 = Math.floor(e.l / CELL);
  const c1 = Math.floor(e.r / CELL);
  const r0 = Math.floor(e.t / CELL);
  const r1 = Math.floor(e.b / CELL);
  for (let cx = c0; cx <= c1; cx++) {
    for (let cy = r0; cy <= r1; cy++) {
      const key = cx * 100003 + cy;
      let cell = grid.get(key);
      if (!cell) grid.set(key, (cell = []));
      cell.push(e);
    }
  }
}

/**
 * Rebuild the index: where each group roughly is. Only good for finding the
 * pieces that MIGHT be under the ring — see measure() for the real thing.
 */
function build() {
  grid = new Map();
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const m = R + MARGIN;
  for (const [g, list] of groups) {
    if (!g.isConnected) continue;
    const host = list[0].host;
    if (host && !visibleHosts.has(host)) continue;
    const b = g.getBoundingClientRect();
    if (!b.width && !b.height) continue;
    if (b.left > vw + m || b.top > vh + m || b.right < -m || b.bottom < -m) continue;
    // A sprawling SVG group would put every shape in it under the ring at
    // once, so its shapes are filed one by one instead.
    if (list.length > 1 && (b.width > BIG || b.height > BIG)) {
      for (const it of list) {
        const q = it.el.getBoundingClientRect();
        if (q.width || q.height) index([it], q.left, q.top, q.right, q.bottom);
      }
    } else {
      index(list, b.left, b.top, b.right, b.bottom);
    }
  }
  builtAt = performance.now();
  scrolled = false;
}

/**
 * Measure one piece where it is right now. Called every frame for the few
 * pieces near the ring, so a collision always uses the piece's real position
 * even while the art under it is moving.
 */
function measure(it) {
  const b = it.el.getBoundingClientRect();
  if (!b.width && !b.height) {
    it.rect = null;
    return;
  }
  // Rest position: what is on screen minus the push currently applied.
  const left = b.left - it.x;
  const top = b.top - it.y;
  it.rect = { l: left, t: top, r: left + b.width, b: top + b.height };
  // Heavier things move less — a letter takes the full push, a 500px disc
  // about a third of it — but nothing is so heavy it ignores the ring.
  const size = Math.sqrt(b.width * b.height);
  it.mass = Math.min(1, Math.max(0.35, 110 / Math.max(size, 1)));
}

/* --- the loop ------------------------------------------------------------- */

function near() {
  const out = new Set();
  if (!pointer.in) return out;
  const { x, y } = pointer;
  const c0 = Math.floor((x - R) / CELL);
  const c1 = Math.floor((x + R) / CELL);
  const r0 = Math.floor((y - R) / CELL);
  const r1 = Math.floor((y + R) / CELL);
  for (let cx = c0; cx <= c1; cx++) {
    for (let cy = r0; cy <= r1; cy++) {
      const cell = grid.get(cx * 100003 + cy);
      if (!cell) continue;
      for (const e of cell) {
        if (x + R < e.l || x - R > e.r || y + R < e.t || y - R > e.b) continue;
        for (const it of e.list) out.add(it);
      }
    }
  }
  return out;
}

function frame() {
  raf = 0;
  // Paused, only the springs run: whatever was pushed settles home on the
  // positions it already has.
  if (!paused) {
    if (dirty) collect();
    const age = performance.now() - builtAt;
    if (age > STALE || (scrolled && age > STALE_SCROLL)) build();
  }

  const hit = paused ? new Set() : near();
  // All reads happen here, before this frame writes anything.
  for (const it of hit) measure(it);
  // An SVG shape's screen matrix is costly to read, so it is read only for
  // shapes actually inside the ring, once per parent per frame.
  const bases = new Map();
  // Everything currently pushed is retargeted: home unless the ring is on it.
  for (const it of active) {
    it.tx = 0;
    it.ty = 0;
  }
  const focused =
    document.activeElement && document.activeElement !== document.body
      ? document.activeElement.closest(CONTROL)
      : null;
  for (const it of hit) {
    const r = it.rect;
    if (!r) continue;
    if ((hovered && hovered.contains(it.el)) || (focused && focused.contains(it.el))) continue;
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
    if (it.svg) {
      const p = it.el.parentNode;
      if (!bases.has(p)) bases.set(p, localBasis(it));
      it.basis = bases.get(p);
    }
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
  if (paused) return;
  if (e.pointerType && e.pointerType !== "mouse" && e.pointerType !== "pen") return;
  pointer.x = e.clientX;
  pointer.y = e.clientY;
  pointer.in = true;
  hovered = e.target && e.target.closest ? e.target.closest(CONTROL) : null;
  if (ring) {
    ring.style.translate = `${e.clientX - R}px ${e.clientY - R}px`;
    ring.style.opacity = "1";
  }
  wake();
}

function onLeave() {
  pointer.in = false;
  hovered = null;
  if (ring) ring.style.opacity = "0";
  wake();
}

function onScroll() {
  // Re-indexed soon, not on every scroll event: the pieces under the ring are
  // measured fresh each frame anyway.
  scrolled = true;
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

// Nodes that are never content: our own spans and ring, anything opted out,
// and destruction mode's HUD, canvas, burns and effects.
const NOT_CONTENT = ".fx-t, .fx-ring, [data-no-field], [class^='dz-'], [class*=' dz-']";

function isOurs(n) {
  return n.nodeType === 1 && n.matches(NOT_CONTENT);
}

function foreignRecord(r) {
  // A change inside an opted-out subtree (the HUD's clock text, a toast).
  const t = r.target;
  if (t.nodeType === 1 && t.closest("[data-no-field], .dz-burns")) return false;
  for (const n of r.addedNodes) if (!isOurs(n)) return true;
  return false;
}

function rescan() {
  retarget();
  splitWithin(root);
  dirty = true;
  wake();
}

let pending = 0;
function onMutations(records) {
  // Our own splitting adds nodes too; only react to content that is not ours.
  if (!records.some(foreignRecord)) return;
  if (paused) {
    missed = true;
    return;
  }
  if (pending) return;
  pending = requestAnimationFrame(() => {
    pending = 0;
    rescan();
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
  // Keyboard focus landing on a control should settle its label too.
  document.addEventListener("focusin", wake);
  mo = new MutationObserver(onMutations);
  mo.observe(document.body, { childList: true, subtree: true });

  return () => {
    window.removeEventListener("pointermove", onMove);
    document.documentElement.removeEventListener("mouseleave", onLeave);
    window.removeEventListener("blur", onLeave);
    window.removeEventListener("scroll", onScroll, { capture: true });
    window.removeEventListener("resize", onScroll);
    document.removeEventListener("focusin", wake);
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
