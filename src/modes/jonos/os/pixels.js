// Pixel art, two ways.
//
// Icons are drawn by hand as 16x16 character maps (one character per pixel,
// "." for transparent). Scenes for the setup wizard are rasterised from a
// few drawing operations onto a small grid. Either way the result is a list
// of pixels, which PixelArt renders as crisp SVG rects.

export const PALETTE = {
  k: "#000000",
  w: "#ffffff",
  g: "#c0c0c0",
  d: "#808080",
  D: "#404040",
  y: "#ffd800",
  Y: "#f6d26b",
  o: "#c89a3a",
  O: "#ff8a1f",
  r: "#e3262b",
  R: "#7a3b1e",
  b: "#1d3fd1",
  B: "#4f9df5",
  n: "#000080",
  G: "#1ea446",
  c: "#14c1c8",
  s: "#d8b48a",
  p: "#9d4edd",
};

/** Character map -> [{x, y, c}]. Rows are padded / cut to the width. */
export function fromMap(rows, size = 16) {
  const px = [];
  rows.forEach((row, y) => {
    const line = row.padEnd(size, ".").slice(0, size);
    for (let x = 0; x < size; x++) {
      const ch = line[x];
      if (ch !== "." && PALETTE[ch]) px.push({ x, y, c: PALETTE[ch], k: ch });
    }
  });
  return px;
}

/** A tiny raster canvas for building scenes from shapes. */
export function raster(w, h) {
  const grid = Array.from({ length: h }, () => Array(w).fill(null));
  const tags = Array.from({ length: h }, () => Array(w).fill(null));
  const set = (x, y, c, tag = null) => {
    x = Math.round(x);
    y = Math.round(y);
    if (x < 0 || y < 0 || x >= w || y >= h) return;
    grid[y][x] = c;
    tags[y][x] = tag;
  };
  const api = {
    px(x, y, c, tag) {
      set(x, y, c, tag);
      return api;
    },
    rect(x, y, rw, rh, c, tag) {
      for (let j = 0; j < rh; j++) for (let i = 0; i < rw; i++) set(x + i, y + j, c, tag);
      return api;
    },
    frame(x, y, rw, rh, c) {
      for (let i = 0; i < rw; i++) {
        set(x + i, y, c);
        set(x + i, y + rh - 1, c);
      }
      for (let j = 0; j < rh; j++) {
        set(x, y + j, c);
        set(x + rw - 1, y + j, c);
      }
      return api;
    },
    disc(cx, cy, r, c, tag) {
      for (let y = Math.floor(cy - r); y <= cy + r; y++)
        for (let x = Math.floor(cx - r); x <= cx + r; x++)
          if ((x - cx) ** 2 + (y - cy) ** 2 <= r * r + 0.3) set(x, y, c, tag);
      return api;
    },
    line(x0, y0, x1, y1, c, tag) {
      const dx = Math.abs(x1 - x0);
      const dy = -Math.abs(y1 - y0);
      const sx = x0 < x1 ? 1 : -1;
      const sy = y0 < y1 ? 1 : -1;
      let err = dx + dy;
      for (;;) {
        set(x0, y0, c, tag);
        if (x0 === x1 && y0 === y1) break;
        const e2 = 2 * err;
        if (e2 >= dy) {
          err += dy;
          x0 += sx;
        }
        if (e2 <= dx) {
          err += dx;
          y0 += sy;
        }
      }
      return api;
    },
    pixels() {
      const out = [];
      for (let y = 0; y < h; y++)
        for (let x = 0; x < w; x++) if (grid[y][x]) out.push({ x, y, c: grid[y][x], tag: tags[y][x] });
      return out;
    },
  };
  return api;
}
