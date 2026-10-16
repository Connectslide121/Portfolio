import React, { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { buildLevel, TILE, H, W, T, SOLID, GROUND, GOAL_X, STAGES, zoneAt } from "./level";
import { paintLevel, drawSky, lava, qblock, coin, flag, goal, bug, runner } from "./draw";

/**
 * The run. Fixed-step physics (run, jump with coyote time and a jump
 * buffer, variable jump height), tile collision, ? blocks that pop the
 * stage's skills when headbutted, coins that are projects, bugs to stomp,
 * lava and pits that send you back to the last flag, and a goal at today.
 */

const RUN = 128;
const ACCEL = 1100;
const AIR = 700;
const FRICTION = 1400;
const GRAVITY = 1450;
const JUMP = 430;
const MAX_FALL = 480;
const STEP = 1 / 120;
const PW = 10;
const PH = 15;

const hatFor = (x) => {
  const z = zoneAt(Math.floor(x / TILE));
  return z === "campus" ? "cap" : z === "foundry" || z === "india" ? "hardhat" : z === "snow" ? "beanie" : "headset";
};

const Game = forwardRef(function Game({ paused, night, events }, ref) {
  const canvasRef = useRef(null);
  const pausedRef = useRef(paused);
  const nightRef = useRef(night);
  const ev = useRef(events);
  pausedRef.current = paused;
  nightRef.current = night;
  ev.current = events;
  const g = useRef(null);

  useImperativeHandle(ref, () => ({
    press(key, down) {
      if (!g.current) return;
      g.current.input[key] = down;
      if (key === "jump" && down) g.current.jumpBuffer = 0.14;
    },
    travel(stageIndex) {
      const s = g.current;
      if (!s) return;
      const st = STAGES[stageIndex];
      const x = (st.from + 1) * TILE;
      Object.assign(s.p, { x, y: (GROUND - 2) * TILE, vx: 0, vy: 0 });
      s.checkpoint = { x, y: (GROUND - 2) * TILE };
      // Flags behind you count as passed, so they do not all open at once.
      for (const f of s.level.flags) if (f.x * TILE < x) f.reached = true;
    },
    restart() {
      const s = g.current;
      if (!s) return;
      s.reset();
    },
  }));

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let level = buildLevel();
    let art = paintLevel(level.grid);
    document.fonts?.ready.then(() => (art = paintLevel(level.grid)));

    const s = {
      level,
      p: { x: 3 * TILE, y: (GROUND - 2) * TILE, vx: 0, vy: 0, face: 1, ground: false, coyote: 0, hurt: 0, frame: 0, ft: 0 },
      checkpoint: { x: 3 * TILE, y: (GROUND - 2) * TILE },
      input: { left: false, right: false, jump: false },
      jumpBuffer: 0,
      hearts: 3,
      popups: [],
      dust: [],
      scale: 3,
      cam: 0,
      done: false,
    };
    s.reset = () => {
      level = buildLevel();
      art = paintLevel(level.grid);
      s.level = level;
      Object.assign(s.p, { x: 3 * TILE, y: (GROUND - 2) * TILE, vx: 0, vy: 0, face: 1 });
      s.checkpoint = { x: 3 * TILE, y: (GROUND - 2) * TILE };
      s.hearts = 3;
      s.done = false;
      ev.current.onHearts?.(3);
    };
    g.current = s;

    const tile = (x, y) => (y < 0 ? T.EMPTY : y >= H || x < 0 || x >= W ? T.EMPTY : level.grid[y][x]);
    const solidAt = (px, py) => SOLID.has(tile(Math.floor(px / TILE), Math.floor(py / TILE)));

    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.round(canvas.clientWidth * dpr);
      canvas.height = Math.round(canvas.clientHeight * dpr);
      const css = Math.max(2, Math.min(Math.floor(canvas.clientHeight / (H * TILE)), Math.floor(canvas.clientWidth / (TILE * 16))));
      s.scale = css * dpr;
    };
    resize();
    window.addEventListener("resize", resize);

    const KEYS = { ArrowLeft: "left", a: "left", A: "left", ArrowRight: "right", d: "right", D: "right", ArrowUp: "jump", w: "jump", W: "jump", " ": "jump", z: "jump", Z: "jump" };
    const down = (e) => {
      if (e.target.closest?.("input, textarea, select")) return;
      const k = KEYS[e.key];
      if (!k || pausedRef.current) return;
      if (e.key === " " && e.target.closest?.("button, a")) return;
      e.preventDefault();
      s.input[k] = true;
      if (k === "jump" && !e.repeat) s.jumpBuffer = 0.14;
    };
    const up = (e) => {
      const k = KEYS[e.key];
      if (k) s.input[k] = false;
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);

    const die = (why) => {
      s.hearts -= 1;
      if (s.hearts <= 0) s.hearts = 3;
      Object.assign(s.p, { x: s.checkpoint.x, y: s.checkpoint.y, vx: 0, vy: 0, hurt: 1.2 });
      ev.current.onHurt?.(why, s.hearts);
    };

    const physics = (dt) => {
      const p = s.p;
      const inp = s.input;
      const dir = (inp.right ? 1 : 0) - (inp.left ? 1 : 0);
      if (dir) {
        p.vx += dir * (p.ground ? ACCEL : AIR) * dt;
        p.face = dir;
      } else if (p.ground) {
        const f = FRICTION * dt;
        p.vx = Math.abs(p.vx) <= f ? 0 : p.vx - Math.sign(p.vx) * f;
      }
      p.vx = Math.max(-RUN, Math.min(RUN, p.vx));

      p.coyote = p.ground ? 0.1 : p.coyote - dt;
      s.jumpBuffer -= dt;
      if (s.jumpBuffer > 0 && p.coyote > 0) {
        p.vy = -JUMP;
        p.coyote = 0;
        s.jumpBuffer = 0;
        p.ground = false;
      }
      if (!inp.jump && p.vy < -150) p.vy = -150; // let go early, jump lower
      p.vy = Math.min(MAX_FALL, p.vy + GRAVITY * dt);

      // Horizontal.
      p.x += p.vx * dt;
      if (p.vx > 0 && (solidAt(p.x + PW, p.y + 1) || solidAt(p.x + PW, p.y + PH - 1))) {
        p.x = Math.floor((p.x + PW) / TILE) * TILE - PW - 0.01;
        p.vx = 0;
      } else if (p.vx < 0 && (solidAt(p.x, p.y + 1) || solidAt(p.x, p.y + PH - 1))) {
        p.x = Math.floor(p.x / TILE + 1) * TILE + 0.01;
        p.vx = 0;
      }
      p.x = Math.max(0, Math.min(W * TILE - PW, p.x));

      // Vertical.
      const wasGround = p.ground;
      p.y += p.vy * dt;
      p.ground = false;
      if (p.vy > 0 && (solidAt(p.x + 1, p.y + PH) || solidAt(p.x + PW - 1, p.y + PH))) {
        p.y = Math.floor((p.y + PH) / TILE) * TILE - PH;
        if (!wasGround && p.vy > 260) for (let i = 0; i < 4; i++) s.dust.push({ x: p.x + 5, y: p.y + PH, vx: (i - 1.5) * 30, life: 0 });
        p.vy = 0;
        p.ground = true;
      } else if (p.vy < 0) {
        const hx = [p.x + 2, p.x + PW - 2];
        for (const hxx of hx) {
          if (solidAt(hxx, p.y)) {
            const tx = Math.floor(hxx / TILE);
            const ty = Math.floor(p.y / TILE);
            p.y = (ty + 1) * TILE;
            p.vy = 40;
            if (tile(tx, ty) === T.QBLOCK) {
              level.grid[ty][tx] = T.USED;
              const b = level.blocks.find((bb) => bb.x === tx && bb.y === ty);
              if (b) {
                b.open = true;
                s.popups.push({ x: tx * TILE + 8, y: ty * TILE, text: b.skill, life: 0 });
                ev.current.onSkill?.(b);
              }
            }
            break;
          }
        }
      }

      // Lava and the bottom of the world.
      const feet = tile(Math.floor((p.x + PW / 2) / TILE), Math.floor((p.y + PH - 2) / TILE));
      if (feet === T.LAVA) return die("lava");
      if (p.y > H * TILE + 20) return die("pit");

      // Flags.
      for (const f of level.flags) {
        if (!f.reached && p.x + PW / 2 >= f.x * TILE + 6) {
          f.reached = true;
          s.checkpoint = { x: f.x * TILE, y: (GROUND - 2) * TILE };
          ev.current.onFlag?.(f.stage);
        }
      }

      // Coins.
      for (const c of level.coins) {
        if (!c.taken && p.x < c.x + 8 && p.x + PW > c.x && p.y < c.y + 12 && p.y + PH > c.y) {
          c.taken = true;
          s.popups.push({ x: c.x + 4, y: c.y, text: c.project.title, life: 0, coin: true });
          ev.current.onCoin?.(c.project);
        }
      }

      // Bugs.
      p.hurt = Math.max(0, p.hurt - dt);
      for (const b of level.bugs) {
        if (!b.alive) continue;
        b.x += b.vx * dt;
        if (b.x < b.min || b.x > b.max) b.vx *= -1;
        const hit = p.x < b.x + 14 && p.x + PW > b.x && p.y < b.y + 15 && p.y + PH > b.y + 4;
        if (!hit) continue;
        if (p.vy > 40 && p.y + PH - b.y < 10) {
          b.alive = false;
          b.squashed = 0.6;
          p.vy = -300;
          s.popups.push({ x: b.x + 7, y: b.y, text: "Bug fixed!", life: 0 });
          ev.current.onBug?.();
        } else if (p.hurt <= 0) {
          s.hearts -= 1;
          p.hurt = 1.2;
          p.vy = -220;
          p.vx = (p.x < b.x ? -1 : 1) * 160;
          if (s.hearts <= 0) die("bug");
          else ev.current.onHurt?.("bug", s.hearts);
        }
      }

      // Today.
      if (!s.done && p.x >= GOAL_X * TILE + 18) {
        s.done = true;
        ev.current.onGoal?.();
      }

      // Walk cycle.
      if (p.ground && Math.abs(p.vx) > 10) {
        p.ft += dt;
        if (p.ft > 0.09) {
          p.ft = 0;
          p.frame = (p.frame + 1) % 4;
        }
      } else p.frame = 0;
    };

    let last = performance.now();
    let acc = 0;
    let frame = 0;
    let lastProgress = -1;

    const draw = (t) => {
      const p = s.p;
      const sc = s.scale;
      const vw = canvas.width / sc;
      const target = p.x + PW / 2 - vw * 0.38 + p.face * 18;
      s.cam += (Math.max(0, Math.min(W * TILE - vw, target)) - s.cam) * 0.12;
      const cam = Math.round(s.cam * sc) / sc;
      const oy = canvas.height - H * TILE * sc;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.imageSmoothingEnabled = false;
      drawSky(ctx, canvas.width, canvas.height, cam, sc, nightRef.current, t, reduce);

      ctx.setTransform(sc, 0, 0, sc, -Math.round(cam * sc), oy);
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(art, 0, 0);

      const x0 = Math.floor(cam / TILE) - 1;
      const x1 = x0 + Math.ceil(vw / TILE) + 2;
      for (let y = 0; y < H; y++) {
        for (let x = Math.max(0, x0); x < Math.min(W, x1); x++) {
          const tt = level.grid[y][x];
          if (tt === T.LAVA) lava(ctx, x * TILE, y * TILE, t, level.grid[y - 1]?.[x] !== T.LAVA);
          else if (tt === T.QBLOCK || tt === T.USED) qblock(ctx, x * TILE, y * TILE, tt === T.USED, t);
        }
      }

      for (const f of level.flags) flag(ctx, f.x * TILE, GROUND * TILE, f.reached, t);
      goal(ctx, (GOAL_X + 2) * TILE, GROUND * TILE, t);
      for (const c of level.coins) if (!c.taken) coin(ctx, c.x, c.y, t, c.project.featured);
      for (const b of level.bugs) {
        if (b.alive) bug(ctx, Math.round(b.x), Math.round(b.y), t, false);
        else if (b.squashed > 0) bug(ctx, Math.round(b.x), Math.round(b.y), t, true);
      }

      // The runner blinks while hurt.
      if (!(p.hurt > 0 && Math.floor(t / 80) % 2)) {
        runner(ctx, Math.round(p.x) - 1, Math.round(p.y), p.face, p.frame, !p.ground, hatFor(p.x));
      }

      ctx.font = "6px 'Press Start 2P', monospace";
      ctx.textAlign = "center";
      for (const pop of s.popups) {
        const k = pop.life / 1.4;
        ctx.globalAlpha = 1 - k;
        ctx.fillStyle = "#111";
        ctx.fillText(pop.text, Math.round(pop.x) + 1, Math.round(pop.y - 6 - k * 24) + 1);
        ctx.fillStyle = pop.coin ? "#ffd23f" : "#ffffff";
        ctx.fillText(pop.text, Math.round(pop.x), Math.round(pop.y - 6 - k * 24));
      }
      ctx.globalAlpha = 1;
      ctx.textAlign = "left";
      for (const d of s.dust) {
        ctx.fillStyle = `rgba(255,255,255,${0.7 * (1 - d.life / 0.4)})`;
        ctx.fillRect(Math.round(d.x + d.vx * d.life), Math.round(d.y - d.life * 10), 2, 2);
      }
    };

    const loop = (t) => {
      const dt = Math.min(0.1, (t - last) / 1000);
      last = t;
      if (!pausedRef.current) {
        acc += dt;
        while (acc >= STEP) {
          physics(STEP);
          acc -= STEP;
        }
        for (const pop of s.popups) pop.life += dt;
        s.popups = s.popups.filter((pop) => pop.life < 1.4);
        for (const d of s.dust) d.life += dt;
        s.dust = s.dust.filter((d) => d.life < 0.4);
        for (const b of level.bugs) if (!b.alive && b.squashed > 0) b.squashed -= dt;
      } else acc = 0;
      draw(t);
      const progress = Math.round((s.p.x / (GOAL_X * TILE)) * 200) / 200;
      if (progress !== lastProgress) {
        lastProgress = progress;
        ev.current.onProgress?.(Math.min(1, progress), s.p.x / TILE);
      }
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  return <canvas ref={canvasRef} className="stage" role="img" aria-label="A side-scrolling run through the career. Arrow keys to run, Space or Up to jump." />;
});

export default Game;
