import { raster, PALETTE as P } from "./pixels";

// The setup wizard's three pictures, 40x48 pixels each, one per act of the
// career. Pixels tagged "spark" / "cursor" / "trail" blink in CSS.

const W = 40;
const H = 48;

function steel() {
  const r = raster(W, H);
  // Floor.
  r.rect(0, 42, W, 6, P.D).rect(0, 42, W, 1, P.d);
  // Mould: a box of sand with the pour hole glowing.
  r.rect(14, 32, 22, 10, P.R).frame(14, 32, 22, 10, P.k);
  r.rect(16, 34, 18, 1, P.o);
  r.rect(22, 32, 6, 2, P.O).rect(23, 32, 4, 1, P.y);
  // Ladle: tipped bucket, molten at the lip.
  r.rect(4, 12, 14, 12, P.D).frame(4, 12, 14, 12, P.k);
  r.rect(5, 13, 12, 2, P.O).rect(7, 13, 7, 1, P.y);
  r.line(17, 13, 21, 11, P.k).line(17, 14, 21, 12, P.d);
  r.rect(2, 16, 3, 2, P.d).line(0, 6, 5, 13, P.k).line(1, 6, 6, 13, P.d);
  // Stream.
  r.rect(21, 12, 2, 20, P.O).rect(22, 12, 1, 20, P.y);
  // Sparks.
  [
    [27, 27],
    [30, 24],
    [33, 29],
    [26, 22],
    [35, 25],
    [29, 30],
    [18, 27],
    [16, 23],
  ].forEach(([x, y], i) => r.px(x, y, i % 2 ? P.y : P.O, "spark"));
  return r.pixels();
}

function reset() {
  const r = raster(W, H);
  // Ground and a pole.
  r.rect(0, 42, W, 6, P.G).rect(0, 42, W, 1, P.k);
  r.rect(30, 14, 1, 28, P.d);
  // Sweden: blue field, yellow cross.
  r.rect(31, 14, 9, 7, P.b).rect(31, 17, 9, 1, P.y).rect(34, 14, 1, 7, P.y);
  // Suitcase.
  r.rect(4, 32, 16, 10, P.R).frame(4, 32, 16, 10, P.k).frame(9, 29, 6, 4, P.k);
  r.rect(4, 36, 16, 1, P.o);
  // A plane on its way north, and its dotted trail.
  r.rect(10, 8, 12, 2, P.w).frame(9, 7, 14, 4, P.k);
  r.rect(14, 4, 3, 3, P.w).frame(13, 3, 5, 4, P.k);
  r.rect(14, 11, 3, 3, P.w).frame(13, 10, 5, 4, P.k);
  r.rect(22, 8, 2, 2, P.B);
  r.rect(7, 6, 2, 2, P.w).frame(6, 5, 3, 4, P.k);
  for (let x = 0; x < 6; x += 2) r.px(x, 9 + (x % 4 ? 1 : 0), P.w, "trail");
  // Question marks of a reset.
  r.rect(22, 24, 4, 1, P.k).px(26, 25, P.k).px(26, 26, P.k).px(25, 27, P.k).px(24, 28, P.k).px(24, 30, P.k);
  return r.pixels();
}

function software() {
  const r = raster(W, H);
  // Desk.
  r.rect(0, 40, W, 8, P.R).rect(0, 40, W, 1, P.k);
  // Monitor.
  r.rect(5, 6, 30, 24, P.g).frame(5, 6, 30, 24, P.k);
  r.rect(8, 9, 24, 17, P.k);
  // Code.
  const lines = [
    [9, 10, 6, P.B],
    [16, 10, 5, P.w],
    [11, 12, 8, P.c],
    [11, 14, 5, P.O],
    [17, 14, 9, P.w],
    [13, 16, 10, P.G],
    [13, 18, 6, P.c],
    [11, 20, 4, P.O],
    [9, 22, 3, P.B],
  ];
  lines.forEach(([x, y, w, c]) => r.rect(x, y, w, 1, c));
  r.rect(13, 22, 2, 2, P.w, "cursor");
  r.px(31, 28, P.G);
  // Stand and keyboard.
  r.rect(17, 30, 6, 4, P.d).frame(13, 33, 14, 2, P.k);
  r.rect(4, 36, 32, 4, P.g).frame(4, 36, 32, 4, P.k);
  for (let x = 6; x < 34; x += 3) r.px(x, 37, P.d).px(x + 1, 38, P.d);
  // A plant, because every desk has one.
  r.rect(35, 34, 4, 6, P.o).frame(35, 34, 4, 6, P.k);
  r.px(36, 32, P.G).px(37, 31, P.G).px(38, 32, P.G).px(37, 33, P.G).px(35, 31, P.G);
  return r.pixels();
}

export const SCENES = { steel, reset, software };
export const SCENE_SIZE = { width: W, height: H };
