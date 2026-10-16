import { T, TILE, H, W, zoneAt, GOAL_X } from "./level";
import { rng } from "./rng";

/**
 * Pixel art for the run, drawn in code. Tiles are painted once into a
 * level-sized canvas; skies and their parallax layers are drawn per frame
 * for whichever era the camera is in, crossfading between eras.
 */

const px = (ctx, x, y, w, h, c) => {
  ctx.fillStyle = c;
  ctx.fillRect(x, y, w, h);
};

export const ZONES = {
  campus: { sky: ["#8fd3ff", "#d8f1ff"], night: ["#0d1b3d", "#2a3d6b"], far: "#7cc47a", near: "#4f9d4c", top: "#6fcf5a", dirt: "#9a6a3c", dark: "#6b4423" },
  foundry: { sky: ["#3a0f06", "#c2481a"], night: ["#16060a", "#5a1a0c"], far: "#2a1612", near: "#1a0e0b", top: "#5a5f6a", dirt: "#3a3d45", dark: "#24262c" },
  india: { sky: ["#ff9a5a", "#ffd98a"], night: ["#2a1240", "#7a3a50"], far: "#d9a45c", near: "#b07a3c", top: "#f0d08a", dirt: "#d9b06a", dark: "#b08a4a" },
  snow: { sky: ["#bcd8ff", "#eef6ff"], night: ["#0c1530", "#2b3b66"], far: "#c9d8e8", near: "#7f9bb8", top: "#ffffff", dirt: "#9fb4c8", dark: "#6f86a0" },
  software: { sky: ["#070a1f", "#1a1f55"], night: ["#020310", "#0b0e2e"], far: "#1b2470", near: "#121850", top: "#22e0ff", dirt: "#141a3f", dark: "#0b0f2a" },
};

function groundTile(ctx, x, y, z, top, seed) {
  const r = rng(seed);
  px(ctx, x, y, TILE, TILE, z.dirt);
  for (let i = 0; i < 5; i++) px(ctx, x + Math.floor(r() * 14), y + 3 + Math.floor(r() * 12), 2, 2, z.dark);
  if (top) {
    px(ctx, x, y, TILE, 4, z.top);
    px(ctx, x, y + 4, TILE, 1, z.dark);
    if (z === ZONES.campus) for (let i = 0; i < 4; i++) px(ctx, x + Math.floor(r() * 15), y - 1, 1, 2, "#8be06f");
    if (z === ZONES.software) {
      px(ctx, x, y, TILE, 1, "#bff6ff");
      px(ctx, x + 2, y + 8, 4, 1, "#2a3a9a");
      px(ctx, x + 9, y + 11, 5, 1, "#2a3a9a");
    }
    if (z === ZONES.foundry) for (let i = 0; i < 4; i++) px(ctx, x + i * 4 + 1, y + 1, 1, 1, "#8a8f9a");
  }
}

function brick(ctx, x, y, z) {
  const c = z === ZONES.software ? "#3a2a9a" : z === ZONES.foundry ? "#6a6f7a" : "#c4652f";
  const m = z === ZONES.software ? "#22e0ff" : z === ZONES.foundry ? "#3a3d45" : "#7a3a18";
  px(ctx, x, y, TILE, TILE, c);
  px(ctx, x, y + 7, TILE, 1, m);
  px(ctx, x, y + 15, TILE, 1, m);
  px(ctx, x + 7, y, 1, 7, m);
  px(ctx, x + 3, y + 8, 1, 7, m);
  px(ctx, x + 11, y + 8, 1, 7, m);
}

function platform(ctx, x, y, z) {
  const c = z === ZONES.software ? "#22e0ff" : z === ZONES.foundry ? "#8a8f9a" : "#ffffff";
  px(ctx, x, y, TILE, 6, z === ZONES.software ? "#141a3f" : z === ZONES.foundry ? "#4a4d55" : "#c9d8e8");
  px(ctx, x, y, TILE, 2, c);
  px(ctx, x + 2, y + 6, 2, 3, z === ZONES.foundry ? "#3a3d45" : "#7f9bb8");
  px(ctx, x + 12, y + 6, 2, 3, z === ZONES.foundry ? "#3a3d45" : "#7f9bb8");
}

