// Isometric projection helpers for the exploded drawings.
//
// World axes: x runs down-right, y runs down-left, z runs up. The front
// corner of a w-by-w plate is (w, w), so the two visible sides are the
// x = w face (right) and the y = w face (left).

const C = Math.cos(Math.PI / 6);
const S = 0.5;

export const iso = (x, y, z = 0) => [(x - y) * C, (x + y) * S - z];

export const pts = (list) =>
  list
    .map(([x, y, z]) => iso(x, y, z))
    .map(([a, b]) => `${a.toFixed(1)},${b.toFixed(1)}`)
    .join(" ");

/** A box from (x, y, z) with size (w, d, h): top, left and right faces. */
export function box(x, y, z, w, d, h) {
  return {
    top: pts([
      [x, y, z + h],
      [x + w, y, z + h],
      [x + w, y + d, z + h],
      [x, y + d, z + h],
    ]),
    left: pts([
      [x, y + d, z],
      [x + w, y + d, z],
      [x + w, y + d, z + h],
      [x, y + d, z + h],
    ]),
    right: pts([
      [x + w, y, z],
      [x + w, y + d, z],
      [x + w, y + d, z + h],
      [x + w, y, z + h],
    ]),
  };
}

/** A horizontal circle of radius r at (x, y, z), as an axis-aligned ellipse. */
export function disc(x, y, z, r) {
  const [cx, cy] = iso(x, y, z);
  return { cx, cy, rx: r * Math.SQRT2 * C, ry: r * Math.SQRT2 * S };
}
