import { rng } from "./rng";

/**
 * The overworld: the career laid out west to east as one walk.
 *
 *   Spain   (x 0–15)   the university, Lea-Artibai, the AML foundry
 *   river   (x 16–17)
 *   India   (x 18–27)  the plant in Coimbatore
 *   sea     (x 28–29)
 *   Sweden  (x 30–47)  Lexicon, Sprinta, the workshop, the arcade, the post office
 *
 * Built in code rather than drawn by hand so that every door is reachable:
 * one road runs the whole width, bridges cross the water, and a path leads
 * from the road to every door. Trees and decorations are scattered from a
 * seed, never onto a path or next to a door.
 */

export const W = 48;
export const H = 28;
export const TILE = 16;
export const ROAD_Y = 14;

export const T = {
  GRASS: 0,
  FLOWER: 1,
  ROAD: 2,
  BRIDGE: 3,
  WATER: 4,
  TREE: 5,
  SAND: 6,
  PALM: 7,
  SNOW: 8,
  PINE: 9,
  ROCK: 10,
  STONE: 11, // Swedish cobbles
  CACTUS: 12,
  LAMP: 13,
};

const BLOCKING = new Set([T.WATER, T.TREE, T.PALM, T.PINE, T.ROCK, T.CACTUS, T.LAMP]);

export const region = (x) => (x < 16 ? "spain" : x < 18 ? "river" : x < 28 ? "india" : x < 30 ? "sea" : "sweden");

/** Buildings. `door` is on the wall that faces the road. `target` is what opens inside. */
export const BUILDINGS = [
  { id: "uni", name: "London Met", style: "uni", x: 2, y: 4, w: 5, h: 4, door: [4, 7], target: { kind: "entry", id: "edu-polymers" } },
  { id: "foundry", name: "AML Foundry", style: "foundry", x: 9, y: 3, w: 6, h: 5, door: [12, 7], target: { kind: "entry", id: "exp-aml" } },
  { id: "lea", name: "Lea-Artibai", style: "lea", x: 3, y: 18, w: 5, h: 4, door: [5, 18], target: { kind: "entry", id: "edu-leartik" } },
  { id: "plant", name: "Arihant Technocast", style: "plant", x: 20, y: 4, w: 6, h: 4, door: [23, 7], target: { kind: "beat", id: "india" } },
  { id: "lexicon", name: "Lexicon", style: "lexicon", x: 31, y: 4, w: 4, h: 4, door: [33, 7], target: { kind: "entry", id: "edu-lexicon" } },
  { id: "sprinta", name: "Sprinta", style: "sprinta", x: 37, y: 3, w: 6, h: 5, door: [40, 7], target: { kind: "sprinta" } },
  { id: "workshop", name: "Workshop", style: "workshop", x: 44, y: 4, w: 3, h: 4, door: [45, 7], target: { kind: "bag" } },
  { id: "arcade", name: "Arcade", style: "arcade", x: 32, y: 18, w: 6, h: 4, door: [35, 18], target: { kind: "arcade" } },
  { id: "post", name: "Post Office", style: "post", x: 41, y: 18, w: 4, h: 4, door: [43, 18], target: { kind: "post" } },
];

/** Signposts: walk into one to read it. */
export const SIGNS = [
  { id: "start", x: 2, y: 13, target: { kind: "start" } },
  { id: "steel", x: 8, y: 15, target: { kind: "chapter", id: "steel" } },
  { id: "india-sign", x: 19, y: 13, target: { kind: "sign", text: "india" } },
  { id: "reset", x: 31, y: 15, target: { kind: "chapter", id: "reset" } },
  { id: "software", x: 39, y: 15, target: { kind: "chapter", id: "software" } },
];

export const SPAWN = { x: 3, y: ROAD_Y, dir: "right" };

