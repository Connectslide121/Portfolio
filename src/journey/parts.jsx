import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { SCENE_W, VIEW_H, anchor, OVERDRAW, FLOOR, BASE } from "./config";
import { blob, scatter } from "./print";

/**
 * Shared defs: the print textures.
 *
 * Every pattern draws in var(--j-mid), the key plate, which is the same at
 * the root and in every scene — so unlike a gradient these are safe to share
 * from the root <defs> (compare D51: a var() inside a def resolves against
 * the DEF's inherited value, which only matters when a scene overrides it).
 * Receding scenes still fade, because the whole group's opacity drops.
 */
export function JourneyDefs() {
  return (
    <defs>
      <linearGradient id="jSky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="var(--j-sky0)" />
        <stop offset="100%" stopColor="var(--j-sky1)" />
      </linearGradient>

      {/* Halftone: the classic print shading. Fine for a tint across a big
          disc, coarse for sand. */}
      <pattern id="jDots" width="9" height="9" patternUnits="userSpaceOnUse">
        <circle cx="4.5" cy="4.5" r="1.7" fill="var(--j-mid)" />
      </pattern>
      <pattern id="jDotsFine" width="6" height="6" patternUnits="userSpaceOnUse">
        <circle cx="3" cy="3" r="0.95" fill="var(--j-mid)" />
      </pattern>
      {/* Hatching, for anything cut, packed or cast. */}
      <pattern
        id="jHatch"
        width="8"
        height="8"
        patternUnits="userSpaceOnUse"
        patternTransform="rotate(-35)"
      >
        <line x1="0" y1="0" x2="0" y2="8" stroke="var(--j-mid)" strokeWidth="1.2" />
      </pattern>
      {/* Ruled lines: water, glass, a reflection. */}
      <pattern id="jRule" width="12" height="9" patternUnits="userSpaceOnUse">
        <line x1="0" y1="4.5" x2="12" y2="4.5" stroke="var(--j-mid)" strokeWidth="1" />
      </pattern>
    </defs>
  );
}

export function Sky() {
  return <rect x="0" y="0" width={SCENE_W} height={VIEW_H} fill="url(#jSky)" />;
}

/**
 * The distant country, as contour lines rather than filled ridges.
 *
 * On paper a filled far ridge is a grey band that flattens everything in
 * front of it; a single hairline says "hills" just as clearly and leaves the
 * page open. Seeded, so it never jumps between renders.
 */
