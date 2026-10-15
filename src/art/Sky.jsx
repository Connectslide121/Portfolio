import React, { useEffect, useRef } from "react";

/**
 * The sky behind the page. Stars turn slowly around a pole off the top
 * right of the screen; scrolling turns them further, so reading down the
 * page is watching the night go by. Every so often a meteor. On the atlas
 * (light) theme the same stars are printed in ink over a faint graticule.
 */
const rand = (a, b) => a + Math.random() * (b - a);

export default function Sky() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let W = 0;
    let H = 0;
    let stars = [];
    let frame = 0;
    let meteor = null;
    let nextMeteor = performance.now() + rand(3000, 8000);

    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const reach = Math.hypot(W, H) * 1.3;
      const count = Math.min(1100, Math.round((W * H) / 1700));
      stars = Array.from({ length: count }, () => {
        const r = Math.sqrt(Math.random()) * reach;
        const big = Math.random() < 0.04;
        return {
          a: Math.random() * Math.PI * 2,
          r,
          size: big ? rand(1.3, 2.2) : rand(0.3, 1.1),
          tw: Math.random() * Math.PI * 2,
          speed: rand(0.6, 1.8),
          hue: Math.random() < 0.15 ? "warm" : Math.random() < 0.3 ? "cool" : "white",
        };
      });
    };

    const draw = (t) => {
      const atlas = !document.body.classList.contains("dark-theme");
      const px = W * 0.86;
      const py = -H * 0.18;
      const turn = t * 0.000012 + window.scrollY * 0.00035;

      ctx.clearRect(0, 0, W, H);

      if (atlas) {
        // Graticule: circles of declination and hour lines around the pole.
        ctx.strokeStyle = "rgba(60, 44, 24, 0.09)";
        ctx.lineWidth = 1;
        for (let r = 220; r < Math.hypot(W, H) * 1.4; r += 220) {
          ctx.beginPath();
          ctx.arc(px, py, r, 0, Math.PI * 2);
          ctx.stroke();
        }
        for (let i = 0; i < 24; i++) {
          const a = (i / 24) * Math.PI * 2 + turn;
          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(px + Math.cos(a) * 4000, py + Math.sin(a) * 4000);
          ctx.stroke();
        }
      }

      for (const s of stars) {
        const a = s.a + turn;
        const x = px + Math.cos(a) * s.r;
        const y = py + Math.sin(a) * s.r;
        if (x < -4 || y < -4 || x > W + 4 || y > H + 4) continue;
        const twinkle = reduce ? 1 : 0.65 + 0.35 * Math.sin(t * 0.002 * s.speed + s.tw);
        if (atlas) {
          ctx.fillStyle = `rgba(40, 28, 14, ${0.25 + 0.5 * (s.size / 2.2)})`;
        } else {
          const c = s.hue === "warm" ? "255, 214, 170" : s.hue === "cool" ? "180, 210, 255" : "240, 244, 255";
          ctx.fillStyle = `rgba(${c}, ${twinkle * (0.35 + 0.65 * (s.size / 2.2))})`;
        }
        ctx.beginPath();
        ctx.arc(x, y, s.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // A meteor now and then, on the night sky only.
      if (!atlas && !reduce) {
        if (!meteor && t > nextMeteor) {
          meteor = { x: rand(W * 0.2, W), y: rand(0, H * 0.4), vx: -rand(7, 11), vy: rand(3, 5), life: 0 };
        }
        if (meteor) {
          meteor.life++;
          meteor.x += meteor.vx;
          meteor.y += meteor.vy;
          const g = ctx.createLinearGradient(meteor.x, meteor.y, meteor.x - meteor.vx * 12, meteor.y - meteor.vy * 12);
          g.addColorStop(0, "rgba(255,255,255,0.9)");
          g.addColorStop(1, "rgba(255,255,255,0)");
          ctx.strokeStyle = g;
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          ctx.moveTo(meteor.x, meteor.y);
          ctx.lineTo(meteor.x - meteor.vx * 12, meteor.y - meteor.vy * 12);
          ctx.stroke();
          if (meteor.life > 60) {
            meteor = null;
            nextMeteor = t + rand(5000, 12000);
          }
        }
      }
    };

    const loop = (t) => {
      draw(t);
      frame = requestAnimationFrame(loop);
    };

    const onResize = () => {
      resize();
      if (reduce) draw(0);
    };
    resize();
    window.addEventListener("resize", onResize);
    let onScroll;
    if (reduce) {
      // Still: draw once, and again when the page moves or the theme flips.
      draw(0);
      onScroll = () => requestAnimationFrame(() => draw(0));
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("jm-theme-change", onScroll);
    } else {
      frame = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", onResize);
      if (onScroll) {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("jm-theme-change", onScroll);
      }
    };
  }, []);

  return <canvas ref={ref} className="sky" aria-hidden="true" />;
}