export function qblock(ctx, x, y, used, t) {
  px(ctx, x, y, TILE, TILE, "#5a3a10");
  px(ctx, x + 1, y + 1, 14, 14, used ? "#9a7a4a" : "#ffb52e");
  if (!used) {
    const glow = 0.5 + 0.5 * Math.sin(t / 200);
    px(ctx, x + 1, y + 1, 14, 1, `rgba(255,255,255,${0.4 + glow * 0.4})`);
    // A question mark.
    px(ctx, x + 6, y + 3, 4, 1, "#5a3a10");
    px(ctx, x + 10, y + 4, 1, 3, "#5a3a10");
    px(ctx, x + 8, y + 7, 2, 1, "#5a3a10");
    px(ctx, x + 7, y + 8, 1, 2, "#5a3a10");
    px(ctx, x + 7, y + 11, 1, 1, "#5a3a10");
  }
  px(ctx, x + 2, y + 2, 1, 1, "#5a3a10");
  px(ctx, x + 13, y + 2, 1, 1, "#5a3a10");
  px(ctx, x + 2, y + 13, 1, 1, "#5a3a10");
  px(ctx, x + 13, y + 13, 1, 1, "#5a3a10");
}

/** The static level: ground, bricks, platforms (lava and ? blocks are drawn live). */
export function paintLevel(grid) {
  const c = document.createElement("canvas");
  c.width = W * TILE;
  c.height = H * TILE;
  const ctx = c.getContext("2d");
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const t = grid[y][x];
      const z = ZONES[zoneAt(x)];
      const X = x * TILE;
      const Y = y * TILE;
      if (t === T.GROUND) groundTile(ctx, X, Y, z, grid[y - 1]?.[x] !== T.GROUND, x * 31 + y * 7);
      else if (t === T.BRICK) brick(ctx, X, Y, z);
      else if (t === T.PLATFORM) platform(ctx, X, Y, z);
    }
  }
  return c;
}

export function lava(ctx, x, y, t, top) {
  px(ctx, x, y, TILE, TILE, "#c2361b");
  if (top) {
    const k = Math.sin(t / 300 + x / 20);
    px(ctx, x, y + 2 + Math.round(k), TILE, 3, "#ff8a1f");
    px(ctx, x + ((t / 40 + x) % 14), y + 3, 2, 1, "#ffe08a");
  }
}

// --- Skies ------------------------------------------------------------------

function mix(a, b, k) {
  const pa = parseInt(a.slice(1), 16);
  const pb = parseInt(b.slice(1), 16);
  const ch = (s) => Math.round(((pa >> s) & 255) * (1 - k) + ((pb >> s) & 255) * k);
  return `rgb(${ch(16)}, ${ch(8)}, ${ch(0)})`;
}

