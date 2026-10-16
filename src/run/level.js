import { rng } from "./rng";
import { experience, education, beats } from "../data/journey";
import { featuredProjects, allProjects } from "../components/projectList";

/**
 * One long level, 2005 to today. Every role and degree is a stage with a
 * checkpoint flag; its ? blocks hold the skills that entry lists in the CV;
 * the projects are coins, placed by the month they were made. The ground,
 * gaps, platforms and bugs are generated from a seed per stage, and the
 * stage's era sets the scenery: campus, foundry (with lava), India, the
 * Swedish reset (snow), then the neon of software.
 */

export const TILE = 16;
export const H = 15;
export const GROUND = 12; // first row of ground

export const T = { EMPTY: 0, GROUND: 1, BRICK: 2, QBLOCK: 3, USED: 4, LAVA: 5, PLATFORM: 6 };
export const SOLID = new Set([T.GROUND, T.BRICK, T.QBLOCK, T.USED, T.PLATFORM]);

const ENTRY = Object.fromEntries([...experience, ...education].map((e) => [e.id, e]));
const india = beats.find((b) => b.id === "india");

/** Stages in the order you run them, with where they start and end. */
export const STAGES = [
  { id: "edu-polymers", zone: "campus", from: 10, to: 35 },
  { id: "edu-leartik", zone: "campus", from: 36, to: 58 },
  { id: "exp-aml", zone: "foundry", from: 59, to: 86 },
  { id: "india", zone: "india", from: 87, to: 104 },
  { id: "exp-aml-2", zone: "foundry", from: 105, to: 116, quiet: true },
  { id: "edu-lexicon", zone: "snow", from: 117, to: 142 },
  { id: "exp-sprinta-ai", zone: "software", from: 143, to: 170 },
  { id: "exp-sprinta-lead", zone: "software", from: 171, to: 206 },
].map((s, i) => ({ ...s, n: i + 1 }));

export const GOAL_X = 212;
export const W = 222;

/** What a stage is about, for its flag and its card. */
export function stageInfo(stage) {
  if (stage.id === "india") {
    return {
      kind: "beat",
      title: india.role,
      org: india.org,
      when: india.year,
      where: india.place,
      tech: ["Process transfer", "Team training", "CAD"],
      beat: india,
    };
  }
  const e = ENTRY[stage.id.replace("-2", "")];
  return { kind: "entry", title: e.title, org: e.org, when: e.dateLabel, where: e.location, tech: e.tech, entry: e };
}

export const zoneAt = (x) => {
  if (x < STAGES[0].from) return "campus";
  if (x >= GOAL_X - 6) return "software";
  const s = STAGES.find((st) => x >= st.from && x <= st.to);
  return s ? s.zone : "software";
};

/** "November 2023" -> fractional year */
const when = (date) => {
  const [m, y] = date.split(" ");
  const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].indexOf(m);
  return Number(y) + Math.max(0, month) / 12;
};

