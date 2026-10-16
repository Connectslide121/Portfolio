import { T, TILE, W, H, BUILDINGS, SIGNS } from "./map";
import { rng } from "./rng";

/**
 * Everything is drawn in code at 16 px per tile, crisp, then scaled up by
 * the camera. The ground and the buildings are painted once into an
 * offscreen canvas per water frame; sprites are drawn every frame on top.
 */

const px = (ctx, x, y, w, h, c) => {
  ctx.fillStyle = c;
  ctx.fillRect(x, y, w, h);
};

const GROUND = {
  [T.GRASS]: ["#5fae4b", "#529c40", "#73c25c"],
  [T.FLOWER]: ["#5fae4b", "#529c40", "#73c25c"],
  [T.TREE]: ["#5fae4b", "#529c40", "#73c25c"],
  [T.ROCK]: null, // takes the ground of its region, see below
  [T.SAND]: ["#e9cf8a", "#dcbd72", "#f3dea3"],
  [T.PALM]: ["#e9cf8a", "#dcbd72", "#f3dea3"],
  [T.CACTUS]: ["#e9cf8a", "#dcbd72", "#f3dea3"],
  [T.SNOW]: ["#dbe8e4", "#c9dbd6", "#f3f8f6"],
  [T.PINE]: ["#dbe8e4", "#c9dbd6", "#f3f8f6"],
  [T.LAMP]: ["#dbe8e4", "#c9dbd6", "#f3f8f6"],
};

function ground(ctx, x, y, colours, seed) {
  const r = rng(seed);
  px(ctx, x, y, TILE, TILE, colours[0]);
  for (let i = 0; i < 7; i++) px(ctx, x + Math.floor(r() * 15), y + Math.floor(r() * 15), 1, 1, colours[1]);
  for (let i = 0; i < 4; i++) px(ctx, x + Math.floor(r() * 15), y + Math.floor(r() * 15), 1, 1, colours[2]);
}

function water(ctx, x, y, frame, seed) {
  px(ctx, x, y, TILE, TILE, "#3d7fd6");
  const r = rng(seed);
  for (let i = 0; i < 3; i++) {
    const wx = x + Math.floor(r() * 12);
    const wy = y + Math.floor(r() * 14);
    px(ctx, wx + (frame ? 2 : 0), wy, 3, 1, "#7fb4f0");
  }
  px(ctx, x, y + (frame ? 4 : 10), 1, 1, "#9cc8f6");
}

function road(ctx, x, y, seed, stone) {
  const r = rng(seed);
  px(ctx, x, y, TILE, TILE, stone ? "#a9aab3" : "#c9a46b");
  if (stone) {
    for (let j = 0; j < 4; j++) for (let i = 0; i < 4; i++) px(ctx, x + i * 4 + (j % 2) * 2, y + j * 4, 3, 3, (i + j) % 3 ? "#b8b9c2" : "#9c9da6");
  } else {
    for (let i = 0; i < 6; i++) px(ctx, x + Math.floor(r() * 15), y + Math.floor(r() * 15), 2, 1, "#b48f58");
  }
}

function bridge(ctx, x, y, frame, seed) {
  water(ctx, x, y, frame, seed);
  px(ctx, x, y + 2, TILE, 12, "#9a6a3c");
  for (let i = 0; i < 4; i++) px(ctx, x + i * 4, y + 2, 1, 12, "#7a4f2a");
  px(ctx, x, y + 1, TILE, 2, "#5e3c1e");
  px(ctx, x, y + 13, TILE, 2, "#5e3c1e");
}

function tree(ctx, x, y) {
  px(ctx, x + 7, y + 10, 3, 5, "#6b4423");
  px(ctx, x + 2, y + 2, 12, 9, "#2f7d32");
  px(ctx, x + 3, y + 1, 10, 11, "#2f7d32");
  px(ctx, x + 4, y + 2, 5, 3, "#4caf50");
  px(ctx, x + 2, y + 9, 12, 2, "#256628");
}

