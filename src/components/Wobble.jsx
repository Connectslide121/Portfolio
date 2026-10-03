import React, { useEffect, useRef } from "react";

/**
 * Italic type that is not quite still.
 *
 * Every so often — on an irregular clock, never a metronome — the letters do
 * one small thing and settle back, the way loose metal type shifts in a
 * forme. Three moves, picked at random each time so it never reads as a
 * loop:
 *
 *   ripple  a soft wave runs through the word, letter by letter
 *   loose   one or two letters tip on their own, as if knocked
 *   lean    the whole word leans a degree or two and springs back
 *
 * Motion lives in CSS (.wobble in styles.css) and only the per-letter
 * targets are written from here, so a beat costs one class toggle. It
 * skips a turn while the text is hidden (an inactive journey card, a
 * background tab) and never starts under prefers-reduced-motion.
 *
 * The visible letters are aria-hidden and a plain copy is kept for assistive
 * tech, since a word split into spans is read out letter by letter.
 */

const rand = (min, max) => min + Math.random() * (max - min);

const visible = (el) => {
  if (document.hidden || !el.isConnected) return false;
  if (el.checkVisibility) {
    return el.checkVisibility({ opacityProperty: true, visibilityProperty: true });
  }
  return el.offsetParent !== null;
};

export default function Wobble({ children, as: Tag = "em", className = "" }) {
  const text = String(children);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const letters = Array.from(el.querySelectorAll(".wb-l"));
    if (!letters.length) return;
    let timer = 0;

    const play = () => {
      if (visible(el)) {
        const move = Math.random();
        const loose = new Set();
        if (move >= 0.45 && move < 0.8) {
          loose.add(Math.floor(Math.random() * letters.length));
          if (Math.random() < 0.4) loose.add(Math.floor(Math.random() * letters.length));
        }
        const lean = rand(-3.2, 3.2);

        letters.forEach((l, i) => {
          let r = 0;
          let y = 0;
          let delay = 0;
          if (move < 0.45) {
            // ripple
            r = rand(-4, 4);
            y = rand(-0.07, 0.04);
            delay = i * 38;
          } else if (move < 0.8) {
            // loose
            if (loose.has(i)) {
              r = rand(5, 10) * (Math.random() < 0.5 ? -1 : 1);
              y = rand(-0.08, 0.02);
            }
          } else {
            // lean
            r = lean;
            y = -0.02;
            delay = i * 12;
          }
          l.style.setProperty("--wr", `${r.toFixed(2)}deg`);
          l.style.setProperty("--wy", `${y.toFixed(3)}em`);
          l.style.setProperty("--wd", `${delay}ms`);
        });

        el.classList.remove("is-wobbling");
        // Restart the animation even if the last one has not finished.
        void el.offsetWidth;
        el.classList.add("is-wobbling");
      }
      timer = window.setTimeout(play, rand(3800, 9500));
    };

    timer = window.setTimeout(play, rand(1400, 4200));
    return () => window.clearTimeout(timer);
  }, [text]);

  const words = text.split(" ");
  return (
    <Tag className={`wobble ${className}`.trim()} ref={ref}>
      <span className="wb-sr">{text}</span>
      {words.map((word, wi) => (
        <React.Fragment key={wi}>
          <span className="wb-w" aria-hidden="true">
            {Array.from(word).map((c, ci) => (
              <span className="wb-l" key={ci}>
                {c}
              </span>
            ))}
          </span>
          {wi < words.length - 1 ? " " : null}
        </React.Fragment>
      ))}
    </Tag>
  );
}
