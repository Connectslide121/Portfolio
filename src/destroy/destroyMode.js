// Destruction mode. The cursor becomes a crosshair, the portfolio becomes the
// target range.
//
//   * Click to shoot, hold to auto-fire. Every letter, art shape, icon and
//     image inside the blast breaks for real: it is hidden in place and its
//     pieces fly off as debris (the letter itself, shards of the shape in its
//     own colour, or actual fragments of the image).
//   * Points per piece, a combo multiplier for keeping the hits coming,
//     shatter and word bonuses, ranks, and a best score kept per browser.
//   * Points charge the AIR STRIKE: a plane crosses the page and carpet-bombs
//     it. Right-click or A.
//   * Esc or Exit repairs everything — every piece flies back into place.
//
// Loaded on demand (HeroDestroy imports it), so none of this is in the
// main bundle. Plain DOM and one canvas; no React, no GSAP.

import "./destroy.css";
import { setFieldPaused } from "../field/cursorField";
import { createChiptune } from "./chiptune";

const TAU = Math.PI * 2;
const NO = "[data-no-destroy], .dz-hud, .dz-dest, .dz-cross, .dz-plane, .dz-toast";
const SHAPES = "path, circle, rect, ellipse, polygon, polyline, line, text, image";
const NOT_SHAPE = "defs, clipPath, mask, pattern, linearGradient, radialGradient, symbol, marker";

const SHOT_R = 26; // blast radius of a single shot
const STRIKE_R = 125; // blast radius of an air-strike bomb
const COMBO_WINDOW = 1.7; // seconds a combo survives without a hit
const CHARGE_FULL = 4000; // points to arm the air strike
const AUTO_FIRE = 110; // ms between shots while held
// Barrel heat, 0..100. Each shot adds HEAT_SHOT and the barrel sheds
// HEAT_COOL a second, so tapping never overheats but holding the trigger
// does in about three seconds. Past 100 it locks until it is back to 0,
// cooling faster while locked.
const HEAT_SHOT = 6;
const HEAT_COOL = 22;
const HEAT_COOL_LOCKED = 42;

// The clock. A time attack: you start with TIME_START seconds (the clock
// waits for the first shot), and earn more by playing well. What stops it
// running forever:
//   * every bonus is scaled by 1 / (1 + earned / TIME_HALF), so after 15 s
//     earned they pay half, after 45 s a quarter;
//   * the clock never holds more than TIME_MAX;
//   * a miss costs MISS_COST;
//   * the clock itself runs ~17% faster every minute (CLOCK_SPEEDUP).
const TIME_START = 45;
const TIME_MAX = 50;
const TIME_HALF = 15;
const MISS_COST = 0.5;
const LOW_TIME = 10;
const CLOCK_SPEEDUP = 360; // seconds of play per +100% clock speed
// Seconds for reaching each multiplier tier, paid once per combo run.
const TIER_TIME = { 3: 1, 4: 1.5, 5: 2, 6: 2.5 };
const WORD_TIME = 0.25;
const SHATTER_TIME = 1;
// Time capsules: a stopwatch that drifts across the page now and then.
const CAPSULE_TIME = 3;
const CAPSULE_LIFE = 4;
const CAPSULE_EVERY = [14, 20];
const CAPSULE_R = 30;

const RANKS = [
  [0, "Intern"],
  [3000, "Junior demolisher"],
  [10000, "Senior wrecker"],
  [25000, "Lead demolition engineer"],
  [50000, "Platform architect of ruin"],
  [100000, "Molten steel"],
];

const CALLOUTS = {
  2: "Double!",
  3: "Triple!",
  4: "Rampage!",
  5: "Meltdown!",
  6: "Foundry fire!",
};

const best = {
  get() {
    try {
      return +localStorage.getItem("jm-destroy-best") || 0;
    } catch {
      return 0;
    }
  },
  set(v) {
    try {
      localStorage.setItem("jm-destroy-best", String(v));
    } catch {
      /* fine */
    }
  },
};

const rand = (a, b) => a + Math.random() * (b - a);
const ease = (p) => 1 - Math.pow(1 - p, 3);

/* ==========================================================================
   Sound — synthesised, so there are no files to load.
   ========================================================================== */

function makeAudio() {
  let ctx = null;
  let master = null;
  let noise = null;
  let muted = false;
  let musicOn = true;
  let music = null;
  try {
    muted = localStorage.getItem("jm-destroy-muted") === "1";
    musicOn = localStorage.getItem("jm-destroy-music") !== "0";
  } catch {
    /* fine */
  }

  const init = () => {
    if (ctx) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = muted ? 0 : 0.5;
    master.connect(ctx.destination);
    noise = ctx.createBuffer(1, ctx.sampleRate * 1.5, ctx.sampleRate);
    const d = noise.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    music = createChiptune(ctx, master, noise);
    if (musicOn) music.start();
  };

  const burst = ({ dur, from, to, type = "lowpass", gain }) => {
    if (!ctx || muted) return;
    const t = ctx.currentTime;
    const src = ctx.createBufferSource();
    src.buffer = noise;
    const f = ctx.createBiquadFilter();
    f.type = type;
    f.frequency.setValueAtTime(from, t);
    f.frequency.exponentialRampToValueAtTime(Math.max(40, to), t + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(gain, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(f).connect(g).connect(master);
    src.start(t, Math.random() * 0.5);
    src.stop(t + dur);
  };

  const thump = (freq, dur, gain) => {
    if (!ctx || muted) return;
    const t = ctx.currentTime;
    const o = ctx.createOscillator();
    o.frequency.setValueAtTime(freq, t);
    o.frequency.exponentialRampToValueAtTime(freq * 0.35, t + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(gain, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(master);
    o.start(t);
    o.stop(t + dur);
  };

  return {
    init,
    get muted() {
      return muted;
    },
    toggle() {
      muted = !muted;
      try {
        localStorage.setItem("jm-destroy-muted", muted ? "1" : "0");
      } catch {
        /* fine */
      }
      if (master) master.gain.value = muted ? 0 : 0.5;
      return muted;
    },
    get musicOn() {
      return musicOn;
    },
    toggleMusic() {
      musicOn = !musicOn;
      try {
        localStorage.setItem("jm-destroy-music", musicOn ? "1" : "0");
      } catch {
        /* fine */
      }
      if (music) musicOn ? music.start() : music.stop();
      return musicOn;
    },
    intensity(n) {
      if (music) music.setIntensity(n);
    },
    muffle(on) {
      if (music) music.setMuffled(on);
    },
    shot() {
      burst({ dur: 0.07, from: 6000, to: 1500, type: "highpass", gain: 0.25 });
    },
    pop(n) {
      burst({ dur: 0.25 + Math.min(n, 20) * 0.01, from: 2400, to: 300, gain: 0.35 });
      thump(140, 0.18, 0.25);
    },
    boom() {
      burst({ dur: 1.1, from: 1200, to: 60, gain: 0.9 });
      thump(70, 0.7, 0.9);
    },
    whistle() {
      if (!ctx || muted) return;
      const t = ctx.currentTime;
      const o = ctx.createOscillator();
      o.type = "sine";
      o.frequency.setValueAtTime(1500, t);
      o.frequency.exponentialRampToValueAtTime(380, t + 1.4);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.07, t + 0.2);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 1.5);
      o.connect(g).connect(master);
      o.start(t);
      o.stop(t + 1.5);
    },
    tick(high) {
      if (!ctx || muted) return;
      const t = ctx.currentTime;
      const o = ctx.createOscillator();
      o.type = "square";
      o.frequency.value = high ? 1760 : 1320;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.08, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);
      o.connect(g).connect(master);
      o.start(t);
      o.stop(t + 0.06);
    },
    chime() {
      if (!ctx || muted) return;
      const t = ctx.currentTime;
      [880, 1320, 1760].forEach((f, i) => {
        const o = ctx.createOscillator();
        o.type = "square";
        o.frequency.value = f;
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.0001, t + i * 0.06);
        g.gain.exponentialRampToValueAtTime(0.09, t + i * 0.06 + 0.01);
        g.gain.exponentialRampToValueAtTime(0.0001, t + i * 0.06 + 0.12);
        o.connect(g).connect(master);
        o.start(t + i * 0.06);
        o.stop(t + i * 0.06 + 0.13);
      });
    },
    gameOver() {
      if (!ctx || muted) return;
      const t = ctx.currentTime;
      [659, 523, 440, 330].forEach((f, i) => {
        const o = ctx.createOscillator();
        o.type = "square";
        o.frequency.value = f;
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.0001, t + i * 0.22);
        g.gain.exponentialRampToValueAtTime(0.11, t + i * 0.22 + 0.01);
        g.gain.exponentialRampToValueAtTime(0.0001, t + i * 0.22 + (i === 3 ? 0.7 : 0.2));
        o.connect(g).connect(master);
        o.start(t + i * 0.22);
        o.stop(t + i * 0.22 + 0.75);
      });
    },
    hiss() {
      burst({ dur: 1.1, from: 7000, to: 2500, type: "highpass", gain: 0.22 });
    },
    dry() {
      burst({ dur: 0.03, from: 3000, to: 2500, type: "bandpass", gain: 0.3 });
    },
    engine() {
      burst({ dur: 2.6, from: 260, to: 120, gain: 0.18 });
    },
    close() {
      if (music) music.stop();
      if (ctx) ctx.close();
      ctx = null;
    },
  };
}

