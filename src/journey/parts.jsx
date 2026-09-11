import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { SCENE_W, VIEW_H, anchor, OVERDRAW, FLOOR } from "./config";

/** Shared defs. Gradient stops read CSS vars, so heat recolours them for free. */
export function JourneyDefs() {
  return (
    <defs>
      <linearGradient id="jSky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="var(--j-sky0)" />
        <stop offset="100%" stopColor="var(--j-sky1)" />
      </linearGradient>
      <filter id="jGlow" x="-50%" y="-300%" width="200%" height="700%">
        <feGaussianBlur stdDeviation="16" />
      </filter>
      <filter id="jGlowSoft" x="-50%" y="-300%" width="200%" height="700%">
        <feGaussianBlur stdDeviation="5" />
      </filter>
      {/* Keeps the source crisp while laying a compact coloured halo behind
          it. Light mode opts into this where ordinary blur has too little
          contrast against the paper-like sky. */}
      <filter id="jAccentHalo" x="-80%" y="-100%" width="260%" height="300%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
        <feFlood floodColor="var(--j-accent)" floodOpacity="0.72" result="colour" />
        <feComposite in="colour" in2="blur" operator="in" result="halo" />
        <feMerge>
          <feMergeNode in="halo" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
  );
}

export function Sky() {
  return <rect x="0" y="0" width={SCENE_W} height={VIEW_H} fill="url(#jSky)" />;
}

/** A gently undulating path across the whole world strip. */
const wave = (span, y, amp, step, seed) => {
  let n = seed;
  const rnd = () => ((n = (n * 9301 + 49297) % 233280) / 233280);
  const pts = [`M ${-OVERDRAW} ${y}`];
  for (let x = -OVERDRAW + step; x <= span + OVERDRAW; x += step) {
    const cy = y + (rnd() - 0.5) * amp * 2;
    pts.push(`Q ${x - step / 2} ${cy} ${x} ${y + (rnd() - 0.5) * amp}`);
  }
  return pts.join(" ");
};

/**
 * The protagonist (D6), and the journey's progress indicator.
 *
 * It used to live inside the parallax world, but a world-anchored line always
 * spans the full frame no matter how much of it is drawn, so it could never
 * read as progress. It is screen-anchored instead: fixed width, starting at
 * the left, filling rightwards a beat at a time. Still one path, three
 * strokes — outer glow, body, hot core — and heat still drains the glow as
 * the journey cools, so molten steel visibly freezes into a solid rail.
 */
const PROGRESS_D =
  "M 8 34 C 180 34 260 20 430 26 S 720 44 900 30 S 1130 18 1292 28";

export function ProgressStream() {
  return (
    <svg
      className="j-progress"
      viewBox="0 0 1300 60"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <filter id="jProgGlow" x="-10%" y="-400%" width="120%" height="900%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
      </defs>
      <path
        data-stream
        d={PROGRESS_D}
        fill="none"
        stroke="var(--j-stream)"
        strokeWidth="14"
        strokeLinecap="round"
        filter="url(#jProgGlow)"
        style={{ opacity: "calc(0.25 + var(--jHeat) * 0.75)" }}
      />
      <path
        data-stream
        d={PROGRESS_D}
        fill="none"
        stroke="var(--j-stream)"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path
        data-stream
        d={PROGRESS_D}
        fill="none"
        stroke="var(--j-streamCore)"
        strokeWidth="2"
        strokeLinecap="round"
        style={{ opacity: "calc(0.45 + var(--jHeat) * 0.55)" }}
      />
    </svg>
  );
}

/** Continuous ground so scenes read as one connected world, not slides. */
export function Ground({ span = SCENE_W * 6 }) {
  const edge = wave(span, 896, 14, 620, 41);
  return (
    <g>
      <path
        d={`${edge} L ${span + OVERDRAW} ${FLOOR} L ${-OVERDRAW} ${FLOOR} Z`}
        fill="var(--j-ground)"
      />
      {/* rim light along the horizon, so the floor catches the stream's heat */}
      <path
        d={edge}
        fill="none"
        stroke="var(--j-accent)"
        strokeWidth="2.5"
        style={{ opacity: "calc(0.18 + var(--jHeat) * 0.3)" }}
      />
    </g>
  );
}

/**
 * Ambient particle field. Deliberately ~20 elements and driven by its own
 * looping tweens, not the main timeline — atmosphere should keep breathing
 * while the camera sits still.
 */
const PARTICLE = {
  // Screen-space position of the active foundry's tilted ladle mouth after
  // scene projection. Keeping this cluster tight makes the heat visibly come
  // from the vessel instead of bubbling up across the skyline.
  spark: { tint: "var(--j-streamCore)", x: 1408, y: 764, spread: 34, rise: 16 },
  dust: { tint: "#d9b382", x: 700, y: 700, spread: 1100, rise: 260 },
  snow: { tint: "var(--j-snow, #eaf2ff)", x: 0, y: 90, spread: 1800, rise: 300 },
  blossom: { tint: "var(--j-blossom, #f9a8d4)", x: 0, y: 120, spread: 1800, rise: 260 },
  leaf: { tint: "var(--j-leaf, #d97706)", x: 0, y: 110, spread: 1800, rise: 280 },
  sun: { tint: "var(--j-sun, #ffd166)", x: 1480, y: 174, spread: 0, rise: 0 },
};

// Stable pseudo-random placement: seasonal scenery should not jump when a
// parent rerenders (for example after switching theme).
const scatter = (i, salt = 0) => {
  const value = Math.sin((i + 1) * 12.9898 + salt * 78.233) * 43758.5453;
  return value - Math.floor(value);
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
    Array.from(dots).forEach((dot, i) => {
      const cfg = {
        spark: { y: -150 - scatter(i, 4) * 130, x: (scatter(i, 5) - 0.5) * 70, dur: 1.5 },
        dust: { y: (scatter(i, 6) - 0.5) * 60, x: 240 + scatter(i, 7) * 200, dur: 4.5 },
        snow: { y: 340 + scatter(i, 8) * 180, x: (scatter(i, 9) - 0.5) * 130, dur: 6 },
        blossom: { y: 300 + scatter(i, 10) * 170, x: (scatter(i, 11) - 0.5) * 220, rotation: 180, dur: 7 },
        leaf: { y: 310 + scatter(i, 12) * 190, x: (scatter(i, 13) - 0.5) * 280, rotation: 300, dur: 6.5 },
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
        }
      );
      if (scene.i !== 0) tween.pause(0);
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
        <circle cx={origin.x} cy={origin.y} r="78" fill={tint} filter="url(#jGlow)" opacity="0.2" />
        <circle className="season-sun-core" cx={origin.x} cy={origin.y} r="42" fill={tint} opacity="0.88" />
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
        const size = 2 + scatter(i, 3) * (kind === "spark" ? 3 : 4);

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
              <circle cx={x} cy={y} r={size * 0.55} fill="var(--j-blossom-core, #fbbf24)" />
            </g>
          );
        }

        return (
          <circle
            key={i}
            className={kind === "snow" ? "season-particle season-snow" : undefined}
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
