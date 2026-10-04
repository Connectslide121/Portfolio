import React from "react";
import { BASE } from "./config";
import { logoFor } from "../data/techLogos";
import { blob, hill, scatter } from "./print";

// Every place is authored as coordinates — no drawing tool, no raster assets
// (D7). Each scene fits local 0..1080, to the right of the beat card.
//
// THE PRINT GRAMMAR. Each place is a poster, not an illustration, and is built
// from three plates and nothing else:
//
//   1. PASTEL — two or three big, slightly irregular discs and fields that
//      overprint each other (.j-print: multiply on paper, screen on ink), so
//      where they overlap a third colour appears for free.
//   2. KEY — ONE solid silhouette in var(--j-mid) that says what the place
//      is. Flat, no gradient, no rim light: on a print the key plate is the
//      darkest, crispest thing on the sheet and the contrast is the point.
//   3. HAIRLINE — drafting marks in the same key ink at 1-1.5 units: a
//      dotted orbit, a dimension line, specks. They are what make it read as
//      designed rather than drawn.
//
// The pastels are fixed per place (from the print system in styles.css) and
// do NOT ride the heat: each place keeps its own colours, so the recap's
// laid-out view shows the arc warm -> cool by itself. The key plate does
// ride it (var(--j-mid)), which is what the depth haze and the overview
// blend in timeline.js write to.

const KEY = "var(--j-mid)";

/** Pastel plate. A disc as a print lands it. */
const Disc = ({ cx, cy, r, tint, seed = 1, amount = 0.028, opacity }) => (
  <path className="j-print" d={blob(cx, cy, r, seed, amount)} fill={tint} opacity={opacity} />
);

/** A dotted orbit — the hairline that turns a coloured circle into a mark. */
const Orbit = ({ cx, cy, r, opacity = 0.7 }) => (
  <circle
    cx={cx}
    cy={cy}
    r={r}
    fill="none"
    stroke={KEY}
    strokeWidth="1.1"
    strokeDasharray="2 7"
    strokeLinecap="round"
    opacity={opacity}
  />
);

/** Specks of key ink scattered over a box — sparks, snow, dust, stars. */
const Specks = ({ x, y, w, h, n, seed = 0, r = 1.8 }) => (
  <g fill={KEY}>
    {Array.from({ length: n }).map((_, i) => (
      <circle
        key={i}
        cx={(x + scatter(i, seed) * w).toFixed(1)}
        cy={(y + scatter(i, seed + 1) * h).toFixed(1)}
        r={(r * (0.6 + scatter(i, seed + 2) * 0.8)).toFixed(2)}
      />
    ))}
  </g>
);

/**
 * A dimension line, as on an engineering drawing: two extension ticks, the
 * line between them with arrowheads, and the figure written over it.
 */
const Dimension = ({ x1, x2, y, label }) => (
  <g stroke={KEY} strokeWidth="1.1" fill="none" opacity="0.75">
    <path d={`M ${x1} ${y - 12} V ${y + 12} M ${x2} ${y - 12} V ${y + 12} M ${x1} ${y} H ${x2}`} />
    <path d={`M ${x1 + 10} ${y - 4} L ${x1} ${y} L ${x1 + 10} ${y + 4} M ${x2 - 10} ${y - 4} L ${x2} ${y} L ${x2 - 10} ${y + 4}`} />
    <text
      x={(x1 + x2) / 2}
      y={y - 10}
      textAnchor="middle"
      stroke="none"
      fill={KEY}
      fontSize="15"
      letterSpacing="1.5"
      style={{ fontFamily: "var(--sans)" }}
    >
      {label}
    </text>
  </g>
);

/** A small person, as the key plate prints one: a head and a rounded body. */
const Figure = ({ x, base = BASE, s = 1 }) => (
  <g fill={KEY}>
    <circle cx={x} cy={base - 50 * s} r={10 * s} />
    <path
      d={`M ${x - 15 * s} ${base} V ${base - 22 * s} Q ${x - 15 * s} ${base - 37 * s} ${x} ${base - 37 * s} Q ${x + 15 * s} ${base - 37 * s} ${x + 15 * s} ${base - 22 * s} V ${base} Z`}
    />
  </g>
);

