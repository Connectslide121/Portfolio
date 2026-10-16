import React, { useEffect, useRef } from "react";

/**
 * Pipes. A pipe grows across a grid one cell at a time, turning now and
 * then, until it runs into the edge or another pipe; then a new one starts
 * in a new colour. Shaded with gradients so the 2D lines read as tubes.
 * After enough pipes the screen clears and it begins again.
 */
const COLORS = ["#ff8a1f", "#4f9df5", "#1ea446", "#e3262b", "#ffd800", "#9d4edd", "#14c1c8", "#c0c0c0"];
const CELL = 36;
const DIRS = [
  [1, 0],
  [0, 1],
  [-1, 0],
  [0, -1],
];

function shade(ctx, x1, y1, x2, y2, color, width) {
  const horizontal = y1 === y2;
  const g = horizontal
    ? ctx.createLinearGradient(0, y1 - width / 2, 0, y1 + width / 2)
    : ctx.createLinearGradient(x1 - width / 2, 0, x1 + width / 2, 0);
  g.addColorStop(0, "#000");
  g.addColorStop(0.35, color);
  g.addColorStop(0.5, "#fff");
  g.addColorStop(0.65, color);
  g.addColorStop(1, "#000");
  ctx.strokeStyle = g;
  ctx.lineWidth = width;
  ctx.lineCap = "butt";
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

function joint(ctx, x, y, color, r) {
  const g = ctx.createRadialGradient(x - r / 3, y - r / 3, 1, x, y, r);
  g.addColorStop(0, "#fff");
  g.addColorStop(0.4, color);
  g.addColorStop(1, "#000");
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

export default function Screensaver({ onExit }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const W = window.innerWidth;
    const H = window.innerHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.scale(dpr, dpr);

    const cols = Math.floor(W / CELL);
    const rows = Math.floor(H / CELL);
    let used = new Set();
    let pipe = null;
    let pipes = 0;
    let colorIndex = Math.floor(Math.random() * COLORS.length);

    const clear = () => {
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, W, H);
      used = new Set();
      pipes = 0;
    };

    const start = () => {
      for (let tries = 0; tries < 40; tries++) {
        const c = Math.floor(Math.random() * cols);
        const r = Math.floor(Math.random() * rows);
        if (!used.has(`${c},${r}`)) {
          used.add(`${c},${r}`);
          colorIndex = (colorIndex + 1) % COLORS.length;
          pipe = { c, r, dir: Math.floor(Math.random() * 4), color: COLORS[colorIndex], len: 0 };
          const [x, y] = [c * CELL + CELL / 2, r * CELL + CELL / 2];
          joint(ctx, x, y, pipe.color, 10);
          pipes++;
          return;
        }
      }
      clear();
      start();
    };

    const step = () => {
      if (!pipe) return start();
      let dir = pipe.dir;
      if (pipe.len > 1 && Math.random() < 0.28) dir = (dir + (Math.random() < 0.5 ? 1 : 3)) % 4;
      const tryDirs = [dir, (dir + 1) % 4, (dir + 3) % 4];
      const free = tryDirs.find((d) => {
        const nc = pipe.c + DIRS[d][0];
        const nr = pipe.r + DIRS[d][1];
        return nc >= 0 && nr >= 0 && nc < cols && nr < rows && !used.has(`${nc},${nr}`);
      });
      if (free === undefined || pipe.len > 60) {
        pipe = null;
        if (pipes > 14) clear();
        return;
      }
      const x1 = pipe.c * CELL + CELL / 2;
      const y1 = pipe.r * CELL + CELL / 2;
      const nc = pipe.c + DIRS[free][0];
      const nr = pipe.r + DIRS[free][1];
      const x2 = nc * CELL + CELL / 2;
      const y2 = nr * CELL + CELL / 2;
      shade(ctx, x1, y1, x2, y2, pipe.color, 12);
      if (free !== pipe.dir) joint(ctx, x1, y1, pipe.color, 8.5);
      used.add(`${nc},${nr}`);
      pipe = { ...pipe, c: nc, r: nr, dir: free, len: pipe.len + 1 };
    };

    clear();
    const id = window.setInterval(step, 45);

    // Leave on any input, after a moment so the click that started it does
    // not also end it.
    let armed = false;
    const arm = window.setTimeout(() => (armed = true), 700);
    const exit = () => armed && onExit();
    window.addEventListener("pointermove", exit);
    window.addEventListener("pointerdown", exit);
    window.addEventListener("keydown", exit);
    return () => {
      window.clearInterval(id);
      window.clearTimeout(arm);
      window.removeEventListener("pointermove", exit);
      window.removeEventListener("pointerdown", exit);
      window.removeEventListener("keydown", exit);
    };
  }, [onExit]);

  return <canvas ref={canvasRef} className="screensaver" aria-label="Screensaver: pipes. Move the mouse to return." role="img" />;
}
