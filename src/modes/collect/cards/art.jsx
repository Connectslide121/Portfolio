import React, { useId } from "react";
import { rng } from "./rng";
import { orgById } from "../../../data/orgLogos";
import { mediaFor } from "../../../data/projectMedia";
import ProjectMedia from "../components/ProjectMedia";
import desk from "../../../images/home-image.webp";

// The art window of every card, drawn in code. Each scene is an SVG on a
// 100 x 70 canvas; ids are prefixed per instance so two copies of a card on
// screen do not share gradients.

const seedOf = (s) => [...String(s)].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);

function Sparks({ n, seed, x, y, w, h, colour = "#ffd36b" }) {
  const r = rng(seed);
  return Array.from({ length: n }, (_, i) => (
    <circle key={i} cx={x + r() * w} cy={y + r() * h} r={0.3 + r() * 0.9} fill={colour} opacity={0.4 + r() * 0.6} />
  ));
}

/* ---- Career scenes ------------------------------------------------------ */

function Steel({ id }) {
  return (
    <>
      <defs>
        <linearGradient id={`${id}bg`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1b0703" />
          <stop offset="1" stopColor="#5e1906" />
        </linearGradient>
        <linearGradient id={`${id}pour`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff6c2" />
          <stop offset=".5" stopColor="#ffb02e" />
          <stop offset="1" stopColor="#ff5a1f" />
        </linearGradient>
        <radialGradient id={`${id}glow`}>
          <stop offset="0" stopColor="#ffb547" stopOpacity=".9" />
          <stop offset="1" stopColor="#ff5a1f" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="100" height="70" fill={`url(#${id}bg)`} />
      {/* The shop: roof trusses and a crane rail */}
      <path d="M0 14 L50 4 L100 14" stroke="#3a1206" strokeWidth="2" fill="none" />
      {[10, 30, 50, 70, 90].map((x) => (
        <path key={x} d={`M${x} ${14 - (x < 50 ? x / 5 : (100 - x) / 5) + 2} V18`} stroke="#3a1206" strokeWidth="1.2" />
      ))}
      <rect x="0" y="18" width="100" height="2" fill="#2a0c04" />
      <ellipse cx="68" cy="58" rx="34" ry="14" fill={`url(#${id}glow)`} />
      {/* Ladle on the crane hook, tipped toward the mould */}
      <path d="M30 20 V24" stroke="#1a0803" strokeWidth="1.6" />
      <path d="M17 34 Q30 18 43 30" stroke="#1a0803" strokeWidth="1.6" fill="none" />
      <path d="M15 31 L45 27 L42 46 Q30 54 19 48 Z" fill="#2b1a14" stroke="#120604" strokeWidth="1" />
      <path d="M15 31 L45 27" stroke="#ffcf5c" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M45 27 l4 -1 l-2 3 z" fill="#2b1a14" />
      {/* The pour */}
      <path d="M48 27 C 54 34, 57 44, 57 56 L 60.5 56 C 60 43, 56 32, 49 26 Z" fill={`url(#${id}pour)`} />
      {/* Mould boxes on the floor */}
      <rect x="48" y="56" width="40" height="10" fill="#3b2a22" stroke="#1a0f0b" />
      <rect x="54" y="54" width="8" height="3" rx="1" fill="#ffcf5c" />
      <rect x="0" y="66" width="100" height="4" fill="#1a0803" />
      <Sparks n={26} seed={11} x={50} y={36} w={22} h={22} />
    </>
  );
}

function Cast({ id }) {
  return (
    <>
      <defs>
        <linearGradient id={`${id}sand`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c99a5b" />
          <stop offset="1" stopColor="#8a5d2c" />
        </linearGradient>
        <radialGradient id={`${id}hot`}>
          <stop offset="0" stopColor="#fff2b0" />
          <stop offset=".6" stopColor="#ff9b2f" />
          <stop offset="1" stopColor="#d43d0d" />
        </radialGradient>
      </defs>
      <rect width="100" height="70" fill="#3b2614" />
      {/* Cope and drag: two flasks of rammed sand */}
      <rect x="8" y="10" width="84" height="25" fill={`url(#${id}sand)`} stroke="#2a1a0c" strokeWidth="1.5" />
      <rect x="8" y="35" width="84" height="25" fill={`url(#${id}sand)`} stroke="#2a1a0c" strokeWidth="1.5" />
      <Sparks n={90} seed={5} x={8} y={10} w={84} h={50} colour="#6b4520" />
      {/* Sprue and the gear-shaped cavity, full of metal */}
      <rect x="24" y="10" width="5" height="26" fill={`url(#${id}hot)`} />
      <rect x="24" y="33" width="18" height="4" fill={`url(#${id}hot)`} />
      <g transform="translate(60 35)">
        {Array.from({ length: 10 }, (_, i) => (
          <rect key={i} x="-3" y="-17" width="6" height="7" fill={`url(#${id}hot)`} transform={`rotate(${i * 36})`} />
        ))}
        <circle r="12" fill={`url(#${id}hot)`} />
        <circle r="4" fill="#8a5d2c" />
      </g>
      <rect x="4" y="60" width="92" height="6" fill="#2a1a0c" />
    </>
  );
}

function Polymers({ id }) {
  const hex = (cx, cy, s) =>
    Array.from({ length: 6 }, (_, i) => {
      const a = (Math.PI / 3) * i + Math.PI / 6;
      return `${cx + Math.cos(a) * s},${cy + Math.sin(a) * s}`;
    }).join(" ");
  const rings = [
    [18, 40],
    [34, 31],
    [50, 40],
    [66, 31],
    [82, 40],
  ];
  return (
    <>
      <defs>
        <linearGradient id={`${id}bg`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#0f4c45" />
          <stop offset="1" stopColor="#1f8a6e" />
        </linearGradient>
      </defs>
      <rect width="100" height="70" fill={`url(#${id}bg)`} />
      <Sparks n={30} seed={3} x={0} y={0} w={100} h={70} colour="#a9f5d6" />
      {rings.map(([x, y], i) => (
        <g key={i}>
          {i > 0 && <line x1={rings[i - 1][0]} y1={rings[i - 1][1]} x2={x} y2={y} stroke="#d7fff0" strokeWidth="1.2" />}
          <polygon points={hex(x, y, 8)} fill="rgb(255 255 255 / 0.08)" stroke="#d7fff0" strokeWidth="1.3" />
          <circle cx={x} cy={y} r="3" fill="none" stroke="#9cf0cf" strokeWidth=".8" />
        </g>
      ))}
      {rings.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y + (i % 2 ? -12 : 12)} r="2.2" fill="#ffe08a" />
      ))}
      <text x="50" y="64" textAnchor="middle" fontSize="6" fill="#d7fff0" fontFamily="Georgia, serif" fontStyle="italic">
        (C₂H₄)ₙ
      </text>
    </>
  );
}

function Snow({ id }) {
  const r = rng(17);
  return (
    <>
      <defs>
        <linearGradient id={`${id}bg`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0e1d3f" />
          <stop offset="1" stopColor="#3a5d9a" />
        </linearGradient>
        <radialGradient id={`${id}screen`}>
          <stop offset="0" stopColor="#b9a4ff" stopOpacity=".7" />
          <stop offset="1" stopColor="#b9a4ff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="100" height="70" fill={`url(#${id}bg)`} />
      {/* Northern lights */}
      <path d="M0 18 C 25 6, 45 26, 70 12 S 100 14, 100 14" stroke="#5ff2c0" strokeWidth="4" fill="none" opacity=".35" />
      <path d="M86 6 a6 6 0 1 0 6 8 a5 5 0 1 1 -6 -8" fill="#f4f1d0" />
      {[8, 20, 84, 94].map((x, i) => (
        <path key={x} d={`M${x} ${50 - i} l6 ${14 + i} h-12 z M${x} ${42 - i} l5 ${12} h-10 z`} fill="#0d2a33" />
      ))}
      <path d="M0 60 C 30 50, 70 50, 100 58 V70 H0 Z" fill="#e8f1ff" />
      <ellipse cx="50" cy="44" rx="24" ry="14" fill={`url(#${id}screen)`} />
      {/* A laptop, the course's only tool */}
      <rect x="35" y="30" width="30" height="19" rx="1.5" fill="#1b1533" stroke="#cfd8ff" strokeWidth="1" />
      <text x="50" y="43" textAnchor="middle" fontSize="9" fontWeight="700" fill="#b9a4ff" fontFamily="monospace">
        C#
      </text>
      <path d="M31 49 h38 l3 4 h-44 z" fill="#cfd8ff" />
      {Array.from({ length: 36 }, (_, i) => (
        <circle key={i} cx={r() * 100} cy={r() * 60} r={0.4 + r() * 0.8} fill="#fff" opacity={0.5 + r() * 0.5} />
      ))}
    </>
  );
}

function Vectors({ id }) {
  const r = rng(29);
  const pts = Array.from({ length: 40 }, () => {
    const c = r() < 0.5 ? [64, 24] : [36, 44];
    return [c[0] + (r() - 0.5) * 22, c[1] + (r() - 0.5) * 16];
  });
  return (
    <>
      <defs>
        <linearGradient id={`${id}bg`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#120a35" />
          <stop offset="1" stopColor="#2b1670" />
        </linearGradient>
      </defs>
      <rect width="100" height="70" fill={`url(#${id}bg)`} />
      {Array.from({ length: 11 }, (_, i) => (
        <g key={i} stroke="rgb(160 140 255 / 0.15)" strokeWidth=".4">
          <line x1={i * 10} y1="0" x2={i * 10} y2="70" />
          <line x1="0" y1={i * 7} x2="100" y2={i * 7} />
        </g>
      ))}
      {pts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="1.3" fill={i % 2 ? "#5fe3ff" : "#ff7bd5"} opacity=".85" />
      ))}
      {/* Two embeddings and the angle between them */}
      <line x1="12" y1="62" x2="66" y2="22" stroke="#ffe08a" strokeWidth="1.6" />
      <line x1="12" y1="62" x2="78" y2="44" stroke="#ffe08a" strokeWidth="1.6" />
      <circle cx="66" cy="22" r="2.4" fill="#ffe08a" />
      <circle cx="78" cy="44" r="2.4" fill="#ffe08a" />
      <path d="M32 47 A 22 22 0 0 1 34 56" stroke="#fff" strokeWidth="1" fill="none" />
      <text x="37" y="53" fontSize="5.5" fill="#fff" fontFamily="Georgia, serif" fontStyle="italic">
        cos θ
      </text>
    </>
  );
}

function Systems({ id }) {
  const nodes = [
    [50, 14, "UI"],
    [20, 34, "API"],
    [50, 34, "AI"],
    [80, 34, "SDK"],
    [32, 56, "DB"],
    [68, 56, "RAG"],
  ];
  const edges = [
    [0, 1],
    [0, 2],
    [0, 3],
    [1, 4],
    [2, 4],
    [2, 5],
    [3, 5],
  ];
  return (
    <>
      <defs>
        <linearGradient id={`${id}bg`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#081a3a" />
          <stop offset="1" stopColor="#123f7a" />
        </linearGradient>
        <radialGradient id={`${id}node`}>
          <stop offset="0" stopColor="#7ff3ff" />
          <stop offset="1" stopColor="#2a8cff" />
        </radialGradient>
      </defs>
      <rect width="100" height="70" fill={`url(#${id}bg)`} />
      <Sparks n={30} seed={41} x={0} y={0} w={100} h={70} colour="#7ff3ff" />
      {edges.map(([a, b], i) => (
        <line key={i} x1={nodes[a][0]} y1={nodes[a][1]} x2={nodes[b][0]} y2={nodes[b][1]} stroke="#7ff3ff" strokeWidth="1" strokeDasharray="2 1.5" />
      ))}
      {nodes.map(([x, y, label]) => (
        <g key={label}>
          <rect x={x - 9} y={y - 5} width="18" height="10" rx="2.5" fill={`url(#${id}node)`} stroke="#e8fbff" strokeWidth=".8" />
          <text x={x} y={y + 2.2} textAnchor="middle" fontSize="5.5" fontWeight="700" fill="#06213f" fontFamily="system-ui, sans-serif">
            {label}
          </text>
        </g>
      ))}
    </>
  );
}

function India({ id }) {
  return (
    <>
      <defs>
        <linearGradient id={`${id}bg`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ff9d4d" />
          <stop offset=".6" stopColor="#ffcf7a" />
          <stop offset="1" stopColor="#f2a65a" />
        </linearGradient>
      </defs>
      <rect width="100" height="70" fill={`url(#${id}bg)`} />
      <circle cx="72" cy="38" r="15" fill="#fff1c4" />
      {/* 8000 km, Spain to Coimbatore */}
      <path d="M6 30 Q 50 -6, 92 22" stroke="#7a2b10" strokeWidth="1" strokeDasharray="2 2" fill="none" />
      <path d="M86 17 l6 5 l-7 1 z" fill="#7a2b10" />
      <circle cx="6" cy="30" r="1.8" fill="#7a2b10" />
      {/* The plant */}
      <path d="M8 66 V44 l10 -6 v6 l10 -6 v6 l10 -6 v28 z" fill="#5a2412" />
      <rect x="44" y="28" width="5" height="38" fill="#5a2412" />
      <rect x="53" y="34" width="4" height="32" fill="#5a2412" />
      <path d="M46 26 c 4 -6, 10 -4, 12 -10" stroke="#fff6e6" strokeWidth="2.5" fill="none" opacity=".7" strokeLinecap="round" />
      {[14, 24, 34].map((x) => (
        <rect key={x} x={x} y="52" width="4" height="4" fill="#ffd36b" />
      ))}
      {/* A palm, because Coimbatore */}
      <path d="M84 66 C 84 56, 86 50, 88 44" stroke="#3c1a0c" strokeWidth="2" fill="none" />
      <path d="M88 44 c -8 -2, -12 2, -14 6 M88 44 c 6 -4, 10 -2, 12 2 M88 44 c -2 -6, -8 -8, -12 -8 M88 44 c 2 -6, 6 -8, 10 -8" stroke="#3c1a0c" strokeWidth="1.6" fill="none" />
      <rect x="0" y="66" width="100" height="4" fill="#5a2412" />
    </>
  );
}

const MATERIAL = (m) => {
  const s = String(m).toLowerCase();
  if (s.includes("vector")) return Vectors;
  if (s.includes("system")) return Systems;
  if (s.includes("cast")) return Cast;
  if (s.includes("polymer")) return Polymers;
  if (s.includes("c#")) return Snow;
  return Steel;
};

/* ---- Chapters ------------------------------------------------------------ */

const EMBLEM = {
  steel: (
    <path d="M50 14 C 62 28, 66 36, 62 46 C 60 52, 54 56, 50 56 C 44 56, 37 51, 37 43 C 37 37, 41 33, 44 30 C 44 36, 47 39, 50 39 C 49 31, 45 24, 50 14 Z" fill="#fff1c4" />
  ),
  reset: (
    <g stroke="#ffffff" strokeWidth="2.6" strokeLinecap="round" fill="none">
      {[0, 60, 120].map((a) => (
        <g key={a} transform={`rotate(${a} 50 35)`}>
          <path d="M50 15 V55" />
          <path d="M44 20 l6 5 l6 -5 M44 50 l6 -5 l6 5" />
        </g>
      ))}
    </g>
  ),
  software: (
    <text x="50" y="45" textAnchor="middle" fontSize="28" fontWeight="800" fill="#ffffff" fontFamily="ui-monospace, monospace">
      {"</>"}
    </text>
  ),
};

const CHAPTER_BG = { steel: ["#ff6a1a", "#7a1a05"], reset: ["#8fd3ff", "#244a8a"], software: ["#6be7ff", "#2a1670"] };

function Chapter({ id, chapter }) {
  const [a, b] = CHAPTER_BG[chapter] || CHAPTER_BG.software;
  return (
    <>
      <defs>
        <radialGradient id={`${id}bg`} cx=".5" cy=".5" r=".75">
          <stop offset="0" stopColor={a} />
          <stop offset="1" stopColor={b} />
        </radialGradient>
      </defs>
      <rect width="100" height="70" fill={`url(#${id}bg)`} />
      {Array.from({ length: 24 }, (_, i) => (
        <path key={i} d="M50 35 L48.5 -40 L51.5 -40 Z" fill="#fff" opacity=".12" transform={`rotate(${i * 15} 50 35)`} />
      ))}
      <circle cx="50" cy="35" r="24" fill="rgb(0 0 0 / 0.18)" stroke="#fff" strokeOpacity=".6" />
      {EMBLEM[chapter]}
    </>
  );
}

/* ---- Projects and tools -------------------------------------------------- */

const GLYPH = {
  game: <path d="M30 30 h40 a10 10 0 0 1 0 20 c-6 0 -8 -6 -12 -6 h-16 c-4 0 -6 6 -12 6 a10 10 0 0 1 0 -20 z M36 36 v8 M32 40 h8" stroke="#fff" strokeWidth="2.2" fill="rgb(255 255 255 / 0.12)" strokeLinejoin="round" />,
  npm: <path d="M50 22 l18 9 v18 l-18 9 l-18 -9 v-18 z M32 31 l18 9 l18 -9 M50 40 v18" stroke="#fff" strokeWidth="2.2" fill="rgb(255 255 255 / 0.12)" strokeLinejoin="round" />,
  api: (
    <text x="50" y="47" textAnchor="middle" fontSize="22" fontWeight="800" fill="#fff" fontFamily="ui-monospace, monospace">
      {"{ }"}
    </text>
  ),
  console: (
    <text x="50" y="47" textAnchor="middle" fontSize="22" fontWeight="800" fill="#fff" fontFamily="ui-monospace, monospace">
      {">_"}
    </text>
  ),
  app: <path d="M30 26 h40 v28 h-40 z M30 32 h40 M36 38 h12 v10 h-12 z M52 38 h12 M52 43 h12 M52 48 h8" stroke="#fff" strokeWidth="2" fill="rgb(255 255 255 / 0.12)" />,
};

const glyphFor = (category) => {
  const c = category.toLowerCase();
  if (c.includes("game")) return GLYPH.game;
  if (c.includes("npm")) return GLYPH.npm;
  if (c.includes("api")) return GLYPH.api;
  if (c.includes("console")) return GLYPH.console;
  return GLYPH.app;
};

function ProjectScreen({ id, title, category }) {
  const r = rng(seedOf(title));
  const hue = Math.floor(r() * 360);
  return (
    <>
      <defs>
        <linearGradient id={`${id}bg`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={`hsl(${hue} 70% 45%)`} />
          <stop offset="1" stopColor={`hsl(${(hue + 60) % 360} 70% 25%)`} />
        </linearGradient>
      </defs>
      <rect width="100" height="70" fill={`url(#${id}bg)`} />
      {Array.from({ length: 8 }, (_, i) => (
        <rect key={i} x={r() * 90} y={r() * 60} width={6 + r() * 20} height={2 + r() * 3} rx="1" fill="#fff" opacity={0.08 + r() * 0.1} />
      ))}
      <rect x="6" y="5" width="88" height="6" rx="2" fill="rgb(0 0 0 / 0.25)" />
      {["#ff6159", "#ffbd2e", "#28c941"].map((c, i) => (
        <circle key={c} cx={10 + i * 4} cy="8" r="1.3" fill={c} />
      ))}
      {glyphFor(category)}
      <text x="50" y="64" textAnchor="middle" fontSize={Math.min(6, 130 / title.length)} fontWeight="700" fill="#fff" opacity=".85" fontFamily="system-ui, sans-serif" letterSpacing=".5">
        {title.toUpperCase()}
      </text>
    </>
  );
}

/** The art window for any card. `live` plays project videos (big views only). */
export default function Art({ card, live = false }) {
  const raw = useId();
  const id = `a${raw.replace(/:/g, "")}`;
  const a = card.art;

  if (a.kind === "hero") {
    return (
      <div className="art art-hero">
        <img src={desk} alt="An isometric developer's desk" />
      </div>
    );
  }

  if (a.kind === "tool") {
    return (
      <div className="art art-tool">
        <span className="art-tool-plate">
          <img src={a.image} alt={a.alt} loading="lazy" />
        </span>
      </div>
    );
  }

  if (a.kind === "project") {
    const media = mediaFor(a.title);
    if (live) {
      // The drawn screen sits under the clip, so there is something to look
      // at while a large video loads.
      return (
        <div className="art art-media">
          {media.type === "video" && (
            <svg className="art-under" viewBox="0 0 100 70" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
              <ProjectScreen id={id} title={a.title} category={a.category} />
            </svg>
          )}
          <ProjectMedia title={a.title} className="art-fill" />
        </div>
      );
    }
    if (media.type === "image") {
      return (
        <div className="art art-media">
          <img className="art-fill" src={media.src} alt={a.title} loading="lazy" />
        </div>
      );
    }
    return (
      <svg className="art" viewBox="0 0 100 70" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <ProjectScreen id={id} title={a.title} category={a.category} />
      </svg>
    );
  }

  const org = a.org && orgById(a.org);
  const Scene = a.kind === "material" ? MATERIAL(a.material) : null;
  return (
    <div className="art">
      <svg viewBox="0 0 100 70" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        {Scene && <Scene id={id} />}
        {a.kind === "chapter" && <Chapter id={id} chapter={a.id} />}
        {a.kind === "india" && <India id={id} />}
      </svg>
      {org && (
        <span className={`art-org tone-${org.tone}`}>
          <img src={org.src} alt={org.label} loading="lazy" />
        </span>
      )}
    </div>
  );
}

/** The back of every card. */
export function CardBack() {
  const raw = useId();
  const id = `b${raw.replace(/:/g, "")}`;
  return (
    <svg className="card-back-art" viewBox="0 0 63 88" aria-hidden="true">
      <defs>
        <radialGradient id={`${id}bg`} cx=".5" cy=".45" r=".7">
          <stop offset="0" stopColor="#5b34d6" />
          <stop offset="1" stopColor="#150a45" />
        </radialGradient>
        <linearGradient id={`${id}gold`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff1b8" />
          <stop offset=".5" stopColor="#e3a92b" />
          <stop offset="1" stopColor="#9b6413" />
        </linearGradient>
        <pattern id={`${id}p`} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="6" height="6" fill="none" />
          <path d="M0 3 h6" stroke="#fff" strokeOpacity=".07" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="63" height="88" rx="3.5" fill={`url(#${id}gold)`} />
      <rect x="2.5" y="2.5" width="58" height="83" rx="2.5" fill={`url(#${id}bg)`} />
      <rect x="2.5" y="2.5" width="58" height="83" rx="2.5" fill={`url(#${id}p)`} />
      {Array.from({ length: 16 }, (_, i) => (
        <path key={i} d="M31.5 44 L30.8 4 L32.2 4 Z" fill="#fff" opacity=".07" transform={`rotate(${i * 22.5} 31.5 44)`} />
      ))}
      <ellipse cx="31.5" cy="44" rx="20" ry="27" fill="none" stroke={`url(#${id}gold)`} strokeWidth="1.4" />
      <ellipse cx="31.5" cy="44" rx="16.5" ry="23.5" fill="rgb(0 0 0 / 0.25)" stroke={`url(#${id}gold)`} strokeWidth=".5" />
      <text x="31.5" y="50" textAnchor="middle" fontSize="17" fontWeight="800" fill={`url(#${id}gold)`} fontFamily="Cinzel, Georgia, serif">
        JM
      </text>
      <text x="31.5" y="58" textAnchor="middle" fontSize="3.2" letterSpacing=".9" fill="#ffe08a" fontFamily="Cinzel, Georgia, serif">
        CAREER · TCG
      </text>
      <path d="M31.5 25 l1.4 2.9 3.2 .5 -2.3 2.2 .5 3.2 -2.8 -1.5 -2.8 1.5 .5 -3.2 -2.3 -2.2 3.2 -.5 z" fill={`url(#${id}gold)`} />
    </svg>
  );
}