/* ------------------------------------------------------------------------ */

/**
 * 2005-2010 — engineering studies. A classical faculty front under a drafting
 * compass: the place where "how things are made" was learned. The polymer
 * chain in the sky is the first degree, the dimension line the second.
 */
export function Origin({ ax }) {
  const X = (x) => ax + x;
  const cols = [0, 1, 2, 3, 4, 5].map((i) => X(352 + i * 74));
  return (
    <g>
      <Disc cx={X(620)} cy={560} r={210} tint="var(--butter)" seed={2} />
      <Disc cx={X(810)} cy={455} r={128} tint="var(--lilac)" seed={5} />
      <Disc cx={X(330)} cy={650} r={96} tint="var(--sage)" seed={8} />
      <Orbit cx={X(620)} cy={560} r={258} />

      {/* the faculty: pediment, entablature, six columns, steps */}
      <g fill={KEY}>
        <path d={`M ${X(318)} 548 L ${X(560)} 446 L ${X(802)} 548 Z`} />
        <rect x={X(318)} y="556" width="484" height="26" />
        {cols.map((x) => (
          <rect key={x} x={x} y="590" width="34" height="196" />
        ))}
        <rect x={X(300)} y="786" width="520" height="18" />
        <rect x={X(282)} y="808" width="556" height="18" />
        <rect x={X(264)} y="830" width="592" height="18" />
      </g>
      {/* the tympanum's round window, cut back to the paper */}
      <circle cx={X(560)} cy={514} r={15} fill="var(--j-sky1)" />

      <Dimension x1={X(318)} x2={X(802)} y={400} label="484" />

      {/* polymer chain — three linked rings, hairline */}
      <g fill="none" stroke={KEY} strokeWidth="1.4" opacity="0.8">
        {[0, 1, 2].map((i) => {
          const cx = X(880) + i * 46;
          const cy = 300 + (i % 2) * 26;
          const pts = Array.from({ length: 6 }).map((_, k) => {
            const a = (Math.PI / 3) * k + Math.PI / 6;
            return `${(cx + Math.cos(a) * 26).toFixed(1)},${(cy + Math.sin(a) * 26).toFixed(1)}`;
          });
          return <polygon key={i} points={pts.join(" ")} />;
        })}
      </g>
      <Specks x={X(60)} y={300} w={240} h={220} n={7} seed={3} r={1.6} />
    </g>
  );
}

/**
 * 2011-2023 — the steel foundry.
 *
 * The furnace is two overprinted discs; the hall is the key plate with a
 * north-light roof; the pour runs from a tipped ladle into a hatched sand
 * mould, and is the only thing in the frame that moves.
 */
