import React, { useEffect, useImperativeHandle, useRef, forwardRef } from "react";
import { buildMap, BUILDINGS, TILE, W, H, walkable, thingAt, findPath, approachOf, region, T } from "./map";
import { paintWorld, person } from "./draw";

/**
 * The overworld, on one canvas. Grid movement with a short tween; keys,
 * tap-to-walk (breadth-first path) and an on-screen pad all feed the same
 * queue. Walking into a door, a sign or a villager calls onInteract.
 * At night (the dark theme) the world goes dark and lights come on: around
 * the player, the street lamps, the windows and the foundry's open door.
 */

const STEP_MS = 150;
const DIRS = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
const KEYMAP = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right",
  w: "up",
  s: "down",
  a: "left",
  d: "right",
  W: "up",
  S: "down",
  A: "left",
  D: "right",
};

const VILLAGERS = [
  { look: { shirt: "#c23a2c", hair: "#5a3a22" }, box: [5, 9, 14, 12], x: 7, y: 10 },
  { look: { shirt: "#ff8a1f", hair: "#111111", skin: "#c68a5a" }, box: [19, 9, 26, 12], x: 21, y: 11 },
  { look: { shirt: "#2bd47d", hair: "#e0c068", hat: "beanie" }, box: [31, 9, 46, 12], x: 36, y: 10 },
  { look: { shirt: "#b28cff", hair: "#7a4a2a" }, box: [31, 15, 46, 17], x: 44, y: 16 },
];

const hatFor = (x) => (["spain", "river", "india"].includes(region(x)) ? "hardhat" : "beanie");

