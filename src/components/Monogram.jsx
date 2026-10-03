import React from "react";
import Wobble from "./Wobble";
import "../styles/monogram.css";

/**
 * The JM mark, set rather than drawn: an italic J leaning into an upright M
 * in the site's serif, over a coral plate printed slightly out of register.
 *
 * Type, not an image, so it follows the theme (ink on paper, paper on ink)
 * without a second asset or an invert filter, and scales with `size` (any
 * CSS length, or set --mono from a class — it is the font size the whole
 * mark is built from; 2.4rem by default). The J is
 * the italic half, so it wobbles now and then like every other italic on the
 * site.
 */
export default function Monogram({ size, className = "" }) {
  return (
    <span
      className={`monogram ${className}`.trim()}
      // Only when asked: a class can set --mono too, and an inline value
      // would always win over it.
      style={size ? { "--mono": size } : undefined}
      role="img"
      aria-label="Jon Mendizabal"
    >
      <span className="monogram-plate" aria-hidden="true" />
      <span className="monogram-letters" aria-hidden="true">
        <Wobble className="monogram-j">J</Wobble>
        <span className="monogram-m">M</span>
      </span>
    </span>
  );
}