export function Foundry({ ax }) {
  const X = (x) => ax + x;
  const POUR = `M ${X(796)} 597 C ${X(770)} 640 ${X(752)} 700 ${X(746)} 800`;
  return (
    <g>
      <Disc cx={X(640)} cy={520} r={250} tint="var(--apricot)" seed={1} />
      <Disc cx={X(820)} cy={640} r={150} tint="var(--butter)" seed={4} />
      <Disc cx={X(250)} cy={400} r={95} tint="var(--rose)" seed={7} />
      <Orbit cx={X(640)} cy={520} r={300} />
      {/* halftone over the top half of the furnace, like a tint screen */}
      <path d={blob(X(640), 520, 250, 1, 0.028)} fill="url(#jDotsFine)" opacity="0.16" style={{ clipPath: "inset(0 0 50% 0)" }} />

      {/* sand floor */}
      <rect className="j-print" x={X(-20)} y="806" width="1120" height="42" fill="var(--butter)" />

      {/* smoke */}
      <g>
        <Disc cx={X(150)} cy={292} r={34} tint="var(--lilac)" seed={11} amount={0.06} />
        <Disc cx={X(192)} cy={240} r={46} tint="var(--lilac)" seed={12} amount={0.06} />
        <Disc cx={X(252)} cy={204} r={30} tint="var(--lilac)" seed={13} amount={0.06} />
      </g>

      {/* the hall: north-light sawtooth, chimney */}
      <g fill={KEY}>
        <path
          d={`M ${X(60)} ${BASE} V 640 L ${X(130)} 580 V 640 L ${X(200)} 580 V 640 L ${X(270)} 580 V 640 L ${X(340)} 580 V 640 L ${X(410)} 580 V 640 L ${X(480)} 580 V ${BASE} Z`}
        />
        <rect x={X(128)} y="330" width="26" height="260" />
        <rect x={X(120)} y="320" width="42" height="12" />
      </g>
      <g fill="var(--butter)">
        {[96, 126, 236, 266, 296].map((x) => (
          <rect key={x} x={X(x)} y="690" width="17" height="48" />
        ))}
      </g>
      <rect x={X(390)} y="760" width="52" height="88" fill="var(--coral)" />

      {/* crane, hook, ladle */}
      <path d={`M ${X(520)} 470 H ${X(1060)}`} stroke={KEY} strokeWidth="4" />
      <path d={`M ${X(860)} 470 V 548`} stroke={KEY} strokeWidth="1.6" />
      <g transform={`rotate(-28 ${X(860)} 600)`}>
        <path d={`M ${X(790)} 560 H ${X(930)} L ${X(910)} 650 Q ${X(860)} 668 ${X(810)} 650 Z`} fill={KEY} />
        <path d={`M ${X(790)} 560 H ${X(930)}`} stroke="var(--coral)" strokeWidth="7" />
      </g>

      {/* the pour: a pastel body with a cream core running down it */}
      <path d={POUR} fill="none" stroke="var(--coral)" strokeWidth="17" strokeLinecap="round" />
      <path d={POUR} fill="none" stroke="var(--butter)" strokeWidth="6" strokeLinecap="round" />
      <path className="fy-pour-run" d={POUR} fill="none" stroke="#fff8e6" strokeWidth="3" strokeLinecap="round" />

      {/* the mould */}
      <rect x={X(676)} y="800" width="140" height="48" fill="url(#jHatch)" />
      <rect x={X(676)} y="800" width="140" height="48" fill="none" stroke={KEY} strokeWidth="1.6" />
      <ellipse className="fy-pool" cx={X(746)} cy="802" rx="28" ry="5" fill="var(--coral)" />

      <Specks x={X(700)} y={720} w={110} h={60} n={6} seed={21} r={2.2} />
    </g>
  );
}

/**
 * 2017 — the plant in India. An arcade of arches cut out of the key plate,
 * a dome over it, and the team standing in the light of the openings: the
 * standard was installed, and then it was taught.
 */
export function IndiaCity({ ax }) {
  const X = (x) => ax + x;
  const arches = [0, 1, 2, 3, 4, 5, 6].map((i) => 60 + i * 145);
  const wall =
    `M ${X(20)} ${BASE} V 600 H ${X(1060)} V ${BASE} Z ` +
    arches
      .map(
        (x) =>
          `M ${X(x)} ${BASE} V 690 A 45 45 0 0 1 ${X(x + 90)} 690 V ${BASE} Z`,
      )
      .join(" ");
  return (
    <g>
      <Disc cx={X(660)} cy={430} r={215} tint="var(--rose)" seed={3} />
      <Disc cx={X(450)} cy={540} r={165} tint="var(--apricot)" seed={6} />
      <Orbit cx={X(660)} cy={430} r={262} />
      <rect className="j-print" x={X(0)} y="610" width="1080" height="238" fill="var(--butter)" />

      {/* minarets either side of the dome */}
      <g fill={KEY}>
        <rect x={X(296)} y="500" width="20" height="100" />
        <path d={`M ${X(292)} 502 Q ${X(306)} 470 ${X(320)} 502 Z`} />
        <rect x={X(764)} y="500" width="20" height="100" />
        <path d={`M ${X(760)} 502 Q ${X(774)} 470 ${X(788)} 502 Z`} />
        {/* the dome and its finial */}
        <path d={`M ${X(420)} 600 Q ${X(420)} 470 ${X(540)} 438 Q ${X(660)} 470 ${X(660)} 600 Z`} />
        <rect x={X(538)} y="394" width="4" height="46" />
        <path fillRule="evenodd" d={wall} />
      </g>
      <circle cx={X(540)} cy="390" r="7" fill="var(--coral)" />
      <rect x={X(40)} y="612" width="1000" height="7" fill="var(--rose)" />

      {/* the trainer and the team, in the openings */}
      <Figure x={X(250)} s={1.15} />
      <Figure x={X(395)} />
      <Figure x={X(540)} />
      <Figure x={X(685)} />
      {/* the standard being explained — a sheet held up, and a pointer */}
      <rect x={X(222)} y="742" width="24" height="32" fill="var(--j-sky1)" stroke={KEY} strokeWidth="1.6" />
      <path className="india-pointer" d={`M ${X(266)} 800 L ${X(318)} 752`} stroke={KEY} strokeWidth="2.4" strokeLinecap="round" />

      <Specks x={X(820)} y={250} w={220} h={160} n={6} seed={31} r={1.7} />
    </g>
  );
}

