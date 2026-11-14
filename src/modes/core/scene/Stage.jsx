import React, { useEffect, useRef, useState } from "react";
import { gsap } from "../motion";
import { reducedMotion, useDarkTheme } from "../components/hooks";
import { products } from "../../../data/products";
import stillDark from "../../../images/core/system-dark.webp";
import stillLight from "../../../images/core/system-light.webp";

// The live system needs motion allowed, no data saving asked for and a WebGL
// context. Phones get it too, lighter (no glow, fewer pixels).
function canRunLive() {
  if (reducedMotion() || navigator.connection?.saveData) return false;
  try {
    const probe = document.createElement("canvas");
    return Boolean(probe.getContext("webgl2") || probe.getContext("webgl"));
  } catch {
    return false;
  }
}

/**
 * The stage behind the hero and the layers: a screen-high box that stays put
 * (sticky) while the two sections scroll over it. Live, it is the three.js
 * system, assembling on arrival; otherwise a still of the same scene. The
 * product labels follow their nodes. `state` is shared with the sections,
 * which tween its assemble, explode and focus.
 */
export default function Stage({ state, children }) {
  const dark = useDarkTheme();
  const [live] = useState(canRunLive);
  const [ready, setReady] = useState(false);
  const [hover, setHover] = useState(-1);
  const canvas = useRef(null);
  const labels = useRef([]);
  const running = useRef(null);

  useEffect(() => {
    if (!live) return undefined;
    let cancelled = false;
    const lite = !window.matchMedia("(min-width: 900px)").matches;
    import("./live").then(({ startCore }) => {
      if (cancelled || !canvas.current) return;
      running.current = startCore({
        canvas: canvas.current,
        state,
        dark: document.body.classList.contains("dark-theme"),
        light: lite,
        onHover: setHover,
        onPick: (i) => document.getElementById(`product-${products[i].id}`)?.scrollIntoView({ behavior: "smooth", block: "center" }),
        onLabels: (places) => {
          places.forEach((p, i) => {
            const el = labels.current[i];
            if (el) el.style.transform = `translate3d(${p.x.toFixed(1)}px, ${p.y.toFixed(1)}px, 0)`;
          });
        },
        onFirstFrame: () => {
          setReady(true);
          // The system assembles from scattered points.
          gsap.to(state, { assemble: 1, duration: 2.6, ease: "power3.out", delay: 0.15 });
        },
      });
    });
    return () => {
      cancelled = true;
      running.current?.stop();
      running.current = null;
    };
  }, [live, state]);

  useEffect(() => {
    running.current?.setDark(dark);
  }, [dark]);

  return (
    <div className={`stage${live ? " is-live" : " is-still"}${ready ? " is-ready" : ""}`}>
      <div className="stage-pin">
        {live ? (
          <canvas ref={canvas} className="stage-canvas" aria-hidden="true" />
        ) : (
          <img className="stage-still" src={dark ? stillDark : stillLight} width="1600" height="900" alt="" />
        )}
        {live && (
          <div className="stage-labels" aria-hidden="true">
            {products.map((p, i) => (
              <span key={p.id} ref={(el) => (labels.current[i] = el)} className={`stage-label${hover === i ? " is-hover" : ""}${hover >= 0 && hover !== i ? " is-dim" : ""}`}>
                <b>{p.name}</b>
                <small>{p.kind}</small>
              </span>
            ))}
          </div>
        )}
      </div>
      {children}
    </div>
  );
}
