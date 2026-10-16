import React, { useMemo } from "react";
import { compose, U } from "./compose";
import "../styles/art.css";

/**
 * A numbered poster composition. The seed is the poster's number: the same
 * number always draws the same picture. Shapes are keyed by seed, so a new
 * number remounts them and they build in again one by one.
 */
export default function Composition({ seed, cols = 6, rows = 8, className = "", showGrid = true }) {
  const { W, H, shapes } = useMemo(() => compose(seed, cols, rows), [seed, cols, rows]);

  return (
    <svg
      className={`composition ${className}`.trim()}
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label={`Composition number ${seed}: circles, bars and dots on a ${cols} by ${rows} grid`}
    >
      {showGrid && (
        <g className="composition-grid" aria-hidden="true">
          {Array.from({ length: cols + 1 }, (_, i) => (
            <line key={`v${i}`} x1={i * U} y1={0} x2={i * U} y2={H} />
          ))}
          {Array.from({ length: rows + 1 }, (_, i) => (
            <line key={`h${i}`} x1={0} y1={i * U} x2={W} y2={i * U} />
          ))}
        </g>
      )}
      <g key={seed}>
        {shapes.map((s) => {
          const props = {
            key: s.i,
            className: `shape tone-${s.tone}${s.quiet ? " quiet" : ""}`,
            style: { "--i": s.i },
          };
          switch (s.kind) {
            case "circle":
            case "dot":
              return <circle {...props} cx={s.cx} cy={s.cy} r={s.r} />;
            case "rect":
              return <rect {...props} x={s.x} y={s.y} width={s.w} height={s.h} />;
            case "line":
              return <line {...props} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} />;
            default:
              return <path {...props} d={s.d} />;
          }
        })}
      </g>
    </svg>
  );
}