/**
 * 2023 — Växjö. A low winter sun, two hills overprinted in sky and lilac,
 * pines in key ink, and one falu-red cottage with its window lit: the cold,
 * and someone studying through it.
 */
export function SwedenForest({ ax }) {
  const X = (x) => ax + x;
  const pine = (x, h, w = 60) =>
    `M ${X(x - w / 2)} ${BASE} L ${X(x)} ${BASE - h} L ${X(x + w / 2)} ${BASE} Z`;
  return (
    <g>
      <Disc cx={X(560)} cy={630} r={232} tint="var(--sky)" seed={5} />
      <Orbit cx={X(560)} cy={630} r={282} />
      <path
        className="j-print"
        d={hill(
          [[X(-20), 790], [X(150), 690], [X(330), 700], [X(470), 744], [X(640), 650], [X(820), 620], [X(1000), 676], [X(1100), 700]],
          BASE,
        )}
        fill="var(--lilac)"
        opacity="0.8"
      />
      <path
        className="j-print"
        d={hill(
          [[X(-20), 820], [X(200), 770], [X(400), 790], [X(600), 760], [X(800), 784], [X(1100), 752]],
          BASE,
        )}
        fill="var(--sky)"
        opacity="0.45"
      />

      {/* pines: tall and narrow, in stands */}
      <g fill={KEY}>
        <path d={pine(120, 230)} />
        <path d={pine(168, 160, 48)} />
        <path d={pine(72, 120, 40)} />
        <path d={pine(850, 280, 70)} />
        <path d={pine(906, 190, 54)} />
        <path d={pine(954, 130, 44)} />
      </g>

      {/* the cottage, and the lit window where the reset happened */}
      <g>
        <path d={`M ${X(560)} 744 L ${X(630)} 690 L ${X(700)} 744 Z`} fill={KEY} />
        <rect x={X(572)} y="744" width="116" height="104" fill="var(--coral-ink)" />
        <rect x={X(596)} y="768" width="38" height="34" fill="var(--butter)" />
        <path d={`M ${X(615)} 768 V 802`} stroke={KEY} strokeWidth="2" />
        <rect x={X(650)} y="790" width="22" height="58" fill={KEY} />
      </g>

      <Specks x={X(80)} y={260} w={900} h={300} n={22} seed={41} r={1.6} />
    </g>
  );
}

/**
 * A cherry tree that dresses for the same season as the weather (D68):
 * blossom in spring, a full canopy in summer, thinning amber in autumn, bare
 * boughs in winter. The crown is overprinted lobes; the trunk is key ink.
 */