/** Sky and parallax for the camera's place, in screen space. */
export function drawSky(ctx, w, h, camX, scale, night, t, reduce) {
  const centre = (camX + w / scale / 2) / TILE;
  const zone = zoneAt(Math.floor(centre));
  const z = ZONES[zone];
  // Crossfade towards the next era near a border.
  const ahead = ZONES[zoneAt(Math.floor(centre + 6))];
  let k = 0;
  if (ahead !== z) {
    for (let d = 1; d <= 6; d++) {
      if (ZONES[zoneAt(Math.floor(centre + d))] !== z) {
        k = 1 - d / 7;
        break;
      }
    }
  }
  const sky = night ? z.night : z.sky;
  const sky2 = night ? ahead.night : ahead.sky;
  const g = ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, mix(sky[0], sky2[0], k));
  g.addColorStop(1, mix(sky[1], sky2[1], k));
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);

  // Stars at night, and always in software's digital sky.
  if (night || zone === "software") {
    const r = rng(7);
    for (let i = 0; i < 90; i++) {
      const sx = (r() * w * 2 - camX * scale * 0.05) % w;
      const sy = r() * h * 0.6;
      ctx.fillStyle = `rgba(255,255,255,${0.3 + r() * 0.6})`;
      ctx.fillRect(Math.round(sx < 0 ? sx + w : sx), Math.round(sy), scale, scale);
    }
  }

  // Sun or moon.
  const sunX = w * 0.78;
  const sunY = h * 0.22;
  ctx.fillStyle = night ? "#f4f1d0" : zone === "foundry" ? "#ffcf6a" : zone === "software" ? "#ff6fb5" : "#fff2a8";
  ctx.beginPath();
  ctx.arc(sunX, sunY, 18 * scale, 0, Math.PI * 2);
  ctx.fill();

  const layer = (speed, colour, shape) => {
    ctx.fillStyle = colour;
    const offset = (camX * scale * speed) % (240 * scale);
    for (let i = -1; i < w / (240 * scale) + 2; i++) shape(i * 240 * scale - offset);
  };
  const ground = h - 3 * TILE * scale;

  if (zone === "campus") {
    layer(0.15, z.far, (x) => {
      ctx.beginPath();
      ctx.ellipse(x + 120 * scale, ground, 150 * scale, 70 * scale, 0, Math.PI, 0);
      ctx.fill();
    });
    layer(0.3, z.near, (x) => {
      ctx.beginPath();
      ctx.ellipse(x + 40 * scale, ground, 90 * scale, 40 * scale, 0, Math.PI, 0);
      ctx.fill();
      ctx.fillRect(x + 150 * scale, ground - 50 * scale, 50 * scale, 50 * scale);
      ctx.fillRect(x + 168 * scale, ground - 64 * scale, 14 * scale, 14 * scale);
    });
  } else if (zone === "foundry") {
    layer(0.15, z.far, (x) => {
      ctx.fillRect(x, ground - 60 * scale, 110 * scale, 60 * scale);
      ctx.fillRect(x + 20 * scale, ground - 110 * scale, 14 * scale, 50 * scale);
      ctx.fillRect(x + 70 * scale, ground - 95 * scale, 12 * scale, 35 * scale);
    });
    layer(0.3, z.near, (x) => {
      ctx.fillRect(x + 120 * scale, ground - 40 * scale, 100 * scale, 40 * scale);
      for (let j = 0; j < 5; j++) {
        ctx.fillStyle = `rgba(255, 150, 60, ${0.5 + 0.3 * Math.sin(t / 400 + j)})`;
        ctx.fillRect(x + (130 + j * 18) * scale, ground - 28 * scale, 8 * scale, 6 * scale);
      }
      ctx.fillStyle = z.near;
    });
    // Embers rising.
    if (!reduce) {
      for (let i = 0; i < 24; i++) {
        const ex = ((i * 97 + t * 0.02 * (1 + (i % 3))) % w + w) % w;
        const ey = h - (((t * 0.05 * (1 + (i % 4))) + i * 53) % h);
        ctx.fillStyle = i % 2 ? "#ffcf6a" : "#ff8a1f";
        ctx.fillRect(Math.round(ex), Math.round(ey), scale, scale);
      }
    }
  } else if (zone === "india") {
    layer(0.15, z.far, (x) => {
      ctx.beginPath();
      ctx.moveTo(x, ground);
      ctx.lineTo(x + 80 * scale, ground - 60 * scale);
      ctx.lineTo(x + 160 * scale, ground);
      ctx.fill();
    });
    layer(0.3, z.near, (x) => {
      ctx.fillRect(x + 60 * scale, ground - 50 * scale, 4 * scale, 50 * scale);
      ctx.fillRect(x + 44 * scale, ground - 54 * scale, 36 * scale, 6 * scale);
      ctx.fillRect(x + 150 * scale, ground - 44 * scale, 70 * scale, 44 * scale);
      ctx.fillRect(x + 196 * scale, ground - 74 * scale, 10 * scale, 30 * scale);
    });
  } else if (zone === "snow") {
    layer(0.15, z.far, (x) => {
      ctx.beginPath();
      ctx.moveTo(x, ground);
      ctx.lineTo(x + 100 * scale, ground - 90 * scale);
      ctx.lineTo(x + 200 * scale, ground);
      ctx.fill();
    });
    layer(0.3, z.near, (x) => {
      for (let j = 0; j < 4; j++) {
        const tx = x + (20 + j * 50) * scale;
        ctx.beginPath();
        ctx.moveTo(tx, ground);
        ctx.lineTo(tx + 14 * scale, ground - 50 * scale);
        ctx.lineTo(tx + 28 * scale, ground);
        ctx.fill();
      }
    });
    if (!reduce) {
      ctx.fillStyle = "rgba(255,255,255,0.85)";
      for (let i = 0; i < 70; i++) {
        const sx = ((i * 131 + Math.sin(t / 900 + i) * 30 - camX * scale * 0.4) % w + w) % w;
        const sy = ((t * 0.03 * (1 + (i % 3)) + i * 47) % h);
        ctx.fillRect(Math.round(sx), Math.round(sy), scale, scale);
      }
    }
  } else {
    // Software: a perspective grid and columns of brackets.
    ctx.strokeStyle = "rgba(34, 224, 255, 0.25)";
    ctx.lineWidth = scale;
    const off = (camX * scale * 0.5) % (40 * scale);
    for (let x = -off; x < w; x += 40 * scale) {
      ctx.beginPath();
      ctx.moveTo(x, ground);
      ctx.lineTo(w / 2 + (x - w / 2) * 2.5, h);
      ctx.stroke();
    }
    for (let y = ground; y < h; y += 10 * scale) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }
    ctx.font = `${8 * scale}px 'Press Start 2P', monospace`;
    layer(0.25, "rgba(178, 140, 255, 0.35)", (x) => {
      ["{ }", "</>", "=>", "[ ]", "&&"].forEach((s, j) => ctx.fillText(s, x + j * 48 * scale, ground - (40 + (j % 3) * 30) * scale));
    });
  }
}