function palm(ctx, x, y) {
  px(ctx, x + 7, y + 5, 2, 10, "#8d6236");
  px(ctx, x + 2, y + 3, 12, 2, "#3f9b3c");
  px(ctx, x + 1, y + 5, 4, 2, "#3f9b3c");
  px(ctx, x + 11, y + 5, 4, 2, "#3f9b3c");
  px(ctx, x + 5, y + 1, 6, 2, "#5cbf4f");
  px(ctx, x + 6, y + 6, 2, 2, "#6b4423");
}

function pine(ctx, x, y) {
  px(ctx, x + 7, y + 12, 2, 3, "#6b4423");
  for (let i = 0; i < 4; i++) px(ctx, x + 6 - i, y + 2 + i * 3, 4 + i * 2, 3, "#1f5f3a");
  px(ctx, x + 7, y + 1, 2, 2, "#1f5f3a");
  px(ctx, x + 6, y + 3, 2, 1, "#ffffff");
  px(ctx, x + 4, y + 9, 3, 1, "#ffffff");
  px(ctx, x + 9, y + 6, 2, 1, "#ffffff");
}

function rock(ctx, x, y) {
  px(ctx, x + 3, y + 7, 10, 6, "#8a8f98");
  px(ctx, x + 4, y + 6, 7, 2, "#a6abb4");
  px(ctx, x + 3, y + 12, 10, 1, "#5f646c");
}

function cactus(ctx, x, y) {
  px(ctx, x + 7, y + 3, 3, 11, "#3c8f3a");
  px(ctx, x + 4, y + 6, 3, 2, "#3c8f3a");
  px(ctx, x + 4, y + 4, 2, 3, "#3c8f3a");
  px(ctx, x + 10, y + 8, 3, 2, "#3c8f3a");
  px(ctx, x + 11, y + 5, 2, 4, "#3c8f3a");
}

function flower(ctx, x, y, seed) {
  const r = rng(seed);
  const colours = ["#ffd23f", "#ff6fb5", "#ffffff", "#b28cff"];
  for (let i = 0; i < 3; i++) {
    const fx = x + 2 + Math.floor(r() * 11);
    const fy = y + 2 + Math.floor(r() * 11);
    px(ctx, fx, fy, 2, 2, colours[Math.floor(r() * colours.length)]);
    px(ctx, fx, fy + 2, 1, 1, "#2f7d32");
  }
}

function lamp(ctx, x, y) {
  px(ctx, x + 7, y + 4, 2, 11, "#33363d");
  px(ctx, x + 5, y + 2, 6, 3, "#33363d");
  px(ctx, x + 6, y + 3, 4, 2, "#ffe7a3");
  px(ctx, x + 5, y + 14, 6, 2, "#33363d");
}

// --- Buildings ------------------------------------------------------------

const STYLE = {
  uni: { wall: "#b5533c", trim: "#e7d7c1", roof: "#3b3f5c", door: "#5a3420", window: "#bfe1ff" },
  foundry: { wall: "#4a4a52", trim: "#2b2b30", roof: "#2b2b30", door: "#ff8a1f", window: "#ffb35a" },
  lea: { wall: "#e6d3ad", trim: "#ffffff", roof: "#2f6bd6", door: "#5a3420", window: "#bfe1ff" },
  plant: { wall: "#d9b77a", trim: "#f4e1b5", roof: "#b35c3c", door: "#6b3b24", window: "#ffe2a6" },
  lexicon: { wall: "#a8322d", trim: "#ffffff", roof: "#2b2b33", door: "#ffffff", window: "#bfe1ff" },
  sprinta: { wall: "#2d3b55", trim: "#cfe3ff", roof: "#1b2335", door: "#7fe3ff", window: "#7fe3ff" },
  workshop: { wall: "#8a5a34", trim: "#c99a62", roof: "#5a3420", door: "#3b2414", window: "#ffe2a6" },
  arcade: { wall: "#5b2a86", trim: "#ff6fb5", roof: "#2a1240", door: "#ff6fb5", window: "#ffd23f" },
  post: { wall: "#2f6bd6", trim: "#ffffff", roof: "#c23a2c", door: "#ffd23f", window: "#bfe1ff" },
};