function CherryTree({ x, season = "spring" }) {
  const bare = season === "winter";
  const tint =
    season === "spring"
      ? "var(--rose)"
      : season === "autumn"
        ? "var(--apricot)"
        : "var(--sage)";
  const crown = [
    { cx: -80, cy: -250, r: 72 },
    { cx: -6, cy: -300, r: 88 },
    { cx: 80, cy: -258, r: 70 },
    { cx: 18, cy: -218, r: 74 },
  ];
  return (
    <g>
      {!bare &&
        crown.map((c, i) => (
          <Disc key={i} cx={x + c.cx} cy={BASE + c.cy} r={c.r} tint={tint} seed={50 + i} amount={0.05} />
        ))}
      <g fill={KEY}>
        <path
          d={`M ${x - 12} ${BASE} Q ${x - 8} ${BASE - 96} ${x - 10} ${BASE - 180} L ${x + 10} ${BASE - 180} Q ${x + 9} ${BASE - 94} ${x + 14} ${BASE} Z`}
        />
      </g>
      <path
        d={`M ${x - 4} ${BASE - 160} L ${x - 66} ${BASE - 240} M ${x + 6} ${BASE - 168} L ${x + 64} ${BASE - 244} M ${x} ${BASE - 178} L ${x - 26} ${BASE - 290} M ${x + 2} ${BASE - 176} L ${x + 30} ${BASE - 284}`}
        stroke={KEY}
        strokeWidth={bare ? 6 : 4}
        strokeLinecap="round"
        fill="none"
      />
      {bare && (
        <path
          d={`M ${x - 66} ${BASE - 240} L ${x - 96} ${BASE - 276} M ${x + 64} ${BASE - 244} L ${x + 92} ${BASE - 282} M ${x - 26} ${BASE - 290} L ${x - 40} ${BASE - 326} M ${x + 30} ${BASE - 284} L ${x + 48} ${BASE - 318}`}
          stroke={KEY}
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
      )}
      {season === "spring" && (
        <Specks x={x - 150} y={BASE - 390} w={300} h={250} n={14} seed={61} r={2} />
      )}
    </g>
  );
}

/**
 * 2024 — the first Sprinta chapter: one developer in a house, the room lit,
 * a garden around it. The window is a butter field cut into the key plate,
 * with the desk printed into it.
 */
export function SoloStudio({ ax, season }) {
  const X = (x) => ax + x;
  const pickets = (x0, x1) => {
    let d = "";
    for (let x = x0; x < x1; x += 26) d += ` M ${X(x)} ${BASE} V 780 L ${X(x + 5)} 772 L ${X(x + 10)} 780 V ${BASE}`;
    return `${d} M ${X(x0)} 796 H ${X(x1)} M ${X(x0)} 826 H ${X(x1)}`;
  };
  return (
    <g>
      <Disc cx={X(560)} cy={520} r={215} tint="var(--sky)" seed={9} />
      <Disc cx={X(780)} cy={400} r={88} tint="var(--butter)" seed={14} />
      <Orbit cx={X(560)} cy={520} r={262} />

      <path d={pickets(10, 300)} fill="none" stroke={KEY} strokeWidth="2" />
      <path d={pickets(700, 1060)} fill="none" stroke={KEY} strokeWidth="2" />

      <CherryTree x={X(930)} season={season} />

      {/* the house */}
      <g fill={KEY}>
        <path d={`M ${X(340)} ${BASE} V 610 L ${X(520)} 478 L ${X(700)} 610 V ${BASE} Z`} />
        <rect x={X(610)} y="500" width="26" height="70" />
      </g>
      {/* the lit room */}
      <rect x={X(392)} y="642" width="256" height="158" fill="var(--butter)" />
      <g fill={KEY}>
        {/* desk */}
        <rect x={X(470)} y="744" width="150" height="9" />
        <rect x={X(478)} y="753" width="7" height="47" />
        <rect x={X(604)} y="753" width="7" height="47" />
        {/* laptop */}
        <path d={`M ${X(540)} 702 H ${X(590)} L ${X(600)} 744 H ${X(530)} Z`} />
        {/* the developer, and the chair */}
        <circle cx={X(452)} cy="694" r="15" />
        <path d={`M ${X(432)} 800 V 730 Q ${X(432)} 712 ${X(452)} 712 Q ${X(474)} 712 ${X(480)} 738 L ${X(520)} 744 L ${X(518)} 754 L ${X(474)} 752 V 800 Z`} />
        <rect x={X(418)} y="752" width="10" height="48" />
      </g>
      <rect className="screen-glow" x={X(548)} y="710" width="36" height="24" fill="var(--sky)" />
      {/* the cable, in key ink, because the setup was makeshift */}
      <path d={`M ${X(598)} 742 C ${X(640)} 760 ${X(610)} 790 ${X(640)} 800`} fill="none" stroke={KEY} strokeWidth="1.6" strokeDasharray="3 4" />

      {/* shrubs */}
      <Disc cx={X(330)} cy={830} r={38} tint="var(--sage)" seed={71} amount={0.07} />
      <Disc cx={X(712)} cy={834} r={30} tint="var(--sage)" seed={72} amount={0.07} />
    </g>
  );
}

