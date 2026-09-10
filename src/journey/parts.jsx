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
  spark: { tint: "var(--j-streamCore)", x: 1500, y: 812, spread: 220, rise: 40 },
  dust: { tint: "#d9b382", x: 700, y: 700, spread: 1100, rise: 260 },
  snow: { tint: "#eaf2ff", x: 0, y: 90, spread: 1800, rise: 300 },
};

export function Particles({ scene, kind, count = 22 }) {
  const ref = useRef(null);

  useEffect(() => {
    const dots = ref.current?.children;
    if (!dots || !PARTICLE[kind]) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const tweens = [];
    Array.from(dots).forEach((dot, i) => {
      const cfg = {
        spark: { y: -260 - Math.random() * 200, x: (Math.random() - 0.5) * 90, dur: 1.6 },
        dust: { y: (Math.random() - 0.5) * 60, x: 240 + Math.random() * 200, dur: 4.5 },
        snow: { y: 340 + Math.random() * 180, x: (Math.random() - 0.5) * 130, dur: 6 },
      }[kind];
      tweens.push(
        gsap.fromTo(
          dot,
          { y: 0, x: 0, opacity: 0 },
          {
            y: cfg.y,
            x: cfg.x,
            opacity: 0,
            keyframes: { opacity: [0, 0.9, 0.9, 0] },
            duration: cfg.dur + Math.random() * cfg.dur * 0.5,
            delay: (i / count) * cfg.dur,
            repeat: -1,
            ease: kind === "spark" ? "power2.out" : "none",
          }
        )
      );
    });
    return () => tweens.forEach((t) => t.kill());
  }, [kind, count]);

  // A beat's particles are only visible at that beat, where its layer offset
  // and its anchor cancel out — so these are effectively screen coordinates.
  // A beat with no kind simply has no weather.
  const origin = PARTICLE[kind];
  if (!origin) return null;
  const { tint } = origin;

  return (
    <g data-atmos={scene.id} ref={ref} transform={`translate(${anchor(scene.i, 1.35)},0)`}>
      {Array.from({ length: count }).map((_, i) => (
        <circle
          key={i}
          cx={origin.x + Math.random() * origin.spread}
          cy={origin.y - Math.random() * origin.rise}
          r={kind === "spark" ? 2 + Math.random() * 3 : 2 + Math.random() * 4}
          fill={tint}
        />
      ))}
    </g>
  );
}