export function Contour({ y, amp, step, seed, span, dash, opacity = 0.2 }) {
  let n = seed;
  const rnd = () => (n = (n * 9301 + 49297) % 233280) / 233280;
  const end = span + OVERDRAW;
  const pts = [];
  for (let x = -OVERDRAW; x <= end; x += step) {
    pts.push([x, y - rnd() * amp]);
  }
  // Quadratic through the midpoints: each sampled crest is a control point,
  // so the line rolls through the country without a single corner.
  const f = (v) => v.toFixed(0);
  let d = `M ${f(pts[0][0])} ${f(pts[0][1])}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const [x0, y0] = pts[i];
    const [x1, y1] = pts[i + 1];
    d += ` Q ${f(x0)} ${f(y0)} ${f((x0 + x1) / 2)} ${f((y0 + y1) / 2)}`;
  }
  const last = pts[pts.length - 1];
  d += ` L ${f(last[0])} ${f(last[1])}`;
  return (
    <path
      d={d}
      fill="none"
      stroke="var(--j-far)"
      strokeWidth="1.3"
      strokeDasharray={dash}
      strokeLinecap="round"
      opacity={opacity}
    />
  );
}

/**
 * The progress line (D19), screen-anchored and filling left -> right.
 *
 * Two plates, printed a hair out of register: a fat stroke of the current
 * pastel and a hairline of key ink riding just above it. The misregistration
 * is deliberate — it is the single cheapest thing that makes a line look
 * printed instead of drawn by a browser.
 */
const PROGRESS_D = "M 8 34 C 260 33 520 35 760 34 S 1130 33 1292 34";

export function ProgressStream() {
  return (
    <svg
      className="j-progress"
      viewBox="0 0 1300 60"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        data-stream
        d={PROGRESS_D}
        fill="none"
        stroke="var(--j-stream)"
        strokeWidth="7"
        strokeLinecap="round"
      />
      <path
        data-stream
        d={PROGRESS_D}
        transform="translate(3 -3)"
        fill="none"
        stroke="var(--j-mid)"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * The ground: a band of slightly heavier stock with one key-plate rule along
 * its edge. Every place stands on that rule (BASE), so the world reads as one
 * printed sheet rather than slides.
 */
export function Ground({ span = SCENE_W * 6 }) {
  const x0 = -OVERDRAW;
  const x1 = span + OVERDRAW;
  return (
    <g>
      <rect x={x0} y={BASE} width={x1 - x0} height={FLOOR - BASE} fill="var(--j-ground)" />
      <line x1={x0} y1={BASE} x2={x1} y2={BASE} stroke="var(--j-mid)" strokeWidth="1.6" />
      {/* a second, fainter rule — the edge of the plate */}
      <line
        x1={x0}
        y1={BASE + 9}
        x2={x1}
        y2={BASE + 9}
        stroke="var(--j-mid)"
        strokeWidth="0.8"
        strokeDasharray="2 7"
        opacity="0.45"
      />
    </g>
  );
}

/**
 * Ambient weather. Deliberately ~20 elements and driven by its own looping
 * tweens, not the main timeline — atmosphere should keep breathing while the
 * camera sits still.
 *
 * Printed like everything else: specks of key ink for snow and dust, pastel
 * shapes for petals and leaves, and the summer sun as a butter disc.
 */
const PARTICLE = {
  // Screen-space position of the foundry's mould mouth after scene projection
  // (scene x 1446, y 790 -> world ~1306, 804). Sparks come off the metal
  // landing, not off the skyline.
  spark: { tint: "var(--coral)", x: 1290, y: 796, spread: 34, rise: 16 },
  dust: { tint: "var(--j-mid)", x: 700, y: 700, spread: 1100, rise: 260 },
  snow: { tint: "var(--j-mid)", x: 0, y: 90, spread: 1800, rise: 300 },
  blossom: { tint: "var(--rose)", x: 0, y: 120, spread: 1800, rise: 260 },
  leaf: { tint: "var(--apricot)", x: 0, y: 110, spread: 1800, rise: 280 },
  sun: { tint: "var(--butter)", x: 1560, y: 170, spread: 0, rise: 0 },
};

export function Particles({ scene, kind, count = 22 }) {
  const ref = useRef(null);
  const visualCount = kind === "blossom" ? 12 : kind === "leaf" ? 15 : count;

  useEffect(() => {
    const group = ref.current;
    const dots = group?.children;
    if (!dots || !PARTICLE[kind] || kind === "sun") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const tweens = [];
    // Read the stage's current scene rather than assuming the intro: after a
    // season switch this effect re-runs mid-journey, and the timeline only
    // re-asserts activation when the active scene CHANGES — so a recreated
    // group must already know whether it is the one on stage.
    const activeScene = Number(
      group.closest(".j-stage")?.dataset.activeScene ?? 0,
    );
    Array.from(dots).forEach((dot, i) => {
      const cfg = {
        spark: {
          y: -150 - scatter(i, 4) * 130,
          x: (scatter(i, 5) - 0.5) * 70,
          dur: 1.5,
        },
        dust: {
          y: (scatter(i, 6) - 0.5) * 60,
          x: 240 + scatter(i, 7) * 200,
          dur: 4.5,
        },
        snow: {
          y: 340 + scatter(i, 8) * 180,
          x: (scatter(i, 9) - 0.5) * 130,
          dur: 6,
        },
        blossom: {
          y: 300 + scatter(i, 10) * 170,
          x: (scatter(i, 11) - 0.5) * 220,
          rotation: 180,
          dur: 7,
        },
        leaf: {
          y: 310 + scatter(i, 12) * 190,
          x: (scatter(i, 13) - 0.5) * 280,
          rotation: 300,
          dur: 6.5,
        },
      }[kind];
      const tween = gsap.fromTo(
        dot,
        { y: 0, x: 0, rotation: 0, opacity: 0 },
        {
          y: cfg.y,
          x: cfg.x,
          rotation: cfg.rotation || 0,
          opacity: 0,
          keyframes: { opacity: [0, 0.9, 0.9, 0] },
          duration: cfg.dur + scatter(i, 14) * cfg.dur * 0.5,
          delay: (i / visualCount) * cfg.dur,
          repeat: -1,
          ease: kind === "spark" ? "power2.out" : "none",
        },
      );
      if (scene.i !== activeScene) tween.pause(0);
      tweens.push(tween);
    });
    group.__setParticleActive = (active) => {
      tweens.forEach((tween) => (active ? tween.resume() : tween.pause()));
    };
    return () => {
      delete group.__setParticleActive;
      tweens.forEach((t) => t.kill());
    };
  }, [kind, visualCount, scene.i]);

  // A beat's particles are only visible at that beat, where its layer offset
  // and its anchor cancel out — so these are effectively screen coordinates.
  // A beat with no kind simply has no weather.
  const origin = PARTICLE[kind];
  if (!origin) return null;
  const { tint } = origin;

  if (kind === "sun") {
    return (
      <g
        className="season-sun"
        data-atmos={scene.id}
        transform={`translate(${anchor(scene.i, 1.35)},0)`}
      >
        <path
          className="season-sun-core j-print"
          d={blob(origin.x, origin.y, 64, 9, 0.03)}
          fill={tint}
        />
        <circle
          cx={origin.x}
          cy={origin.y}
          r="86"
          fill="none"
          stroke="var(--j-mid)"
          strokeWidth="1"
          strokeDasharray="2 7"
          opacity="0.6"
        />
      </g>
    );
  }

  return (
    <g
      data-atmos={scene.id}
      data-particle-scene={scene.i}
      ref={ref}
      transform={`translate(${anchor(scene.i, 1.35)},0)`}
    >
      {Array.from({ length: visualCount }).map((_, i) => {
        const x = origin.x + scatter(i, 1) * origin.spread;
        const y = origin.y - scatter(i, 2) * origin.rise;
        const size =
          kind === "snow" || kind === "dust"
            ? 1.4 + scatter(i, 3) * 1.4
            : 2 + scatter(i, 3) * (kind === "spark" ? 3 : 4);

        if (kind === "leaf") {
          return (
            <path
              key={i}
              className="season-particle season-leaf"
              d={`M ${x - size * 1.5} ${y} Q ${x} ${y - size * 1.8} ${x + size * 1.5} ${y} Q ${x} ${y + size * 1.8} ${x - size * 1.5} ${y} Z`}
              fill={tint}
            />
          );
        }

        if (kind === "blossom") {
          return (
            <g key={i} className="season-particle season-blossom" fill={tint}>
              <circle cx={x - size} cy={y} r={size} />
              <circle cx={x + size} cy={y} r={size} />
              <circle cx={x} cy={y - size} r={size} />
              <circle cx={x} cy={y + size} r={size} />
              <circle cx={x} cy={y} r={size * 0.5} fill="var(--j-mid)" />
            </g>
          );
        }

        return (
          <circle
            key={i}
            className={
              kind === "snow" ? "season-particle season-snow" : undefined
            }
            cx={x}
            cy={y}
            r={size}
            fill={tint}
          />
        );
      })}
    </g>
  );
}