/**
 * 2025 — the mature portfolio: a skyline in key ink over three overprinted
 * discs, one per layer of the stack that the graph above it names.
 */
export function Office({ ax }) {
  const X = (x) => ax + x;
  const blocks = [
    [40, 470, 150],
    [210, 396, 130],
    [356, 520, 116],
    [700, 430, 168],
    [890, 340, 142],
    [1050, 500, 30],
  ];
  return (
    <g>
      <Disc cx={X(470)} cy={560} r={220} tint="var(--lime)" seed={15} />
      <Disc cx={X(700)} cy={450} r={160} tint="var(--sky)" seed={16} />
      <Disc cx={X(860)} cy={650} r={120} tint="var(--lilac)" seed={17} />
      <Orbit cx={X(600)} cy={540} r={330} opacity={0.5} />
      <g fill={KEY}>
        {blocks.map(([x, y, w], i) => (
          <rect key={i} x={X(x)} y={y} width={w} height={BASE - y} />
        ))}
        <rect x={X(916)} y="300" width="42" height="44" />
        <rect x={X(934)} y="238" width="5" height="66" />
      </g>
      {/* windows, cut back to the paper — a few lit in the pastels */}
      <g>
        {blocks.slice(0, 5).map(([bx, by, bw], b) => {
          const cols = Math.floor((bw - 24) / 26);
          const rows = Math.floor((BASE - by - 60) / 34);
          return Array.from({ length: cols * rows }).map((_, k) => {
            const c = k % cols;
            const r = Math.floor(k / cols);
            const lit = scatter(k, b + 3);
            if (lit < 0.42) return null;
            return (
              <rect
                key={`${b}-${k}`}
                x={X(bx + 16 + c * 26)}
                y={by + 22 + r * 34}
                width="12"
                height="16"
                fill={lit > 0.93 ? "var(--butter)" : "var(--j-sky1)"}
              />
            );
          });
        })}
      </g>
    </g>
  );
}

// The stack's four layers, each with its own plate.
export const TINTS = {
  client: "var(--sky)",
  compute: "var(--lilac)",
  data: "var(--sage)",
  ai: "var(--apricot)",
};

const PILL_H = 48;
const PILL_R = PILL_H / 2; // fully rounded — no square corners anywhere
const LOGO = 24; // logo box inside the pill
const LOGO_R = 17; // the disc behind it

// Local layout. Frontend converges into the backend, which then branches two
// ways: data one side, AI the other. AI is a sibling of the data layer, not
// something downstream of it.
const COLUMNS = {
  frontend: { x: 0, w: 234, gap: 74, mid: 390 },
  backend: { x: 400, w: 238, gap: 74, mid: 390 },
  data: { x: 844, w: 260, gap: 74, mid: 196 },
  ai: { x: 844, w: 260, gap: 74, mid: 604 },
};

const J1 = [328, 390]; // frontend -> backend waist
const J2 = [702, 390]; // backend exit
const J3 = [784, 196]; // into the data branch
const J4 = [784, 604]; // into the AI branch

