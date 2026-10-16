// A small generator for Swiss / Bauhaus poster compositions.
//
// Everything snaps to a module grid (U units), the way a Müller-Brockmann
// poster sits on its grid: one dominant circle, a counterweight of bars, a
// few quarter and half circles, a hairline and a field of dots. A seed fully
// determines the result, so a composition can be numbered and found again.

export const U = 100;

export function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const pick = (r, list) => list[Math.floor(r() * list.length)];
const int = (r, min, max) => min + Math.floor(r() * (max - min + 1));

/** Half disc of radius `rad` centred on (cx, cy), flat side facing `dir`. */
const half = (cx, cy, rad, dir) => {
  const [x1, y1, x2, y2] = {
    0: [cx - rad, cy, cx + rad, cy], // flat side down, bulge up
    1: [cx, cy - rad, cx, cy + rad], // bulge right
    2: [cx + rad, cy, cx - rad, cy], // bulge down
    3: [cx, cy + rad, cx, cy - rad], // bulge left
  }[dir];
  return `M${x1} ${y1} A${rad} ${rad} 0 0 1 ${x2} ${y2} Z`;
};

/** Quarter disc filling one module, the corner at `corner` (0-3, clockwise from top-left). */
const quarter = (x, y, s, corner) => {
  const c = [
    [x, y],
    [x + s, y],
    [x + s, y + s],
    [x, y + s],
  ][corner];
  const a = [
    [x + s, y],
    [x + s, y + s],
    [x, y + s],
    [x, y],
  ][corner];
  const b = [
    [x, y + s],
    [x, y],
    [x + s, y],
    [x + s, y + s],
  ][corner];
  return `M${c[0]} ${c[1]} L${a[0]} ${a[1]} A${s} ${s} 0 0 1 ${b[0]} ${b[1]} Z`;
};

export function compose(seed, cols = 6, rows = 8) {
  const r = rng(seed);
  const W = cols * U;
  const H = rows * U;
  const shapes = [];
  const add = (shape) => shapes.push({ ...shape, i: shapes.length });

  // Ground: one or two grey planes, always on the grid.
  const planes = int(r, 1, 2);
  for (let p = 0; p < planes; p++) {
    const w = int(r, 2, 4) * U;
    const h = int(r, 2, 4) * U;
    add({
      kind: "rect",
      x: int(r, 0, cols - w / U) * U,
      y: int(r, 0, rows - h / U) * U,
      w,
      h,
      tone: "grey",
    });
  }

  // The dominant circle.
  const rad = pick(r, [1.5, 2, 2, 2.5]) * U;
  add({
    kind: "circle",
    cx: int(r, 2, cols - 2) * U,
    cy: int(r, 2, rows - 3) * U,
    r: rad,
    tone: r() < 0.78 ? "red" : "ink",
  });

  // Half discs.
  for (let h = 0, n = int(r, 1, 2); h < n; h++) {
    add({
      kind: "path",
      d: half(int(r, 1, cols - 1) * U, int(r, 1, rows - 1) * U, pick(r, [1, 1, 2]) * U, int(r, 0, 3)),
      tone: pick(r, ["ink", "ink", "red", "grey"]),
    });
  }

  // Bars: the counterweight. Long, thin, strictly horizontal or vertical.
  for (let b = 0, n = int(r, 1, 3); b < n; b++) {
    const vertical = r() < 0.45;
    const len = int(r, 3, vertical ? rows - 1 : cols) * U;
    const thick = pick(r, [0.25, 0.25, 0.5, 1]) * U;
    add({
      kind: "rect",
      x: vertical ? int(r, 0, cols - 1) * U + (U - thick) * pick(r, [0, 0.5, 1]) : int(r, 0, cols - len / U) * U,
      y: vertical ? int(r, 0, rows - len / U) * U : int(r, 1, rows - 1) * U,
      w: vertical ? thick : len,
      h: vertical ? len : thick,
      tone: "ink",
    });
  }

  // Quarter discs.
  for (let q = 0, n = int(r, 2, 4); q < n; q++) {
    add({
      kind: "path",
      d: quarter(int(r, 0, cols - 1) * U, int(r, 0, rows - 1) * U, U, int(r, 0, 3)),
      tone: pick(r, ["ink", "red", "red", "grey"]),
    });
  }

  // A small square, the "full stop" of the poster.
  add({
    kind: "rect",
    x: int(r, 0, cols - 1) * U + U / 4,
    y: int(r, 0, rows - 1) * U + U / 4,
    w: U / 2,
    h: U / 2,
    tone: "red",
  });

  // A hairline running corner to corner.
  const fromLeft = r() < 0.5;
  add({
    kind: "line",
    x1: fromLeft ? 0 : W,
    y1: int(r, 0, 2) * U,
    x2: fromLeft ? W : 0,
    y2: int(r, rows - 3, rows) * U,
    tone: "ink",
  });

  // Field of dots in a 2x2 module block.
  const dx = int(r, 0, cols - 2) * U;
  const dy = int(r, 0, rows - 2) * U;
  const per = pick(r, [4, 5]);
  for (let i = 0; i < per; i++) {
    for (let j = 0; j < per; j++) {
      add({
        kind: "dot",
        cx: dx + (i + 0.5) * ((2 * U) / per),
        cy: dy + (j + 0.5) * ((2 * U) / per),
        r: U / 22,
        tone: "ink",
        quiet: true,
      });
    }
  }

  return { W, H, shapes };
}