// --- Sprites --------------------------------------------------------------

/** The runner: 12 x 16, side view; hard hat through the foundry years. */
export function runner(ctx, x, y, face, frame, air, hat) {
  ctx.save();
  if (face < 0) {
    ctx.translate(x + 12, 0);
    ctx.scale(-1, 1);
    x = 0;
  }
  const legA = air ? 2 : [0, 2, 0, -2][frame];
  px(ctx, x + 3, y + 11, 3, 5 - Math.max(0, legA / 2), "#2b2b40");
  px(ctx, x + 7, y + 11, 3, 5 - Math.max(0, -legA / 2), "#2b2b40");
  px(ctx, x + 2 + legA / 2, y + 15, 4, 1, "#111");
  px(ctx, x + 7 - legA / 2, y + 15, 4, 1, "#111");
  px(ctx, x + 2, y + 6, 8, 6, "#2f6bd6");
  px(ctx, x + 9, y + 7 + (air ? -2 : 0), 3, 2, "#f1c27d");
  px(ctx, x + 3, y, 7, 6, "#f1c27d");
  px(ctx, x + 3, y, 7, 2, "#3b2a1f");
  px(ctx, x + 3, y + 2, 2, 2, "#3b2a1f");
  px(ctx, x + 8, y + 3, 1, 1, "#111");
  if (hat === "hardhat") {
    px(ctx, x + 2, y - 1, 9, 2, "#ffd23f");
    px(ctx, x + 3, y - 3, 7, 2, "#ffd23f");
  } else if (hat === "beanie") {
    px(ctx, x + 3, y - 2, 7, 3, "#c23a2c");
    px(ctx, x + 5, y - 4, 2, 2, "#fff");
  } else if (hat === "cap") {
    px(ctx, x + 1, y - 2, 11, 2, "#111");
    px(ctx, x + 4, y - 1, 5, 2, "#111");
    px(ctx, x + 11, y - 1, 1, 4, "#ffd23f");
  } else if (hat === "headset") {
    px(ctx, x + 2, y - 1, 9, 1, "#22e0ff");
    px(ctx, x + 2, y + 1, 2, 3, "#22e0ff");
  }
  ctx.restore();
}