const laidOut = (group) => {
  const col = COLUMNS[group.id];
  const n = group.items.length;
  const top = col.mid - ((n - 1) * col.gap) / 2;
  return group.items.map((label, i) => ({
    label,
    tint: group.tint,
    x: col.x,
    w: col.w,
    cy: top + i * col.gap,
  }));
};

/** Smooth S-curve between two points — the connector shape from the study. */
const link = ([x1, y1], [x2, y2]) => {
  const mx = x1 + (x2 - x1) / 2;
  return `M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`;
};

/**
 * 2025 — the pull-back. The journey stops being a line and becomes the stack
 * that came out of it: recognisable names rather than internal architecture
 * (see the note on `stack` in src/data/journey.js), wired as a flow rather
 * than laid out as a table.
 *
 * Printed as labels on the sheet: paper pills ruled in key ink, a pastel
 * plate behind each logo saying which layer it belongs to.
 */
export function StackGraph({ ax, oy = 70, groups }) {
  const byId = Object.fromEntries(groups.map((g) => [g.id, laidOut(g)]));
  const { frontend = [], backend = [], data = [], ai = [] } = byId;

  const edges = [
    ...frontend.map((p) => link([p.x + p.w, p.cy], J1)),
    ...backend.map((p) => link(J1, [p.x, p.cy])),
    ...backend.map((p) => link([p.x + p.w, p.cy], J2)),
    link(J2, J3),
    link(J2, J4),
    ...data.map((p) => link(J3, [p.x, p.cy])),
    ...ai.map((p) => link(J4, [p.x, p.cy])),
  ];

  const pills = [...frontend, ...backend, ...data, ...ai];

  return (
    <g transform={`translate(${ax},${oy})`}>
      <g
        data-arch-edge
        fill="none"
        stroke={KEY}
        strokeWidth="1.3"
        opacity="0.55"
      >
        {edges.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </g>

      {/* junction dots, where the flow gathers and splits */}
      <g fill={KEY}>
        {[J1, J2, J3, J4].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="5" />
        ))}
      </g>

      {pills.map((pill) => {
        const logo = logoFor(pill.label);
        return (
          <g key={pill.label} data-arch-node>
            <rect
              x={pill.x}
              y={pill.cy - PILL_H / 2}
              width={pill.w}
              height={PILL_H}
              rx={PILL_R}
              fill="var(--j-sky0)"
              stroke={KEY}
              strokeWidth="1.3"
            />
            {/* The layer's plate behind the logo. Logos keep their own
                artwork, so dark marks sit on the pastel and light ones on a
                key-ink disc (see the tone notes in src/data/techLogos.js). */}
            {logo && (
              <>
                <circle
                  cx={pill.x + PILL_H / 2}
                  cy={pill.cy}
                  r={LOGO_R}
                  fill={logo.tone === "light" ? "#1d1b19" : TINTS[pill.tint]}
                />
                <image
                  href={logo.src}
                  x={pill.x + PILL_H / 2 - LOGO / 2}
                  y={pill.cy - LOGO / 2}
                  width={LOGO}
                  height={LOGO}
                  preserveAspectRatio="xMidYMid meet"
                />
              </>
            )}
            {!logo && (
              <circle cx={pill.x + 22} cy={pill.cy} r="7" fill={TINTS[pill.tint]} />
            )}
            <text
              x={logo ? pill.x + PILL_H + 4 : pill.x + 38}
              y={pill.cy + 7}
              textAnchor="start"
              fill={KEY}
              fontSize="20"
              fontWeight="500"
              style={{ fontFamily: "var(--sans)" }}
            >
              {pill.label}
            </text>
          </g>
        );
      })}
    </g>
  );
}

/** Keyed by beat id, so adding or reordering beats cannot shift the mapping. */
export const SCENE_BY_BEAT = {
  origin: Origin,
  foundry: Foundry,
  india: IndiaCity,
  sweden: SwedenForest,
  sprinta: SoloStudio,
  architect: Office, // mature shared platform; the stack sits over it
  recap: null, // the closing slide is the lifted overview + the work wall
};