function building(ctx, b) {
  const s = STYLE[b.style];
  const x = b.x * TILE;
  const y = b.y * TILE;
  const w = b.w * TILE;
  const h = b.h * TILE;
  const roofH = Math.round(h * 0.42);
  // Shadow, walls, roof.
  px(ctx, x + 2, y + 3, w, h, "rgba(0,0,0,0.25)");
  px(ctx, x, y + roofH, w, h - roofH, s.wall);
  px(ctx, x - 1, y, w + 2, roofH, s.roof);
  px(ctx, x - 1, y + roofH - 2, w + 2, 2, s.trim);
  for (let i = 0; i < w; i += 4) px(ctx, x + i, y + 2, 2, roofH - 5, "rgba(255,255,255,0.06)");

  // Windows along the wall.
  const wy = y + roofH + 5;
  for (let i = 6; i < w - 8; i += 12) {
    px(ctx, x + i, wy, 7, 6, s.trim);
    px(ctx, x + i + 1, wy + 1, 5, 4, s.window);
  }

  // Door: on the bottom wall, or the top wall for buildings below the road.
  const [dx, dy] = b.door;
  const doorX = dx * TILE + 3;
  const top = dy === b.y;
  const doorY = top ? y + roofH + 2 : (dy + 1) * TILE - 11;
  px(ctx, doorX - 1, doorY - 1, 12, 12, s.trim);
  px(ctx, doorX, doorY, 10, 11, s.door);
  px(ctx, doorX + 7, doorY + 5, 1, 1, "#111");

  // Character pieces.
  if (b.style === "foundry" || b.style === "plant") {
    px(ctx, x + w - 14, y - 14, 8, roofH + 10, "#3a3a40");
    px(ctx, x + w - 15, y - 15, 10, 3, "#222226");
  }
  if (b.style === "uni") {
    for (let i = 4; i < w - 2; i += 8) px(ctx, x + i, y + roofH, 3, h - roofH, "#e7d7c1");
    px(ctx, x + w / 2 - 6, y - 4, 12, 6, s.roof);
  }
  if (b.style === "sprinta") {
    for (let j = 0; j < 2; j++) for (let i = 4; i < w - 4; i += 6) px(ctx, x + i, y + 4 + j * 7, 4, 4, "#355580");
    px(ctx, x + w - 8, y - 8, 1, 8, "#cfe3ff");
    px(ctx, x + w - 9, y - 9, 3, 2, "#ff6fb5");
  }
  if (b.style === "arcade") {
    px(ctx, x + 4, y + 4, w - 8, 8, "#1a0b2b");
  }
  if (b.style === "post") {
    px(ctx, x + w - 10, y + h - 12, 6, 8, "#c23a2c");
    px(ctx, x + w - 9, y + h - 11, 4, 1, "#111");
  }
  if (b.style === "workshop") {
    px(ctx, x + 6, y + 6, 12, 3, "#c9c9cf");
    px(ctx, x + 9, y + 9, 6, 3, "#9a9aa3");
  }

  // Name board over the roof edge.
  ctx.font = "6px 'Press Start 2P', monospace";
  ctx.textBaseline = "top";
  const label = b.name.toUpperCase();
  const tw = Math.ceil(ctx.measureText(label).width) + 6;
  const lx = Math.round(x + w / 2 - tw / 2);
  const ly = y + roofH - 12;
  px(ctx, lx, ly, tw, 10, "#111");
  ctx.fillStyle = b.style === "arcade" ? "#ff6fb5" : "#ffffff";
  ctx.fillText(label, lx + 3, ly + 2);
}

function sign(ctx, s) {
  const x = s.x * TILE;
  const y = s.y * TILE;
  px(ctx, x + 7, y + 8, 2, 7, "#6b4423");
  px(ctx, x + 2, y + 2, 12, 8, "#9a6a3c");
  px(ctx, x + 3, y + 3, 10, 6, "#c99a62");
  px(ctx, x + 4, y + 4, 8, 1, "#6b4423");
  px(ctx, x + 4, y + 6, 6, 1, "#6b4423");
}