export function buildLevel() {
  const grid = Array.from({ length: H }, () => Array(W).fill(T.EMPTY));
  const set = (x, y, t) => {
    if (x >= 0 && x < W && y >= 0 && y < H) grid[y][x] = t;
  };
  const solid = (x, y) => SOLID.has(grid[y]?.[x]);

  // Ground everywhere to start with.
  for (let x = 0; x < W; x++) for (let y = GROUND; y < H; y++) set(x, y, T.GROUND);

  const flags = [];
  const blocks = []; // ? blocks and what they hold
  const bugs = [];
  const safe = new Set(); // columns kept as solid ground (flags, starts)

  for (const st of STAGES) {
    const r = rng(st.n * 7919);
    const info = stageInfo(st);
    if (!st.quiet) {
      flags.push({ x: st.from + 2, stage: st });
      for (let x = st.from; x <= st.from + 5; x++) safe.add(x);
    }

    // Bugs to stomp, in the software years and the reset.
    const patrol = [];
    if (st.zone === "software" || st.zone === "snow") {
      const n = st.zone === "software" ? 3 : 1;
      for (let i = 0; i < n; i++) {
        const bx = st.from + 10 + Math.floor(((i + 0.5) / n) * (st.to - st.from - 14));
        bugs.push({ x: bx * TILE, y: (GROUND - 1) * TILE, vx: -24, alive: true, min: (bx - 3) * TILE, max: (bx + 3) * TILE });
        patrol.push([bx - 4, bx + 4]);
      }
    }

    // Gaps: lava in the foundry, plain pits elsewhere. Narrow, always jumpable,
    // spread over the stage and kept clear of flags and bug patrols.
    const marks = st.quiet ? [0.5] : st.zone === "foundry" ? [0.3, 0.55, 0.8] : [0.35, 0.7];
    const blocked = (c) => c < st.from + 7 || c > st.to - 3 || patrol.some(([a, b]) => c >= a && c <= b);
    const fits = (c, w) => [...Array(w)].every((_, i) => !blocked(c + i));
    for (const m of marks) {
      const w = 2 + (r() < 0.4 ? 1 : 0);
      let gx = st.from + Math.round(m * (st.to - st.from));
      for (let k = 0; k < 8 && !fits(gx, w); k++) gx++;
      if (!fits(gx, w)) continue;
      for (let i = 0; i < w; i++) for (let y = GROUND; y < H; y++) set(gx + i, y, st.zone === "foundry" ? T.LAVA : T.EMPTY);
    }

    // Floating platforms now and then.
    for (let p = 0; p < 2; p++) {
      const px = st.from + 9 + Math.floor(r() * Math.max(1, st.to - st.from - 14));
      const len = 3 + Math.floor(r() * 3);
      const py = 8 - Math.floor(r() * 2);
      for (let i = 0; i < len; i++) set(px + i, py, st.zone === "campus" || st.zone === "india" ? T.BRICK : T.PLATFORM);
    }

    // ? blocks: one per skill the entry lists, spread over the stage.
    if (!st.quiet) {
      const skills = info.tech;
      const span = st.to - st.from - 8;
      skills.forEach((skill, i) => {
        let bx = st.from + 6 + Math.round(((i + 0.5) / skills.length) * span);
        // Over solid ground, never over a gap, and not on a platform.
        for (let k = 0; k < 6 && !solid(bx, GROUND); k++) bx++;
        let by = 8;
        if (grid[by][bx] !== T.EMPTY || grid[by - 1][bx] !== T.EMPTY) by = 7;
        set(bx, by, T.QBLOCK);
        blocks.push({ x: bx, y: by, skill, stage: st.id, open: false });
      });
    }
  }

  // Keep flag columns and the start and goal on firm ground.
  for (let x = 0; x < STAGES[0].from + 2; x++) safe.add(x);
  for (let x = GOAL_X - 8; x < W; x++) safe.add(x);
  for (const x of safe) for (let y = GROUND; y < H; y++) set(x, y, T.GROUND);

  // Bugs need ground under their whole patrol.
  for (const b of bugs) {
    for (let x = Math.floor(b.min / TILE); x <= Math.ceil(b.max / TILE); x++) for (let y = GROUND; y < H; y++) set(x, y, T.GROUND);
  }

  // A few steps up to the goal.
  for (let i = 0; i < 4; i++) for (let j = 0; j <= i; j++) set(GOAL_X - 6 + i, GROUND - 1 - j, T.BRICK);

  // Projects as coins, by date, between the reset and today.
  const projects = [...featuredProjects.map((p) => ({ ...p, featured: true })), ...allProjects];
  const dates = projects.map((p) => when(p.date));
  const lo = Math.min(...dates);
  const hi = Math.max(...dates);
  const x0 = STAGES.find((s) => s.id === "edu-lexicon").from + 6;
  const x1 = GOAL_X - 10;
  const taken = new Set();
  const coins = projects
    .map((p, i) => {
      let cx = Math.round(x0 + ((dates[i] - lo) / (hi - lo || 1)) * (x1 - x0));
      // Projects from the same month line up side by side, in a little arc.
      while (taken.has(cx)) cx++;
      taken.add(cx);
      let cy = 10 - (cx % 2);
      while (grid[cy]?.[cx] !== T.EMPTY && cy > 2) cy--;
      return { x: cx * TILE + 4, y: cy * TILE + 2, project: p, taken: false };
    })
    .sort((a, b) => a.x - b.x);

  return { grid, flags, blocks, bugs, coins };
}
