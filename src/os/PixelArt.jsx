import React from "react";
import { icon } from "./icons";

/** Renders a list of pixels as crisp SVG rects. */
export default function PixelArt({ pixels, size = 16, width, height, scale = 2, className = "", label }) {
  const w = width || size;
  const h = height || size;
  return (
    <svg
      className={`pixel-art ${className}`.trim()}
      viewBox={`0 0 ${w} ${h}`}
      width={w * scale}
      height={h * scale}
      shapeRendering="crispEdges"
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      {pixels.map((p, i) => (
        <rect key={i} x={p.x} y={p.y} width="1" height="1" fill={p.c} className={p.tag || undefined} />
      ))}
    </svg>
  );
}

export function Icon({ name, scale = 2, className, label }) {
  return <PixelArt pixels={icon(name)} scale={scale} className={className} label={label} />;
}