/* ==========================================================================
   The mode
   ========================================================================== */

export function startDestruction({ onExit } = {}) {
  const dark = () => document.body.classList.contains("dark-theme");
  const css = getComputedStyle(document.body);
  const tok = (n) => css.getPropertyValue(n).trim();
  const C = {
    ink: tok("--ink") || "#1d1b19",
    coral: tok("--coral") || "#ff7657",
    apricot: tok("--apricot") || "#ffad85",
    butter: tok("--butter") || "#f6d56b",
    rose: tok("--rose") || "#f4a3bf",
    lilac: tok("--lilac") || "#c4b3f2",
    sky: tok("--sky") || "#9fc0f0",
    lime: tok("--lime") || "#cfe86a",
    limeInk: tok("--lime-ink") || "#4f6b0c",
  };

  const audio = makeAudio();
  audio.init();
  setFieldPaused(true);
  document.body.classList.add("dz-on");

  /* --- DOM: canvas, crosshair, HUD ------------------------------------- */

  const canvas = document.createElement("canvas");
  canvas.className = "dz-canvas";
  // Drawn through an OffscreenCanvas where the browser has one. On a canvas
  // that is part of the page, every `ctx.font =` is resolved against the
  // document's styles, which forces a style pass over the whole page — and
  // every flying letter sets a font. That was the single largest cost of a
  // busy frame. The offscreen surface draws exactly the same pixels.
  const surface = canvas.transferControlToOffscreen ? canvas.transferControlToOffscreen() : canvas;
  const ctx = surface.getContext("2d");
  let dpr = 1;
  const resize = () => {
    dpr = Math.min(2, window.devicePixelRatio || 1);
    surface.width = Math.round(window.innerWidth * dpr);
    surface.height = Math.round(window.innerHeight * dpr);
  };
  resize();

  const cross = document.createElement("div");
  cross.className = "dz-cross";
  cross.innerHTML = `<svg viewBox="-32 -32 64 64" aria-hidden="true">
    <circle class="dz-cross-ring" r="17" />
    <circle class="dz-cross-ready" r="24" />
    <circle class="dz-cross-heat" r="21" pathLength="100" />
    <path d="M0 -28 V-11 M0 11 V28 M-28 0 H-11 M11 0 H28" />
    <path class="dz-cross-hit" d="M-9 -9 L-4 -4 M9 -9 L4 -4 M-9 9 L-4 4 M9 9 L4 4" />
    <circle class="dz-cross-dot" r="2.6" />
  </svg>`;

  const hud = document.createElement("div");
  hud.className = "dz-hud";
  hud.setAttribute("data-no-destroy", "");
  hud.setAttribute("data-no-field", "");
  hud.innerHTML = `
    <div class="dz-cell dz-time">
      <span class="dz-label">Time</span>
      <b class="dz-time-n">45.0</b>
      <span class="dz-key dz-time-note">starts on your first shot</span>
    </div>
    <div class="dz-cell dz-score">
      <span class="dz-label">Score</span>
      <b class="dz-score-n">0</b>
      <span class="dz-best">best <span class="dz-best-n">${best.get()}</span></span>
    </div>
    <div class="dz-cell dz-combo">
      <span class="dz-label">Combo</span>
      <b class="dz-mult">×1</b>
      <i class="dz-bar"><b class="dz-combo-fill"></b></i>
    </div>
    <div class="dz-cell dz-heat">
      <span class="dz-label">Barrel</span>
      <i class="dz-bar"><b class="dz-heat-fill"></b></i>
      <span class="dz-key dz-heat-note">holding fire heats it</span>
    </div>
    <div class="dz-cell dz-strike">
      <span class="dz-label">Air strike</span>
      <i class="dz-bar dz-charge"><b class="dz-charge-fill"></b></i>
      <span class="dz-key">right-click · A</span>
    </div>
    <div class="dz-cell dz-rank">
      <span class="dz-label">Rank</span>
      <em class="dz-rank-n">Intern</em>
      <span class="dz-ruin"><span class="dz-ruin-n">0</span>% ruined</span>
    </div>
    <div class="dz-actions">
      <button type="button" class="dz-btn dz-sound" title="Sound (M)"></button>
      <button type="button" class="dz-btn dz-music" title="Music (N)"></button>
      <button type="button" class="dz-btn dz-exit" title="Repair everything and exit (Esc)">Repair &amp; exit</button>
    </div>`;
  const $ = (s) => hud.querySelector(s);
  const ui = {
    score: $(".dz-score-n"),
    best: $(".dz-best-n"),
    mult: $(".dz-mult"),
    comboFill: $(".dz-combo-fill"),
    chargeFill: $(".dz-charge-fill"),
    strike: $(".dz-strike"),
    rank: $(".dz-rank-n"),
    ruin: $(".dz-ruin-n"),
    timeCell: $(".dz-time"),
    time: $(".dz-time-n"),
    timeNote: $(".dz-time-note"),
    sound: $(".dz-sound"),
    music: $(".dz-music"),
    heat: $(".dz-heat"),
    heatFill: $(".dz-heat-fill"),
    heatNote: $(".dz-heat-note"),
  };
  const soundLabel = () => {
    ui.sound.textContent = audio.muted ? "Sound off" : "Sound on";
    ui.music.textContent = audio.musicOn ? "Music on" : "Music off";
  };
  soundLabel();

  const toastEl = document.createElement("div");
  toastEl.className = "dz-toast";
  toastEl.setAttribute("data-no-field", "");

  document.body.append(canvas, toastEl, hud, cross);

  /* --- state ------------------------------------------------------------- */

  const S = {
    score: 0,
    combo: 0,
    comboT: 0,
    mult: 1,
    charge: 0,
    rank: 0,
    best: best.get(),
    broken: [],
    total: 1,
    pointer: { x: window.innerWidth / 2, y: window.innerHeight / 2 },
    firing: 0,
    shake: 0,
    heat: 0,
    hot: false,
    striking: false,
    timers: new Set(),
    // the clock
    time: TIME_START,
    running: false,
    over: false,
    earned: 0,
    elapsed: 0,
    shots: 0,
    hitShots: 0,
    maxMult: 1,
    tiersPaid: new Set(),
    capsuleT: rand(CAPSULE_EVERY[0] - 3, CAPSULE_EVERY[1] - 3),
    capsule: null,
    lastTick: Infinity,
  };
  // Development only: the state, for driving the game from a test script.
  if (process.env.NODE_ENV !== "production") window.__dz = S;
  const P = []; // particles and effects
  let raf = 0;
  let last = performance.now();

  const later = (fn, ms) => {
    const id = setTimeout(() => {
      S.timers.delete(id);
      fn();
    }, ms);
    S.timers.add(id);
  };

  /* --- pieces -------------------------------------------------------------- */

  const scope = () => document.querySelector(".j-stage") || document.querySelector(".App") || document.body;

  let pieces = [];
  let hosts = new Map(); // host element -> its pieces
  let piecesAt = 0;
  let rectsAt = 0;

  // A piece's host is the block it sits in. Measuring goes host first, and a
  // host well off screen skips all of its pieces: measuring every letter on
  // a long page, several times a second while firing, cost more than
  // everything else a shot did.
  const HOST = "p, h1, h2, h3, h4, h5, h6, li, dd, dt, button, a, label, figure, div";
  const hostFor = (p) =>
    p.kind === "letter" ? p.el.closest(HOST) || p.el.parentElement : p.kind === "shape" ? p.el.ownerSVGElement || p.el : p.el;

  // Pieces are only re-collected when the page's content changes, not on a
  // timer. Our own HUD, burns and effects do not count.
  let changed = false;
  const OURS = "[class^='dz-'], [class*=' dz-']";
  const contentMo = new MutationObserver((records) => {
    if (changed) return;
    changed = records.some((r) => {
      const t = r.target;
      if (t.nodeType === 1 && t.closest(`${NO}, .dz-burns, .dz-over`)) return false;
      for (const n of r.addedNodes) if (!(n.nodeType === 1 && n.matches(OURS))) return true;
      for (const n of r.removedNodes) if (!(n.nodeType === 1 && n.matches(OURS))) return true;
      return false;
    });
  });
  contentMo.observe(document.body, { childList: true, subtree: true });

  const collect = () => {
    const root = scope();
    const out = [];
    // Not the link spaces (.fx-sp): an invisible piece is no target.
    root.querySelectorAll(".fx-l:not(.fx-sp), .wb-l").forEach((el) => {
      if (!el.closest(NO)) out.push({ el, kind: "letter" });
    });
    root.querySelectorAll("svg").forEach((svg) => {
      if (svg.closest(NO)) return;
      const r = svg.getBoundingClientRect();
      if (r.width && r.width < 64 && r.height < 64) {
        out.push({ el: svg, kind: "icon" });
        return;
      }
      svg.querySelectorAll(SHAPES).forEach((el) => {
        if (!el.closest(NOT_SHAPE)) out.push({ el, kind: "shape" });
      });
    });
    root.querySelectorAll("img, video").forEach((el) => {
      if (!el.closest(NO) && !el.closest("svg")) out.push({ el, kind: "media" });
    });
    // Keep what we already know about pieces we have seen before.
    const known = new Map(pieces.map((p) => [p.el, p]));
    pieces = out.map((p) => known.get(p.el) || p);
    hosts = new Map();
    for (const p of pieces) {
      if (!p.host) p.host = hostFor(p);
      let list = hosts.get(p.host);
      if (!list) hosts.set(p.host, (list = []));
      list.push(p);
    }
    changed = false;
    piecesAt = performance.now();
    rectsAt = 0;
  };

  const rectOf = (p) => {
    const b = p.el.getBoundingClientRect();
    p.rect = b.width || b.height ? { l: b.left, t: b.top, r: b.right, b: b.bottom, w: b.width, h: b.height } : null;
  };

  /** Measure the pieces on or near the screen; `all` measures every one. */
  const measure = (all = false) => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const m = STRIKE_R * 2;
    for (const [host, list] of hosts) {
      let near = all;
      if (!near) {
        const h = host.getBoundingClientRect();
        // A zero-size host (display: contents, say) proves nothing about
        // where its pieces are, so they are measured anyway.
        near = (!h.width && !h.height) || (h.right > -m && h.bottom > -m && h.left < vw + m && h.top < vh + m);
      }
      for (const p of list) {
        if (p.broken) continue;
        if (near) rectOf(p);
        else p.rect = null;
      }
    }
    rectsAt = performance.now();
  };

  const fresh = () => {
    const now = performance.now();
    if (changed && now - piecesAt > 500) {
      collect();
      sizeBurns();
    }
    if (now - rectsAt > 250) measure();
  };

  collect();
  measure(true);
  S.total = Math.max(1, pieces.filter((p) => p.rect).length);

  const visible = (el) => {
    if (!el.isConnected) return false;
    if (el.checkVisibility) {
      return el.checkVisibility({ opacityProperty: true, visibilityProperty: true });
    }
    return true;
  };

  /** Every unbroken piece whose box the circle touches, nearest first. */
  const inBlast = (x, y, r) => {
    fresh();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const hits = [];
    for (const p of pieces) {
      if (p.broken || !p.rect) continue;
      const q = p.rect;
      if (q.r < 0 || q.b < 0 || q.l > vw || q.t > vh) continue;
      // Background-sized shapes (the ground, a world-wide band) are scenery,
      // not targets.
      if (p.kind === "shape" && q.w * q.h > vw * vh * 0.3) continue;
      const nx = Math.max(q.l, Math.min(x, q.r));
      const ny = Math.max(q.t, Math.min(y, q.b));
      const d = Math.hypot(x - nx, y - ny);
      if (d > r) continue;
      if (!visible(p.el)) continue;
      hits.push({ p, d });
    }
    hits.sort((a, b) => a.d - b.d);
    return hits.map((h) => h.p);
  };

  /* --- debris -------------------------------------------------------------- */

  const colourOf = (el) => {
    const cs = getComputedStyle(el);
    const ok = (v) => v && v !== "none" && !v.startsWith("url") && v !== "rgba(0, 0, 0, 0)";
    if (ok(cs.fill)) return cs.fill;
    if (ok(cs.stroke)) return cs.stroke;
    return C.ink;
  };

  const fling = (cx, cy, x, y, force) => {
    let dx = x - cx;
    let dy = y - cy;
    const len = Math.hypot(dx, dy) || 1;
    dx /= len;
    dy /= len;
    const sp = rand(260, 620) * force;
    return {
      vx: dx * sp + rand(-120, 120),
      vy: dy * sp - rand(180, 420) * force,
      vr: rand(-9, 9) * force,
    };
  };

  /** A letter's font and colour, read once per word: letters share them. */
  const letterStyle = (el, styles) => {
    const key = el.parentElement || el;
    let st = styles.get(key);
    if (!st) {
      const cs = getComputedStyle(el);
      st = { font: `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`, color: cs.color };
      styles.set(key, st);
    }
    return st;
  };

  /**
   * An image or video copied once, at the size it is shown, for its shards to
   * draw from. Drawing the source itself meant decoding and scaling a full
   * resolution photo (or a video frame) for every shard on every frame.
   */
  const snapshot = (el, q) => {
    const c = document.createElement("canvas");
    c.width = Math.max(1, Math.round(q.w * dpr));
    c.height = Math.max(1, Math.round(q.h * dpr));
    try {
      c.getContext("2d").drawImage(el, 0, 0, c.width, c.height);
    } catch {
      /* a video not ready yet — the outline still flies */
    }
    return c;
  };

  /**
   * Debris for one piece, pushed onto `out`. Reads styles only; the caller
   * hides the pieces afterwards, so a whole blast costs one style pass
   * instead of one per piece.
   */
  const debrisFor = (p, cx, cy, force, out, styles) => {
    const q = p.rect;
    const mx = (q.l + q.r) / 2;
    const my = (q.t + q.b) / 2;
    if (p.kind === "letter") {
      const st = letterStyle(p.el, styles);
      out.push({
        k: "glyph",
        ch: p.el.textContent,
        font: st.font,
        c: st.color,
        x: mx,
        y: my,
        rot: 0,
        t: 0,
        life: rand(1.4, 2.1),
        ...fling(cx, cy, mx, my, force),
      });
      for (let i = 0; i < 2; i++) {
        out.push({ k: "dot", x: mx, y: my, r: rand(1, 2.2), c: st.color, t: 0, life: rand(0.5, 0.9), g: 1, ...fling(cx, cy, mx, my, force * 1.2) });
      }
      return;
    }
    // Shapes, icons and media shatter into a grid of jittered shards.
    const area = q.w * q.h;
    const k = Math.max(2, Math.min(6, Math.round(Math.sqrt(area) / 45)));
    const cw = q.w / k;
    const ch = q.h / k;
    const c = p.kind === "media" ? null : p.kind === "icon" ? C.ink : colourOf(p.el);
    const src = p.kind === "media" ? snapshot(p.el, q) : null;
    for (let i = 0; i < k; i++) {
      for (let j = 0; j < k; j++) {
        const sx = q.l + i * cw;
        const sy = q.t + j * ch;
        const px = sx + cw / 2;
        const py = sy + ch / 2;
        const jit = () => [rand(-0.15, 0.15) * cw, rand(-0.15, 0.15) * ch];
        // a quad with each corner nudged, relative to the shard centre
        const pts = [
          [-cw / 2, -ch / 2],
          [cw / 2, -ch / 2],
          [cw / 2, ch / 2],
          [-cw / 2, ch / 2],
        ].map(([a, b]) => {
          const [ja, jb] = jit();
          return [a + ja, b + jb];
        });
        out.push({
          k: p.kind === "media" ? "img" : "shard",
          pts,
          c,
          src,
          sx,
          sy,
          sw: cw,
          sh: ch,
          rect: q,
          x: px,
          y: py,
          rot: 0,
          t: 0,
          life: rand(1.3, 2),
          ...fling(cx, cy, px, py, force * (p.kind === "media" ? 0.8 : 1)),
        });
      }
    }
  };

  /* --- effects ------------------------------------------------------------- */

  const explode = (x, y, r, big = false) => {
    const pal = [C.coral, C.apricot, C.butter, C.rose];
    P.push({ k: "flash", x, y, r: r * 0.9, t: 0, life: big ? 0.18 : 0.1 });
    const n = big ? 7 : 4;
    for (let i = 0; i < n; i++) {
      const a = Math.random() * TAU;
      const d = Math.random() * r * 0.5;
      P.push({
        k: "disc",
        x: x + Math.cos(a) * d,
        y: y + Math.sin(a) * d,
        r: r * rand(0.35, 0.8),
        c: pal[i % pal.length],
        t: -i * 0.025,
        life: rand(0.35, 0.6) * (big ? 1.4 : 1),
      });
    }
    P.push({ k: "ring", x, y, r: r * 1.6, t: 0, life: big ? 0.6 : 0.4, w: big ? 4 : 2.5 });
    const sparks = big ? 42 : 14;
    for (let i = 0; i < sparks; i++) {
      const a = Math.random() * TAU;
      const sp = rand(260, 820) * (big ? 1.5 : 1);
      P.push({
        k: "dot",
        x,
        y,
        vx: Math.cos(a) * sp,
        vy: Math.sin(a) * sp - 120,
        r: rand(1.4, 3.6),
        c: Math.random() < 0.35 ? C.ink : pal[i % pal.length],
        t: 0,
        life: rand(0.35, 0.8),
        g: 1,
      });
    }
    const smoke = big ? 9 : 3;
    for (let i = 0; i < smoke; i++) {
      P.push({
        k: "smoke",
        x: x + rand(-r, r) * 0.4,
        y: y + rand(-r, r) * 0.3,
        vx: rand(-30, 30),
        vy: rand(-90, -40),
        r: r * rand(0.25, 0.5),
        c: Math.random() < 0.5 ? C.lilac : C.sky,
        t: -rand(0, 0.15),
        life: rand(0.9, 1.5),
      });
    }
    scorch(x, y, r * (big ? 0.85 : 0.6));
  };

  /** A burn left on the page, printed in halftone, that scrolls with it. */
  const scorches = [];
  // All burns live in one layer the size of the page that clips its
  // contents: a mark near the edge (an air-strike crater can be 200px wide)
  // would otherwise stick out past the page and give it a horizontal
  // scrollbar.
  let burnLayer = null;
  const burns = () => {
    const host = document.querySelector(".j-stage") || document.body;
    if (!burnLayer || burnLayer.parentNode !== host) {
      burnLayer && burnLayer.remove();
      burnLayer = document.createElement("div");
      burnLayer.className = "dz-burns";
      host.appendChild(burnLayer);
      sizeBurns();
    }
    return host;
  };

  // Reading the page height forces a layout, so it is read when the layer is
  // made, when the content changes and on resize — not for every burn.
  function sizeBurns() {
    if (burnLayer && burnLayer.parentNode === document.body) {
      burnLayer.style.height = `${document.documentElement.scrollHeight}px`;
    }
  }

  const scorch = (x, y, r) => {
    const host = burns();
    const box = host === document.body ? { left: -window.scrollX, top: -window.scrollY } : host.getBoundingClientRect();
    const el = document.createElement("i");
    el.className = "dz-scorch";
    el.style.left = `${x - box.left - r}px`;
    el.style.top = `${y - box.top - r}px`;
    el.style.width = el.style.height = `${r * 2}px`;
    el.style.rotate = `${rand(0, 360)}deg`;
    burnLayer.appendChild(el);
    scorches.push(el);
    if (scorches.length > 70) scorches.shift().remove();
  };

  const pop = (x, y, text, size = 1, c = C.ink) => {
    P.push({ k: "text", x, y, text, size, c, t: 0, life: 0.9 + size * 0.15 });
  };

  let toastTimer = 0;
  let stickyUp = false;
  /** A banner. `sticky` ones stay up until dismissSticky() is called. */
  const toast = (text, kind = "", { sticky = false } = {}) => {
    toastEl.textContent = text;
    toastEl.className = `dz-toast ${kind}`;
    void toastEl.offsetWidth;
    toastEl.classList.add(sticky ? "stay" : "show");
    stickyUp = sticky;
    clearTimeout(toastTimer);
    if (!sticky) toastTimer = setTimeout(() => toastEl.classList.remove("show"), 1400);
  };
  const dismissSticky = () => {
    if (!stickyUp) return;
    stickyUp = false;
    toastEl.classList.remove("stay");
    toastEl.classList.add("gone");
  };

  const shake = (amount) => {
    S.shake = Math.max(S.shake, amount);
  };

  const shakeTargets = () =>
    document.querySelector(".j-stage")
      ? [document.querySelector(".j-stage")]
      : [document.querySelector(".main-container"), document.querySelector(".footer")].filter(Boolean);

  const unshake = () =>
    shakeTargets().forEach((el) => {
      el.style.translate = "";
      el.style.willChange = "";
    });

  /** A HUD bar's fill, clipped rather than resized so it never re-lays out. */
  const fillTo = (el, pct) => {
    el.style.clipPath = `inset(0 ${(100 - Math.max(0, Math.min(100, pct))).toFixed(2)}% 0 0)`;
  };

  /* --- scoring ------------------------------------------------------------- */

  const valueOf = (p) => {
    if (p.kind === "letter") return 10;
    if (p.kind === "icon") return 30;
    if (p.kind === "media") return 80;
    const q = p.rect;
    return Math.round(15 + Math.min(60, Math.sqrt(q.w * q.h) / 4));
  };

  const award = (hits, x, y, { big = false } = {}) => {
    if (!hits.length || S.over) return;
    // combo
    S.combo += 1;
    S.comboT = COMBO_WINDOW;
    const mult = Math.min(6, 1 + Math.floor(S.combo / 5));
    if (mult > S.mult && CALLOUTS[mult]) toast(`${CALLOUTS[mult]} ×${mult}`, "combo");
    S.mult = mult;
    S.maxMult = Math.max(S.maxMult, mult);
    if (!S.striking) audio.intensity(mult);
    // each new tier of this combo run buys time, once
    if (!big && TIER_TIME[mult] && !S.tiersPaid.has(mult)) {
      S.tiersPaid.add(mult);
      gainTime(TIER_TIME[mult], x + 40, y - 70);
    }

    let pts = hits.reduce((n, p) => n + valueOf(p), 0) * S.mult;

    // a whole word gone
    const words = new Set();
    hits.forEach((p) => {
      if (p.kind === "letter") {
        const w = p.el.closest(".fx-w");
        if (w) words.add(w);
      }
    });
    let wordBonus = 0;
    words.forEach((w) => {
      const letters = w.querySelectorAll(".fx-l");
      // A word you took out on purpose: long enough to count, and gone in
      // this one blast rather than chipped away over many.
      const all = Array.from(letters);
      const now = all.filter((l) => hits.some((p) => p.el === l)).length;
      if (all.length >= 4 && now >= all.length * 0.6 && all.every((l) => l.style.visibility === "hidden") && !w.__dzDone) {
        w.__dzDone = true;
        wordBonus += 8 * all.length;
      }
    });
    if (wordBonus) {
      pts += wordBonus * S.mult;
      pop(x + rand(-30, 30), y - 34, "word!", 0.9, C.coral);
      if (!big) gainTime(WORD_TIME, x - 40, y - 60);
    }

    if (!big && hits.length >= 14) {
      pts += 80 * S.mult;
      pop(x, y - 52, "shatter!", 1.3, C.coral);
      gainTime(SHATTER_TIME, x, y - 86);
    }

    // The strike pays out at half rate and never charges the next one.
    if (big) pts = Math.round(pts / 2);
    S.score += pts;
    if (!big && !S.striking) S.charge = Math.min(CHARGE_FULL, S.charge + pts);
    pop(x, y - 18, `+${pts}`, big ? 1.6 : Math.min(1.5, 0.8 + hits.length * 0.04));

    // rank
    let rank = 0;
    RANKS.forEach(([at], i) => {
      if (S.score >= at) rank = i;
    });
    if (rank > S.rank) {
      S.rank = rank;
      toast(`Promoted: ${RANKS[rank][1]}`, "rank");
    }
    if (S.charge >= CHARGE_FULL && !ui.strike.classList.contains("ready")) {
      toast("Air strike ready — right-click or A", "ready");
    }
    if (S.score > S.best) {
      S.best = S.score;
      best.set(S.best);
    }
    render();
  };

  const render = () => {
    ui.score.textContent = S.score.toLocaleString();
    ui.best.textContent = S.best.toLocaleString();
    ui.mult.textContent = `×${S.mult}`;
    ui.chargeFill.style.width = `${(S.charge / CHARGE_FULL) * 100}%`;
    ui.strike.classList.toggle("ready", S.charge >= CHARGE_FULL);
    cross.classList.toggle("ready", S.charge >= CHARGE_FULL);
    ui.rank.textContent = RANKS[S.rank][1];
    ui.ruin.textContent = Math.min(100, Math.round((S.broken.length / S.total) * 100));
  };

  /* --- barrel heat ---------------------------------------------------------- */

  const heatArc = cross.querySelector(".dz-cross-heat");
  const renderHeat = () => {
    const h = Math.max(0, Math.min(100, S.heat));
    fillTo(ui.heatFill, h);
    heatArc.style.strokeDasharray = `${h.toFixed(1)} 100`;
    // butter -> coral as it climbs; the arc deepens with it
    cross.style.setProperty("--heat", (h / 100).toFixed(3));
  };

  const overheat = () => {
    S.hot = true;
    S.heat = 100;
    stopFire();
    audio.hiss();
    audio.muffle(true);
    ui.heat.classList.add("hot");
    cross.classList.add("hot");
    ui.heatNote.textContent = "overheated — cooling";
    pop(S.pointer.x, S.pointer.y - 40, "overheated!", 1.1, C.coral);
    steam(S.pointer.x, S.pointer.y, 8);
    wake();
  };

  const cooled = () => {
    S.hot = false;
    S.heat = 0;
    audio.muffle(false);
    ui.heat.classList.remove("hot");
    cross.classList.remove("hot");
    ui.heatNote.textContent = "holding fire heats it";
    renderHeat();
  };

  const steam = (x, y, n) => {
    for (let i = 0; i < n; i++) {
      P.push({
        k: "smoke",
        x: x + rand(-14, 14),
        y: y + rand(-8, 8),
        vx: rand(-25, 25),
        vy: rand(-120, -60),
        r: rand(5, 11),
        c: Math.random() < 0.5 ? C.sky : C.lilac,
        t: -rand(0, 0.25),
        life: rand(0.7, 1.2),
      });
    }
  };

  /* --- the clock ----------------------------------------------------------- */

  const fmt = (t) => Math.max(0, t).toFixed(1);

  let timeText = "";
  const renderTime = () => {
    // Written only when the tenths change, not on every frame.
    const t = fmt(S.time);
    if (t !== timeText) ui.time.textContent = timeText = t;
    ui.timeCell.classList.toggle("low", S.running && !S.over && S.time <= LOW_TIME);
  };

  const flashTime = (cls) => {
    ui.timeCell.classList.remove("gain", "loss");
    void ui.timeCell.offsetWidth;
    ui.timeCell.classList.add(cls);
  };

  /** Add time, scaled down by how much has been earned already. */
  function gainTime(base, x, y) {
    if (S.over) return;
    const scaled = base / (1 + S.earned / TIME_HALF);
    const amt = Math.min(scaled, TIME_MAX - S.time);
    if (amt < 0.05) return;
    S.time += amt;
    S.earned += amt;
    pop(x, y, `+${amt.toFixed(1)}s`, 1.05, C.limeInk);
    flashTime("gain");
    renderTime();
  }

  const loseTime = (amt, x, y) => {
    if (!S.running || S.over) return;
    S.time -= amt;
    pop(x, y - 14, `−${amt.toFixed(1)}s`, 0.7, C.coral);
    flashTime("loss");
    renderTime();
  };

  /* --- time capsules --------------------------------------------------------- */

  const spawnCapsule = () => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const el = document.createElement("div");
    el.className = "dz-capsule";
    el.setAttribute("data-no-field", "");
    el.innerHTML = `<svg viewBox="-34 -38 68 72" aria-hidden="true">
      <circle r="27" class="dz-capsule-plate" />
      <rect x="-6" y="-37" width="12" height="7" rx="2" />
      <circle r="21" class="dz-capsule-face" />
      <path d="M0 -14 V0 L9 7" class="dz-capsule-hands" />
      <text y="30" text-anchor="middle">+${CAPSULE_TIME}s</text>
    </svg>`;
    document.body.appendChild(el);
    const fromLeft = Math.random() < 0.5;
    S.capsule = {
      el,
      x: fromLeft ? vw * rand(0.12, 0.3) : vw * rand(0.7, 0.88),
      y: vh * rand(0.25, 0.6),
      vx: (fromLeft ? 1 : -1) * rand(40, 80),
      vy: rand(-25, 25),
      t: 0,
    };
  };

  const removeCapsule = () => {
    if (S.capsule) S.capsule.el.remove();
    S.capsule = null;
    S.capsuleT = rand(CAPSULE_EVERY[0], CAPSULE_EVERY[1]);
  };

  /** Returns true when the shot took the capsule. */
  const hitCapsule = (x, y) => {
    const c = S.capsule;
    if (!c || Math.hypot(c.x - x, c.y - y) > CAPSULE_R) return false;
    explode(c.x, c.y, 34);
    P.push({ k: "ring", x: c.x, y: c.y, r: 70, t: 0, life: 0.5, w: 3 });
    audio.chime();
    S.score += 250 * S.mult;
    pop(c.x, c.y - 40, `+${250 * S.mult}`, 1);
    gainTime(CAPSULE_TIME, c.x, c.y - 70);
    removeCapsule();
    render();
    return true;
  };

  const moveCapsule = (dt) => {
    const c = S.capsule;
    if (!c) return;
    c.t += dt;
    c.x += c.vx * dt;
    c.y += c.vy * dt + Math.sin(c.t * 3) * 0.4;
    c.el.style.translate = `${c.x.toFixed(1)}px ${c.y.toFixed(1)}px`;
    c.el.classList.toggle("fading", c.t > CAPSULE_LIFE - 1.2);
    if (c.t >= CAPSULE_LIFE) removeCapsule();
  };

  /* --- game over ------------------------------------------------------------- */

  let overEl = null;

  const gameOver = () => {
    S.over = true;
    S.time = 0;
    stopFire();
    removeCapsule();
    renderTime();
    audio.gameOver();
    audio.intensity(1);
    audio.muffle(true);
    dismissSticky();
    const acc = S.shots ? Math.round((S.hitShots / S.shots) * 100) : 0;
    const isBest = S.score > 0 && S.score >= S.best;
    overEl = document.createElement("div");
    overEl.className = "dz-over";
    overEl.setAttribute("data-no-destroy", "");
    overEl.setAttribute("data-no-field", "");
    overEl.innerHTML = `
      <div class="dz-over-card">
        <p class="dz-label">Time's up</p>
        <h2 class="dz-over-score">${S.score.toLocaleString()}</h2>
        ${isBest ? '<span class="dz-over-best">New best!</span>' : `<p class="dz-over-sub">best ${S.best.toLocaleString()}</p>`}
        <p class="dz-over-rank"><em>${RANKS[S.rank][1]}</em></p>
        <dl class="dz-over-stats">
          <dt>Survived</dt><dd>${fmt(S.elapsed)}s</dd>
          <dt>Accuracy</dt><dd>${acc}%</dd>
          <dt>Best combo</dt><dd>×${S.maxMult}</dd>
          <dt>Broken</dt><dd>${S.broken.length.toLocaleString()}</dd>
          <dt>Ruined</dt><dd>${Math.min(100, Math.round((S.broken.length / S.total) * 100))}%</dd>
          <dt>Time earned</dt><dd>+${fmt(S.earned)}s</dd>
        </dl>
        <div class="dz-over-actions">
          <button type="button" class="dz-btn dz-again">Play again</button>
          <button type="button" class="dz-btn dz-exit dz-over-exit">Repair &amp; exit</button>
        </div>
      </div>`;
    document.body.appendChild(overEl);
    overEl.querySelector(".dz-again").addEventListener("click", playAgain);
    overEl.querySelector(".dz-over-exit").addEventListener("click", () => exit());
  };

  /** Put every broken piece back, flying in, and clear the burns. */
  function repairAll() {
    S.broken.forEach((p, i) => {
      const el = p.el;
      p.broken = false;
      el.style.visibility = p.prevVis || "";
      if (!el.isConnected || !el.animate) return;
      el.animate(
        [
          { translate: `${rand(-60, 60)}px ${rand(-140, -60)}px`, opacity: 0 },
          { translate: "0 0", opacity: 1 },
        ],
        { duration: 520, delay: Math.min(900, i * 2), easing: "cubic-bezier(0.2, 1.4, 0.4, 1)", fill: "backwards" },
      );
    });
    S.broken = [];
    document.querySelectorAll(".fx-w").forEach((w) => delete w.__dzDone);
    scorches.splice(0).forEach((el) =>
      el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 600 }).finished.then(() => el.remove(), () => el.remove()),
    );
    rectsAt = 0;
  }

  function playAgain() {
    if (overEl) overEl.remove();
    setTimeout(() => burnLayer && burnLayer.remove(), 700);
    overEl = null;
    repairAll();
    Object.assign(S, {
      score: 0,
      combo: 0,
      comboT: 0,
      mult: 1,
      charge: 0,
      rank: 0,
      time: TIME_START,
      running: false,
      over: false,
      earned: 0,
      elapsed: 0,
      shots: 0,
      hitShots: 0,
      maxMult: 1,
      lastTick: Infinity,
    });
    S.tiersPaid.clear();
    S.capsuleT = rand(CAPSULE_EVERY[0] - 3, CAPSULE_EVERY[1] - 3);
    if (S.hot) cooled();
    S.heat = 0;
    renderHeat();
    audio.muffle(false);
    ui.timeNote.textContent = "starts on your first shot";
    fillTo(ui.comboFill, 0);
    render();
    renderTime();
    toast("Again! The clock starts on your first shot", "rank", { sticky: true });
  }

  /* --- breaking ------------------------------------------------------------ */

  /** The debris for a blast. Reads only — see debrisFor. */
  const shatter = (hits, cx, cy, force) => {
    const out = [];
    const styles = new Map();
    for (const p of hits) debrisFor(p, cx, cy, force, out, styles);
    return out;
  };

  /** Launch the debris and hide the pieces it came from. Writes only. */
  const breakAll = (hits, debris) => {
    for (const q of debris) P.push(q);
    for (const p of hits) {
      p.broken = true;
      p.prevVis = p.el.style.visibility;
      p.el.style.visibility = "hidden";
      S.broken.push(p);
    }
    // keep the canvas from drowning
    if (P.length > 2600) P.splice(0, P.length - 2600);
  };

  const shoot = (x, y, spread = 0) => {
    if (S.hot) {
      stopFire();
      audio.dry();
      cross.classList.remove("jam");
      void cross.offsetWidth;
      cross.classList.add("jam");
      return;
    }
    S.heat += HEAT_SHOT;
    renderHeat();
    if (S.heat >= 100) {
      overheat();
      return;
    }
    x += rand(-spread, spread);
    y += rand(-spread, spread);
    if (!S.running) {
      S.running = true;
      ui.timeNote.textContent = "combos, words, capsules = time";
    }
    S.shots += 1;
    audio.shot();
    cross.classList.remove("fire");
    void cross.offsetWidth;
    cross.classList.add("fire");
    P.push({ k: "flash", x, y, r: 9, t: 0, life: 0.06 });
    const tookCapsule = hitCapsule(x, y);
    const hits = inBlast(x, y, SHOT_R);
    if (!hits.length) {
      if (tookCapsule) {
        S.hitShots += 1;
        wake();
        return;
      }
      // a miss still marks the paper — and costs time
      P.push({ k: "ring", x, y, r: 12, t: 0, life: 0.25, w: 1.5 });
      loseTime(MISS_COST, x, y);
      wake();
      return;
    }
    S.hitShots += 1;
    const debris = shatter(hits, x, y, 1);
    cross.classList.remove("hit");
    void cross.offsetWidth;
    cross.classList.add("hit");
    explode(x, y, SHOT_R + 6 + Math.min(hits.length, 16) * 1.5);
    breakAll(hits, debris);
    audio.pop(hits.length);
    shake(Math.min(7, 2 + hits.length * 0.3));
    award(hits, x, y);
    wake();
  };

  /* --- the air strike ------------------------------------------------------ */

  const airStrike = () => {
    if (S.charge < CHARGE_FULL || S.striking || S.over) return;
    S.striking = true;
    S.charge = 0;
    render();
    toast("Air strike inbound!", "strike");
    audio.intensity(6);
    audio.engine();
    later(() => audio.whistle(), 500);

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const y0 = 104;
    const dur = 2600;
    const plane = document.createElement("div");
    plane.className = "dz-plane";
    plane.innerHTML = `<svg viewBox="0 0 240 90" aria-hidden="true">
      <path d="M 18 46 Q 20 34 60 33 L 190 30 Q 226 31 232 45 Q 226 58 190 58 L 60 56 Q 20 56 18 46 Z" fill="${C.ink}"/>
      <path d="M 110 34 L 150 2 L 166 2 L 150 34 Z M 110 56 L 150 88 L 166 88 L 150 56 Z" fill="${C.ink}"/>
      <path d="M 22 40 L 6 18 L 20 18 L 44 36 Z" fill="${C.ink}"/>
      <circle cx="138" cy="45" r="7" fill="${C.coral}"/>
      <path d="M 60 45 H 186" stroke="${C.lime}" stroke-width="3"/>
      <circle cx="214" cy="42" r="5" fill="${C.sky}"/>
    </svg>`;
    document.body.appendChild(plane);
    const anim = plane.animate(
      [
        { translate: `-280px ${y0 - 45}px` },
        { translate: `${vw + 40}px ${y0 - 60}px` },
      ],
      { duration: dur, easing: "linear", fill: "forwards" },
    );
    anim.onfinish = () => plane.remove();

    const bombs = Math.round(vw / 105);
    for (let i = 0; i < bombs; i++) {
      const at = 260 + (i / bombs) * (dur - 520);
      later(() => {
        const x = -280 + ((vw + 320) * at) / dur + 120;
        const ty = rand(vh * 0.28, vh * 0.92);
        P.push({ k: "bomb", x0: x, y0: y0, x: x + rand(20, 60), y: ty, t: 0, life: 0.55 });
        wake();
      }, at);
    }
    later(() => {
      S.striking = false;
      audio.intensity(S.mult);
      toast(`Strike complete — ${RANKS[S.rank][1]}`, "rank");
    }, dur + 900);
  };

  const bombLands = (x, y) => {
    // Measure and read before the explosion prints its burn on the page.
    const hits = inBlast(x, y, STRIKE_R);
    const debris = shatter(hits, x, y, 1.6);
    explode(x, y, STRIKE_R * 0.8, true);
    breakAll(hits, debris);
    audio.boom();
    shake(16);
    if (hits.length) award(hits, x, y, { big: true });
  };

  /* --- the loop ------------------------------------------------------------ */

  const blend = () => (dark() ? "screen" : "multiply");

  const draw = (dt) => {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, surface.width, surface.height);
    const print = blend();
    const halo = dark() ? "#191816" : "#f4efe6";
    // State is set per particle, and only when it changes, instead of a full
    // save and restore around each one: with a couple of thousand particles
    // in flight that bookkeeping was a large share of the frame. The order
    // they are drawn in, and so how they overlap, is unchanged.
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.globalCompositeOperation = "source-over";
    ctx.setLineDash([]);
    let comp = "source-over";
    let dash = "";
    let font = "";
    const composite = (v) => {
      if (v !== comp) ctx.globalCompositeOperation = comp = v;
    };
    const dashes = (key, seg) => {
      if (key !== dash) {
        ctx.setLineDash(seg);
        dash = key;
      }
    };
    const setFont = (f) => {
      if (f !== font) ctx.font = font = f;
    };
    const home = () => ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    let dead = 0;
    for (let i = P.length - 1; i >= 0; i--) {
      const q = P[i];
      if (!q) continue;
      q.t += dt;
      if (q.t >= q.life) {
        if (q.k === "bomb") bombLands(q.x, q.y);
        q.dead = true;
        dead++;
        continue;
      }
      if (q.t < 0) continue;
      const p = q.t / q.life;
      ctx.globalAlpha = 1;
      switch (q.k) {
        case "flash":
          composite("source-over");
          ctx.globalAlpha = 1 - p;
          ctx.fillStyle = C.butter;
          ctx.beginPath();
          ctx.arc(q.x, q.y, q.r * (0.6 + 0.4 * p), 0, TAU);
          ctx.fill();
          break;
        case "disc": {
          const s = p < 0.3 ? ease(p / 0.3) : 1 - (p - 0.3) / 0.7;
          composite(print);
          ctx.fillStyle = q.c;
          ctx.beginPath();
          ctx.arc(q.x, q.y, Math.max(0, q.r * s), 0, TAU);
          ctx.fill();
          break;
        }
        case "ring":
          composite("source-over");
          dashes("ring", [2, 6]);
          ctx.globalAlpha = 1 - p;
          ctx.strokeStyle = C.ink;
          ctx.lineWidth = q.w * (1 - p) + 0.3;
          ctx.beginPath();
          ctx.arc(q.x, q.y, q.r * ease(p), 0, TAU);
          ctx.stroke();
          break;
        case "smoke":
          q.x += q.vx * dt;
          q.y += q.vy * dt;
          composite(print);
          ctx.globalAlpha = 0.6 * (1 - p);
          ctx.fillStyle = q.c;
          ctx.beginPath();
          ctx.arc(q.x, q.y, q.r * (0.6 + p), 0, TAU);
          ctx.fill();
          break;
        case "dot":
          q.vy += 900 * q.g * dt;
          q.vx *= 0.985;
          q.x += q.vx * dt;
          q.y += q.vy * dt;
          composite("source-over");
          ctx.globalAlpha = 1 - p * p;
          ctx.fillStyle = q.c;
          ctx.beginPath();
          ctx.arc(q.x, q.y, q.r, 0, TAU);
          ctx.fill();
          break;
        case "glyph":
        case "shard":
        case "img": {
          q.vy += 1700 * dt;
          q.vx *= 0.99;
          q.x += q.vx * dt;
          q.y += q.vy * dt;
          q.rot += q.vr * dt;
          composite("source-over");
          ctx.globalAlpha = p > 0.7 ? 1 - (p - 0.7) / 0.3 : 1;
          // translate(x, y) then rotate(rot), in one matrix
          const cos = Math.cos(q.rot) * dpr;
          const sin = Math.sin(q.rot) * dpr;
          ctx.setTransform(cos, sin, -sin, cos, q.x * dpr, q.y * dpr);
          if (q.k === "glyph") {
            setFont(q.font);
            ctx.fillStyle = q.c;
            ctx.fillText(q.ch, 0, 0);
          } else {
            const pts = q.pts;
            ctx.beginPath();
            ctx.moveTo(pts[0][0], pts[0][1]);
            for (let n = 1; n < pts.length; n++) ctx.lineTo(pts[n][0], pts[n][1]);
            ctx.closePath();
            if (q.k === "img") {
              // the clip is the one thing that needs a save and restore
              ctx.save();
              ctx.clip();
              const r = q.rect;
              ctx.drawImage(q.src, r.l - q.x, r.t - q.y, r.w, r.h);
              ctx.restore();
              dashes("", []);
              ctx.strokeStyle = C.ink;
              ctx.lineWidth = 1;
              ctx.stroke();
            } else {
              ctx.fillStyle = q.c;
              ctx.fill();
            }
          }
          home();
          break;
        }
        case "text": {
          const s = q.size * (p < 0.15 ? 0.6 + (p / 0.15) * 0.5 : 1.1 - (p - 0.15) * 0.15);
          composite("source-over");
          dashes("", []);
          ctx.globalAlpha = p > 0.6 ? 1 - (p - 0.6) / 0.4 : 1;
          // translate(x, y - rise) then scale(s)
          ctx.setTransform(dpr * s, 0, 0, dpr * s, q.x * dpr, (q.y - 50 * ease(p)) * dpr);
          setFont(`italic 400 30px "Instrument Serif", serif`);
          ctx.lineWidth = 5;
          ctx.strokeStyle = halo;
          ctx.strokeText(q.text, 0, 0);
          ctx.fillStyle = q.c;
          ctx.fillText(q.text, 0, 0);
          home();
          break;
        }
        case "bomb": {
          const e = p * p;
          const bx = q.x0 + (q.x - q.x0) * p;
          const by = q.y0 + (q.y - q.y0) * e;
          composite("source-over");
          ctx.setTransform(dpr, 0, 0, dpr, bx * dpr, by * dpr);
          ctx.fillStyle = C.ink;
          ctx.beginPath();
          ctx.ellipse(0, 0, 5, 11, 0, 0, TAU);
          ctx.fill();
          ctx.fillStyle = C.lime;
          ctx.fillRect(-5, -14, 10, 4);
          // target marker on the paper below
          home();
          ctx.globalAlpha = 0.5 + 0.5 * p;
          ctx.strokeStyle = C.coral;
          ctx.lineWidth = 1.5;
          dashes("bomb", [3, 4]);
          ctx.beginPath();
          ctx.arc(q.x, q.y, 18 * (1.4 - p * 0.6), 0, TAU);
          ctx.stroke();
          break;
        }
        default:
          break;
      }
    }
    ctx.globalAlpha = 1;
    composite("source-over");

    // Drop the finished ones in one pass, keeping the rest in order (a
    // splice per particle made each frame quadratic in the particle count).
    if (dead) {
      let j = 0;
      for (let i = 0; i < P.length; i++) if (!P[i].dead) P[j++] = P[i];
      P.length = j;
    }
  };

  const frame = (now) => {
    raf = 0;
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;

    // combo decay
    if (S.comboT > 0) {
      S.comboT -= dt;
      fillTo(ui.comboFill, (S.comboT / COMBO_WINDOW) * 100);
      if (S.comboT <= 0) {
        S.combo = 0;
        S.mult = 1;
        S.tiersPaid.clear();
        if (!S.striking) audio.intensity(1);
        ui.mult.textContent = "×1";
        fillTo(ui.comboFill, 0);
      }
    }

    // the clock
    if (S.running && !S.over) {
      S.elapsed += dt;
      S.time -= dt * (1 + S.elapsed / CLOCK_SPEEDUP);
      if (S.time <= 0) gameOver();
      else {
        // a tick each second through the last five
        const whole = Math.ceil(S.time);
        if (S.time <= 5 && whole < S.lastTick) {
          S.lastTick = whole;
          audio.tick(whole <= 2);
        } else if (S.time > 5) S.lastTick = Infinity;
        renderTime();
      }
      // capsules
      if (!S.capsule) {
        S.capsuleT -= dt;
        if (S.capsuleT <= 0) spawnCapsule();
      }
    }
    moveCapsule(dt);

    // the barrel sheds heat
    if (S.heat > 0) {
      S.heat -= (S.hot ? HEAT_COOL_LOCKED : HEAT_COOL) * dt;
      if (S.hot && Math.random() < dt * 6) steam(S.pointer.x, S.pointer.y, 1);
      if (S.heat <= 0) {
        if (S.hot) cooled();
        else {
          S.heat = 0;
          renderHeat();
        }
      } else renderHeat();
    }

    draw(dt);

    // Screen shake. The page is lifted onto its own compositor layer for the
    // length of the shake, so each jolt moves a layer the GPU already has
    // instead of repainting the whole page.
    if (S.shake > 0.3) {
      const a = S.shake;
      shakeTargets().forEach((el) => {
        el.style.willChange = "translate";
        el.style.translate = `${rand(-a, a).toFixed(1)}px ${rand(-a, a).toFixed(1)}px`;
      });
      S.shake *= 0.86;
    } else if (S.shake) {
      S.shake = 0;
      unshake();
    }

    if (P.length || S.comboT > 0 || S.shake || S.heat > 0 || S.capsule || (S.running && !S.over)) wake();
  };

  function wake() {
    if (!raf) {
      last = performance.now();
      raf = requestAnimationFrame(frame);
    }
  }

  /* --- input --------------------------------------------------------------- */

  const inUI = (t) => t && t.closest && t.closest(".dz-hud, .dz-dest, .dz-over");

  const onMove = (e) => {
    S.pointer.x = e.clientX;
    S.pointer.y = e.clientY;
    cross.style.translate = `${e.clientX}px ${e.clientY}px`;
    cross.classList.toggle("over-ui", !!inUI(e.target));
  };

  const stopFire = () => {
    if (S.firing) clearInterval(S.firing);
    S.firing = 0;
  };

  const block = (e) => {
    if (inUI(e.target)) return;
    e.preventDefault();
    e.stopImmediatePropagation();
  };

  const onDown = (e) => {
    if (inUI(e.target)) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    dismissSticky();
    if (S.over) return;
    if (e.button === 2) {
      airStrike();
      return;
    }
    if (e.button !== 0) return;
    shoot(e.clientX, e.clientY);
    stopFire();
    S.firing = setInterval(() => shoot(S.pointer.x, S.pointer.y, 7), AUTO_FIRE);
  };

  const onUp = (e) => {
    stopFire();
    block(e);
  };

  const onKey = (e) => {
    if (e.key === "Escape") {
      e.preventDefault();
      e.stopImmediatePropagation();
      exit();
    } else if (e.key === "a" || e.key === "A") {
      e.preventDefault();
      e.stopImmediatePropagation();
      airStrike();
    } else if (e.key === "m" || e.key === "M") {
      audio.toggle();
      soundLabel();
    } else if (e.key === "n" || e.key === "N") {
      audio.toggleMusic();
      soundLabel();
    }
  };

  const onScroll = () => {
    rectsAt = 0;
  };

  const opts = { capture: true, passive: false };
  window.addEventListener("pointermove", onMove, { capture: true, passive: true });
  window.addEventListener("pointerdown", onDown, opts);
  window.addEventListener("pointerup", onUp, opts);
  window.addEventListener("pointercancel", stopFire, true);
  window.addEventListener("blur", stopFire);
  ["mousedown", "mouseup", "click", "dblclick", "auxclick", "contextmenu", "dragstart", "selectstart"].forEach((t) =>
    window.addEventListener(t, block, opts),
  );
  window.addEventListener("keydown", onKey, true);
  window.addEventListener("scroll", onScroll, { capture: true, passive: true });
  const onResize = () => {
    resize();
    sizeBurns();
    rectsAt = 0;
  };
  window.addEventListener("resize", onResize);

  ui.sound.addEventListener("click", () => {
    audio.toggle();
    soundLabel();
  });
  ui.music.addEventListener("click", () => {
    audio.toggleMusic();
    soundLabel();
  });
  hud.querySelector(".dz-exit").addEventListener("click", () => exit());

  cross.style.translate = `${S.pointer.x}px ${S.pointer.y}px`;
  render();
  renderTime();
  toast("Wreck this page — click to shoot, hold to fire", "rank", { sticky: true });

  /* --- exit: repair everything --------------------------------------------- */

  let exited = false;
  function exit() {
    if (exited) return;
    exited = true;
    stopFire();
    S.timers.forEach(clearTimeout);
    window.removeEventListener("pointermove", onMove, true);
    window.removeEventListener("pointerdown", onDown, true);
    window.removeEventListener("pointerup", onUp, true);
    window.removeEventListener("pointercancel", stopFire, true);
    window.removeEventListener("blur", stopFire);
    ["mousedown", "mouseup", "click", "dblclick", "auxclick", "contextmenu", "dragstart", "selectstart"].forEach((t) =>
      window.removeEventListener(t, block, true),
    );
    window.removeEventListener("keydown", onKey, true);
    window.removeEventListener("scroll", onScroll, true);
    window.removeEventListener("resize", onResize);
    contentMo.disconnect();
    if (raf) cancelAnimationFrame(raf);
    unshake();
    document.querySelectorAll(".dz-plane").forEach((el) => el.remove());

    // Everything flies back into place, staggered.
    repairAll();
    removeCapsule();
    if (overEl) overEl.remove();

    hud.classList.add("leaving");
    cross.remove();
    canvas.remove();
    setTimeout(() => {
      hud.remove();
      toastEl.remove();
    }, 300);
    document.body.classList.remove("dz-on");
    audio.close();
    setFieldPaused(false);
    onExit && onExit();
  }

  return exit;
}
