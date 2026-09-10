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
 * The protagonist (D6). One path, three strokes: outer glow, body, hot core.
 * The main timeline draws it progressively and heat drains its glow as the
 * journey cools — molten steel freezing into a solid rail.
 */
export function Stream({ span = SCENE_W * 6 }) {
  const d = wave(span, 818, 34, 460, 97);
  return (
    <g>
      <path
        data-stream
        d={d}
        fill="none"
        stroke="var(--j-stream)"
        strokeWidth="30"
        strokeLinecap="round"
        filter="url(#jGlow)"
        style={{ opacity: "calc(0.25 + var(--jHeat) * 0.75)" }}
      />
      <path
        data-stream
        d={d}
        fill="none"
        stroke="var(--j-stream)"
        strokeWidth="11"
        strokeLinecap="round"
        filter="url(#jGlowSoft)"
      />
      <path
        data-stream
        d={d}
        fill="none"
        stroke="var(--j-streamCore)"
        strokeWidth="4"
        strokeLinecap="round"
        style={{ opacity: "calc(0.45 + var(--jHeat) * 0.55)" }}
      />
    </g>
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
export function Particles({ scene, kind, count = 22 }) {
  const ref = useRef(null);

  useEffect(() => {
    const dots = ref.current?.children;
    if (!dots) return;
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

  const tint = {
    spark: "var(--j-streamCore)",
    dust: "#d9b382",
    snow: "#eaf2ff",
  }[kind];

  // A beat's particles are only visible at that beat, where its layer offset
  // and its anchor cancel out — so these are effectively screen coordinates.
  const origin = {
    spark: { x: 1500, y: 812, spread: 220, rise: 40 }, // rising off the ladle
    dust: { x: 700, y: 700, spread: 1100, rise: 260 },
    snow: { x: 0, y: 90, spread: 1800, rise: 300 },
  }[kind];

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