/** Paints the whole world for one water frame. */
export function paintWorld(grid, frame) {
  const canvas = document.createElement("canvas");
  canvas.width = W * TILE;
  canvas.height = H * TILE;
  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = false;

  const groundOf = (x) => (x < 16 ? GROUND[T.GRASS] : x < 28 ? GROUND[T.SAND] : GROUND[T.SNOW]);

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const t = grid[y][x];
      const X = x * TILE;
      const Y = y * TILE;
      const seed = y * 977 + x * 131;
      if (t === T.WATER) water(ctx, X, Y, frame, seed);
      else if (t === T.BRIDGE) bridge(ctx, X, Y, frame, seed);
      else if (t === T.ROAD) road(ctx, X, Y, seed, false);
      else if (t === T.STONE) road(ctx, X, Y, seed, true);
      else ground(ctx, X, Y, GROUND[t] || groundOf(x), seed);

      if (t === T.TREE) tree(ctx, X, Y);
      else if (t === T.PALM) palm(ctx, X, Y);
      else if (t === T.PINE) pine(ctx, X, Y);
      else if (t === T.ROCK) rock(ctx, X, Y);
      else if (t === T.CACTUS) cactus(ctx, X, Y);
      else if (t === T.FLOWER) flower(ctx, X, Y, seed);
      else if (t === T.LAMP) lamp(ctx, X, Y);
    }
  }
  for (const s of SIGNS) sign(ctx, s);
  for (const b of BUILDINGS) building(ctx, b);
  return canvas;
}

// --- Characters ----------------------------------------------------------

/**
 * A little person, 16 x 16. `look` picks the outfit; `hat` is the yellow
 * hard hat of the foundry years or the beanie of a Swedish winter.
 */
export function person(ctx, x, y, dir, step, look) {
  const { shirt = "#2f6bd6", hair = "#3b2a1f", skin = "#f1c27d", pants = "#2b2b40", hat = null } = look;
  const bob = step ? 1 : 0;
  // Shadow.
  ctx.fillStyle = "rgba(0,0,0,0.25)";
  ctx.fillRect(x + 3, y + 14, 10, 2);
  // Legs.
  const legL = dir === "left" || dir === "right" ? (step ? 1 : -1) : step ? 1 : 0;
  px(ctx, x + 5, y + 11, 2, 4 - (legL > 0 ? 1 : 0), pants);
  px(ctx, x + 9, y + 11, 2, 4 - (legL < 0 ? 1 : 0), pants);
  // Body.
  px(ctx, x + 4, y + 7 - bob, 8, 5, shirt);
  px(ctx, x + 3, y + 8 - bob, 1, 3, skin);
  px(ctx, x + 12, y + 8 - bob, 1, 3, skin);
  // Head.
  px(ctx, x + 4, y + 1 - bob, 8, 7, skin);
  px(ctx, x + 4, y + 1 - bob, 8, 2, hair);
  if (dir === "up") px(ctx, x + 4, y + 1 - bob, 8, 6, hair);
  if (dir === "down") {
    px(ctx, x + 6, y + 4 - bob, 1, 1, "#111");
    px(ctx, x + 9, y + 4 - bob, 1, 1, "#111");
  }
  if (dir === "left") {
    px(ctx, x + 5, y + 4 - bob, 1, 1, "#111");
    px(ctx, x + 10, y + 2 - bob, 2, 4, hair);
  }
  if (dir === "right") {
    px(ctx, x + 10, y + 4 - bob, 1, 1, "#111");
    px(ctx, x + 4, y + 2 - bob, 2, 4, hair);
  }
  if (hat === "hardhat") {
    px(ctx, x + 3, y - bob, 10, 2, "#ffd23f");
    px(ctx, x + 4, y - 2 - bob, 8, 2, "#ffd23f");
    px(ctx, x + 7, y - 2 - bob, 2, 2, "#e0b020");
  }
  if (hat === "beanie") {
    px(ctx, x + 4, y - 1 - bob, 8, 3, "#c23a2c");
    px(ctx, x + 7, y - 3 - bob, 2, 2, "#ffffff");
  }
}
