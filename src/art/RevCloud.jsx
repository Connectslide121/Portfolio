import React, { useLayoutEffect, useRef, useState } from "react";
import "../styles/art.css";

/**
 * A revision cloud: the scalloped red loop a checker draws around whatever
 * changed. It measures what it wraps and draws its arcs to fit, with an
 * optional delta tag hanging off the corner.
 */
function cloud(w, h, pad = 10, arc = 18) {
  const x0 = -pad;
  const y0 = -pad;
  const x1 = w + pad;
  const y1 = h + pad;
  const side = (ax, ay, bx, by) => {
    const len = Math.hypot(bx - ax, by - ay);
    const n = Math.max(1, Math.round(len / arc));
    let d = "";
    for (let i = 1; i <= n; i++) {
      const px = ax + ((bx - ax) * i) / n;
      const py = ay + ((by - ay) * i) / n;
      const r = len / n / 2 + 1;
      d += ` A${r.toFixed(1)} ${r.toFixed(1)} 0 0 1 ${px.toFixed(1)} ${py.toFixed(1)}`;
    }
    return d;
  };
  return `M${x0} ${y0}${side(x0, y0, x1, y0)}${side(x1, y0, x1, y1)}${side(x1, y1, x0, y1)}${side(x0, y1, x0, y0)}`;
}

export default function RevCloud({ children, tag, className = "" }) {
  const ref = useRef(null);
  const [size, setSize] = useState(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => setSize({ w: el.offsetWidth, h: el.offsetHeight });
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <span className={`rev-cloud ${className}`.trim()} ref={ref}>
      {children}
      {size && (
        <svg className="rev-cloud-svg" aria-hidden="true" style={{ "--w": `${size.w}px`, "--h": `${size.h}px` }}>
          <path d={cloud(size.w, size.h)} transform="translate(24 24)" pathLength="1" />
        </svg>
      )}
      {tag && (
        <span className="rev-tag" aria-hidden="true">
          {tag}
        </span>
      )}
    </span>
  );
}