export function buildMap() {
  const r = rng(2005);
  const grid = Array.from({ length: H }, () => Array(W).fill(T.GRASS));
  const set = (x, y, t) => {
    if (x >= 0 && y >= 0 && x < W && y < H) grid[y][x] = t;
  };

  // Ground by region.
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const reg = region(x);
      set(x, y, reg === "india" ? T.SAND : reg === "sweden" ? T.SNOW : reg === "spain" ? T.GRASS : T.WATER);
    }
  }

  // The road, with bridges over the water.
  for (let x = 1; x < W - 1; x++) {
    const reg = region(x);
    set(x, ROAD_Y, reg === "river" || reg === "sea" ? T.BRIDGE : reg === "sweden" ? T.STONE : T.ROAD);
  }

  // Paths from the road to every door.
  const reserved = new Set();
  const reserve = (x, y) => reserved.add(`${x},${y}`);
  for (const b of BUILDINGS) {
    const [dx, dy] = b.door;
    const above = dy < ROAD_Y;
    const from = above ? dy + 1 : ROAD_Y + 1;
    const to = above ? ROAD_Y - 1 : dy - 1;
    for (let y = from; y <= to; y++) set(dx, y, region(dx) === "sweden" ? T.STONE : T.ROAD);
    // Nothing grows on or next to a building.
    for (let y = b.y - 1; y <= b.y + b.h; y++) for (let x = b.x - 1; x <= b.x + b.w; x++) reserve(x, y);
  }
  for (const s of SIGNS) reserve(s.x, s.y);
  for (let x = 0; x < W; x++) for (let y = ROAD_Y - 1; y <= ROAD_Y + 1; y++) reserve(x, y);
  for (const b of BUILDINGS) {
    const [dx] = b.door;
    for (let y = 0; y < H; y++) {
      if (grid[y][dx] === T.ROAD || grid[y][dx] === T.STONE) {
        reserve(dx - 1, y);
        reserve(dx, y);
        reserve(dx + 1, y);
      }
    }
  }

  // Lamps along the Swedish road (they light up at night).
  for (let x = 31; x < W - 1; x += 4) {
    if (!BUILDINGS.some((b) => b.door[0] === x)) set(x, ROAD_Y - 1, T.LAMP);
  }

  // Scatter the scenery.
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const t = grid[y][x];
      const edge = x === 0 || y === 0 || x === W - 1 || y === H - 1 || y === 1 || y === H - 2;
      if (reserved.has(`${x},${y}`) && !edge) continue;
      if (t === T.ROAD || t === T.STONE || t === T.BRIDGE || t === T.LAMP) continue;
      const v = r();
      if (t === T.GRASS) {
        if (edge || v < 0.12) set(x, y, T.TREE);
        else if (v < 0.24) set(x, y, T.FLOWER);
        else if (v < 0.26) set(x, y, T.ROCK);
      } else if (t === T.SAND) {
        if (edge || v < 0.09) set(x, y, T.PALM);
        else if (v < 0.13) set(x, y, T.CACTUS);
        else if (v < 0.16) set(x, y, T.ROCK);
      } else if (t === T.SNOW) {
        if (edge || v < 0.12) set(x, y, T.PINE);
        else if (v < 0.15) set(x, y, T.ROCK);
      }
    }
  }

  // A pond in Spain, for the view.
  for (let y = 21; y <= 24; y++) for (let x = 10; x <= 13; x++) if ((x - 11.5) ** 2 / 4 + (y - 22.5) ** 2 / 3 < 1) set(x, y, T.WATER);

  // The road and paths always win.
  for (let x = 1; x < W - 1; x++) {
    const reg = region(x);
    grid[ROAD_Y][x] = reg === "river" || reg === "sea" ? T.BRIDGE : reg === "sweden" ? T.STONE : T.ROAD;
  }

  return grid;
}

/** Which building footprint, door or sign is at a tile, if any. */
export function thingAt(x, y) {
  for (const b of BUILDINGS) {
    if (b.door[0] === x && b.door[1] === y) return { type: "door", building: b };
    if (x >= b.x && x < b.x + b.w && y >= b.y && y < b.y + b.h) return { type: "wall", building: b };
  }
  const s = SIGNS.find((s) => s.x === x && s.y === y);
  if (s) return { type: "sign", sign: s };
  return null;
}

export function walkable(grid, x, y) {
  if (x < 0 || y < 0 || x >= W || y >= H) return false;
  if (thingAt(x, y)) return false;
  return !BLOCKING.has(grid[y][x]);
}

/** Breadth-first path from (sx, sy) to (tx, ty) over walkable tiles. */
export function findPath(grid, sx, sy, tx, ty, blocked = () => false) {
  const key = (x, y) => y * W + x;
  const prev = new Map([[key(sx, sy), null]]);
  const queue = [[sx, sy]];
  while (queue.length) {
    const [x, y] = queue.shift();
    if (x === tx && y === ty) {
      const path = [];
      let k = key(x, y);
      while (k !== key(sx, sy)) {
        path.unshift([k % W, Math.floor(k / W)]);
        k = prev.get(k);
      }
      return path;
    }
    for (const [dx, dy] of [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ]) {
      const nx = x + dx;
      const ny = y + dy;
      const k = key(nx, ny);
      if (prev.has(k) || !walkable(grid, nx, ny) || blocked(nx, ny)) continue;
      prev.set(k, key(x, y));
      queue.push([nx, ny]);
    }
  }
  return null;
}

/** The walkable tile you stand on to use a door or a sign. */
export function approachOf(thing) {
  if (thing.type === "door") {
    const [x, y] = thing.building.door;
    return y < ROAD_Y ? [x, y + 1] : [x, y - 1];
  }
  if (thing.type === "sign") {
    const s = thing.sign;
    return s.y < ROAD_Y ? [s.x, s.y + 1] : [s.x, s.y - 1];
  }
  return null;
}