const World = forwardRef(function World({ paused, onInteract, onStep, dark }, ref) {
  const canvasRef = useRef(null);
  const pausedRef = useRef(paused);
  const darkRef = useRef(dark);
  const cb = useRef({ onInteract, onStep });
  pausedRef.current = paused;
  darkRef.current = dark;
  cb.current = { onInteract, onStep };

  const engine = useRef(null);

  useImperativeHandle(ref, () => ({
    teleport(x, y, dir = "down") {
      const e = engine.current;
      if (!e) return;
      Object.assign(e.player, { x, y, fx: x, fy: y, t: 1, moving: false, dir, path: [] });
    },
    press(dir, down) {
      const e = engine.current;
      if (!e) return;
      if (down) {
        e.held = e.held.filter((d) => d !== dir).concat(dir);
        e.player.path = [];
      } else e.held = e.held.filter((d) => d !== dir);
    },
    act() {
      engine.current?.actFacing();
    },
    position() {
      const p = engine.current?.player;
      return p ? { x: p.x, y: p.y } : null;
    },
  }));

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const grid = buildMap();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let worlds = [paintWorld(grid, 0), paintWorld(grid, 1)];
    // Repaint once the pixel font has arrived, for the building names.
    document.fonts?.ready.then(() => {
      worlds = [paintWorld(grid, 0), paintWorld(grid, 1)];
    });

    const light = document.createElement("canvas");
    const lctx = light.getContext("2d");

    const saved = (() => {
      try {
        return JSON.parse(window.localStorage.getItem("jm-quest-pos"));
      } catch {
        return null;
      }
    })();
    const start = saved && walkable(grid, saved.x, saved.y) ? saved : { x: 3, y: 14 };

    const e = {
      player: { x: start.x, y: start.y, fx: start.x, fy: start.y, t: 1, moving: false, dir: "right", path: [], then: null },
      villagers: VILLAGERS.map((v) => ({ ...v, fx: v.x, fy: v.y, t: 1, dir: "down", next: performance.now() + 1500 + Math.random() * 2000 })),
      held: [],
      smoke: [],
      scale: 3,
      cam: { x: 0, y: 0 },
    };
    engine.current = e;

    const villagerAt = (x, y) => e.villagers.find((v) => v.x === x && v.y === y);

    const interact = (thing) => {
      e.held = [];
      e.player.path = [];
      e.player.then = null;
      cb.current.onInteract(thing);
    };

    // Use whatever is in front of the player.
    e.actFacing = () => {
      if (pausedRef.current) return;
      const p = e.player;
      const [dx, dy] = DIRS[p.dir];
      const tx = p.x + dx;
      const ty = p.y + dy;
      const thing = thingAt(tx, ty);
      const v = villagerAt(tx, ty);
      if (thing && thing.type !== "wall") interact(thing);
      else if (thing?.type === "wall") interact({ type: "door", building: thing.building });
      else if (v) interact({ type: "villager" });
    };

    const tryMove = (dir) => {
      const p = e.player;
      p.dir = dir;
      const [dx, dy] = DIRS[dir];
      const tx = p.x + dx;
      const ty = p.y + dy;
      const thing = thingAt(tx, ty);
      if (thing && thing.type !== "wall") {
        interact(thing);
        return false;
      }
      if (villagerAt(tx, ty)) {
        interact({ type: "villager" });
        return false;
      }
      if (!walkable(grid, tx, ty)) return false;
      Object.assign(p, { fx: p.x, fy: p.y, x: tx, y: ty, t: 0, moving: true });
      return true;
    };

    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      light.width = canvas.width;
      light.height = canvas.height;
      // At least ~17 tiles across the short side, in whole pixels per pixel.
      e.scale = Math.max(2, Math.min(4, Math.floor(Math.min(w, h) / (TILE * 17)))) * dpr;
      e.dpr = dpr;
    };
    resize();
    window.addEventListener("resize", resize);

    const onKey = (ev) => {
      // Never steal keys from a form field; let a focused button keep
      // Enter and Space for itself, but arrows still walk.
      if (ev.target.closest?.("input, textarea, select")) return;
      if (pausedRef.current) return;
      if ((ev.key === "Enter" || ev.key === " ") && ev.target.closest?.("button, a")) return;
      const dir = KEYMAP[ev.key];
      if (dir) {
        ev.preventDefault();
        e.held = e.held.filter((d) => d !== dir).concat(dir);
        e.player.path = [];
        // A quick tap is released before the next frame; take the step now.
        if (!ev.repeat && !e.player.moving) tryMove(dir);
      } else if (ev.key === "Enter" || ev.key === " " || ev.key === "e" || ev.key === "E") {
        ev.preventDefault();
        e.actFacing();
      }
    };
    const onKeyUp = (ev) => {
      const dir = KEYMAP[ev.key];
      if (dir) e.held = e.held.filter((d) => d !== dir);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("keyup", onKeyUp);

    // Tap or click to walk there.
    const onPointer = (ev) => {
      if (pausedRef.current) return;
      const rect = canvas.getBoundingClientRect();
      const wx = ((ev.clientX - rect.left) * e.dpr) / e.scale + e.cam.x;
      const wy = ((ev.clientY - rect.top) * e.dpr) / e.scale + e.cam.y;
      const tx = Math.floor(wx / TILE);
      const ty = Math.floor(wy / TILE);
      let thing = thingAt(tx, ty);
      if (thing?.type === "wall") thing = { type: "door", building: thing.building };
      let goal = [tx, ty];
      if (thing) goal = approachOf(thing);
      const p = e.player;
      const path = findPath(grid, p.x, p.y, goal[0], goal[1]);
      if (!path) return;
      p.path = path;
      p.then = thing;
      e.held = [];
    };
    canvas.addEventListener("pointerdown", onPointer);

    let last = performance.now();
    let frame = 0;

    const update = (now, dt) => {
      const p = e.player;
      if (p.moving) {
        p.t = Math.min(1, p.t + dt / STEP_MS);
        if (p.t >= 1) {
          p.moving = false;
          cb.current.onStep?.(p.x, p.y);
          try {
            window.localStorage.setItem("jm-quest-pos", JSON.stringify({ x: p.x, y: p.y }));
          } catch {
            /* fine */
          }
        }
      }
      if (!p.moving && !pausedRef.current) {
        if (e.held.length) {
          tryMove(e.held[e.held.length - 1]);
        } else if (p.path.length) {
          const [nx, ny] = p.path[0];
          const dir = nx > p.x ? "right" : nx < p.x ? "left" : ny > p.y ? "down" : "up";
          if (villagerAt(nx, ny)) {
            // Someone in the way: wait a beat, they will move.
          } else if (tryMove(dir)) p.path.shift();
          else p.path = [];
        } else if (p.then) {
          const thing = p.then;
          p.then = null;
          if (thing.type === "door") {
            const [dx, dy] = thing.building.door;
            p.dir = dy < p.y ? "up" : dy > p.y ? "down" : dx < p.x ? "left" : "right";
          } else if (thing.type === "sign") {
            p.dir = thing.sign.y < p.y ? "up" : "down";
          }
          interact(thing);
        }
      }

      // Villagers wander inside their patch.
      for (const v of e.villagers) {
        if (v.t < 1) v.t = Math.min(1, v.t + dt / (STEP_MS * 2.2));
        if (now > v.next && v.t >= 1 && !pausedRef.current) {
          v.next = now + 1200 + Math.random() * 2600;
          const dirs = Object.keys(DIRS);
          const dir = dirs[Math.floor(Math.random() * 4)];
          const [dx, dy] = DIRS[dir];
          const nx = v.x + dx;
          const ny = v.y + dy;
          v.dir = dir;
          const [x0, y0, x1, y1] = v.box;
          if (nx >= x0 && nx <= x1 && ny >= y0 && ny <= y1 && walkable(grid, nx, ny) && !(nx === p.x && ny === p.y) && !villagerAt(nx, ny)) {
            Object.assign(v, { fx: v.x, fy: v.y, x: nx, y: ny, t: 0 });
          }
        }
      }

      // Chimney smoke.
      if (!reduce && Math.random() < dt / 120) {
        for (const b of BUILDINGS) {
          if (b.style !== "foundry" && b.style !== "plant") continue;
          e.smoke.push({ x: (b.x + b.w) * TILE - 10 + Math.random() * 4, y: b.y * TILE - 16, life: 0, size: 2 + Math.random() * 3 });
        }
      }
      e.smoke = e.smoke.filter((s) => (s.life += dt) < 2600);
    };

    const draw = (now) => {
      const p = e.player;
      const ease = (t) => t * (2 - t);
      const px = (p.fx + (p.x - p.fx) * ease(p.t)) * TILE;
      const py = (p.fy + (p.y - p.fy) * ease(p.t)) * TILE;
      const vw = canvas.width / e.scale;
      const vh = canvas.height / e.scale;
      e.cam.x = Math.max(0, Math.min(W * TILE - vw, px + TILE / 2 - vw / 2));
      e.cam.y = Math.max(0, Math.min(H * TILE - vh, py + TILE / 2 - vh / 2));
      if (vw > W * TILE) e.cam.x = (W * TILE - vw) / 2;
      if (vh > H * TILE) e.cam.y = (H * TILE - vh) / 2;
      const ox = Math.round(e.cam.x * e.scale);
      const oy = Math.round(e.cam.y * e.scale);

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.fillStyle = "#14223a";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.setTransform(e.scale, 0, 0, e.scale, -ox, -oy);
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(worlds[reduce ? 0 : Math.floor(now / 600) % 2], 0, 0);

      // Smoke behind sprites.
      for (const s of e.smoke) {
        const k = s.life / 2600;
        ctx.fillStyle = `rgba(90, 90, 98, ${0.55 * (1 - k)})`;
        const sz = s.size + k * 6;
        ctx.fillRect(Math.round(s.x + k * 14 - sz / 2), Math.round(s.y - k * 46), Math.round(sz), Math.round(sz));
      }

      // Sprites, back to front.
      const sprites = e.villagers.map((v) => ({
        y: v.fy + (v.y - v.fy) * v.t,
        draw: () =>
          person(
            ctx,
            Math.round((v.fx + (v.x - v.fx) * v.t) * TILE),
            Math.round((v.fy + (v.y - v.fy) * v.t) * TILE),
            v.dir,
            v.t < 1 && v.t > 0.5,
            v.look,
          ),
      }));
      sprites.push({
        y: py / TILE,
        draw: () => person(ctx, Math.round(px), Math.round(py), p.dir, p.moving && p.t > 0.5, { shirt: "#2f6bd6", hat: hatFor(p.x) }),
      });
      sprites.sort((a, b) => a.y - b.y).forEach((s) => s.draw());

      // Where a tap is taking you.
      if (p.path.length) {
        const [gx, gy] = p.path[p.path.length - 1];
        ctx.strokeStyle = "rgba(255,255,255,0.8)";
        ctx.lineWidth = 1;
        ctx.strokeRect(gx * TILE + 1.5, gy * TILE + 1.5, TILE - 3, TILE - 3);
      }

      // Night.
      if (darkRef.current) {
        lctx.setTransform(1, 0, 0, 1, 0, 0);
        lctx.globalCompositeOperation = "source-over";
        lctx.clearRect(0, 0, light.width, light.height);
        lctx.fillStyle = "rgba(8, 12, 40, 0.72)";
        lctx.fillRect(0, 0, light.width, light.height);
        lctx.setTransform(e.scale, 0, 0, e.scale, -ox, -oy);
        lctx.globalCompositeOperation = "destination-out";
        const glow = (x, y, r, a = 1) => {
          const g = lctx.createRadialGradient(x, y, 0, x, y, r);
          g.addColorStop(0, `rgba(0,0,0,${a})`);
          g.addColorStop(1, "rgba(0,0,0,0)");
          lctx.fillStyle = g;
          lctx.fillRect(x - r, y - r, r * 2, r * 2);
        };
        glow(px + 8, py + 8, 64);
        for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (grid[y][x] === T.LAMP) glow(x * TILE + 8, y * TILE + 4, 40, 0.95);
        for (const b of BUILDINGS) {
          const [dx, dy] = b.door;
          glow(dx * TILE + 8, dy * TILE + 8, b.style === "foundry" ? 46 : 22, 0.9);
          for (let i = 6; i < b.w * TILE - 8; i += 12) glow(b.x * TILE + i + 3, b.y * TILE + b.h * TILE * 0.42 + 8, 10, 0.7);
          if (b.style === "arcade" && Math.floor(now / 700) % 2) glow((b.x + b.w / 2) * TILE, b.y * TILE + 8, 34, 0.8);
        }
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.drawImage(light, 0, 0);
      }
    };

    const loop = (now) => {
      const dt = Math.min(64, now - last);
      last = now;
      update(now, dt);
      draw(now);
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("keyup", onKeyUp);
      canvas.removeEventListener("pointerdown", onPointer);
    };
  }, []);

  return <canvas ref={canvasRef} className="world" aria-label="The overworld. Use the arrow keys or tap to walk; walk into doors and signs to read them." role="img" />;
});

export default World;