/** A bug: a little beetle that walks back and forth. */
export function bug(ctx, x, y, t, squashed) {
  if (squashed) {
    px(ctx, x, y + 12, 14, 3, "#7a1f3a");
    return;
  }
  const step = Math.floor(t / 150) % 2;
  px(ctx, x + 2, y + 5, 10, 7, "#e0245e");
  px(ctx, x + 6, y + 5, 1, 7, "#7a1f3a");
  px(ctx, x + 1, y + 6, 2, 4, "#2a0a14");
  px(ctx, x + 3, y + 8, 2, 2, "#ffd23f");
  px(ctx, x + 9, y + 7, 2, 2, "#ffd23f");
  px(ctx, x, y + 3, 1, 3, "#2a0a14");
  px(ctx, x + 2, y + 12 - step, 2, 3, "#2a0a14");
  px(ctx, x + 6, y + 12 - (1 - step), 2, 3, "#2a0a14");
  px(ctx, x + 10, y + 12 - step, 2, 3, "#2a0a14");
}

export function coin(ctx, x, y, t, featured) {
  const k = Math.abs(Math.sin(t / 260 + x));
  const w = Math.max(2, Math.round(8 * k));
  const cx = x + 4 - w / 2;
  px(ctx, cx, y, w, 12, featured ? "#ff6fb5" : "#ffd23f");
  px(ctx, cx + w / 2 - 1, y + 2, Math.min(2, w), 8, featured ? "#ffd1e8" : "#fff2a8");
  px(ctx, cx, y + 11, w, 1, featured ? "#a02a6a" : "#b88a10");
}

export function flag(ctx, x, y, reached, t) {
  px(ctx, x + 7, y - 64, 2, 64, "#e6e6e6");
  px(ctx, x + 6, y - 66, 4, 3, "#ffd23f");
  const wave = Math.round(Math.sin(t / 200) * 1);
  px(ctx, x + 9, y - 62 + wave, 14, 9, reached ? "#2bd47d" : "#e0245e");
  px(ctx, x + 9, y - 54 + wave, 10, 3, reached ? "#1f9a5a" : "#a01a40");
  px(ctx, x + 3, y - 4, 10, 4, "#6a6f7a");
}

export function goal(ctx, x, y, t) {
  // Today: an office tower with a lit window per year since 2023.
  px(ctx, x, y - 112, 64, 112, "#2d3b55");
  px(ctx, x - 4, y - 116, 72, 6, "#1b2335");
  for (let j = 0; j < 6; j++) for (let i = 0; i < 4; i++) px(ctx, x + 8 + i * 13, y - 104 + j * 15, 8, 9, (i + j + Math.floor(t / 600)) % 5 ? "#7fe3ff" : "#ffd23f");
  px(ctx, x + 24, y - 22, 16, 22, "#111a2e");
  px(ctx, x + 26, y - 20, 12, 20, "#7fe3ff");
  px(ctx, x + 30, y - 132, 2, 16, "#cfe3ff");
  px(ctx, x + 32, y - 132, 14, 8, "#ff6fb5");
}

export const LEVEL_PIXEL_WIDTH = W * TILE;
export const GOAL_PIXEL_X = GOAL_X * TILE;
