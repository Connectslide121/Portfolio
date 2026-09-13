import React from "react";
import { BASE } from "./config";
import { LightShaft } from "./parts";
import { logoFor } from "../data/techLogos";

// Fallback for a scene rendered outside a data-scene group; World.jsx passes
// each beat its own.
const SIL = "url(#jSil)";

// Every place is authored as coordinates — no drawing tool, no raster assets
// (D7). Each scene fits local 0..1080, to the right of the beat card.
//
// Silhouette masses fill with url(#jSil), never a flat var(--j-mid): the
// gradient is what stops a tall building reading as cut paper (see the def in
// parts.jsx). Thin strokes and small props keep the flat variable — a 2px line
// has nowhere to put a gradient.
//
// Each place also carries LIGHT SHAFTS from whatever is lit in it. One polygon
// each, aimed by a rotate, faded by the shared jShaft gradient. They are the
// cheapest thing in the file and they do more than anything else to make flat
// vector read as a lit space rather than an arrangement of shapes.

/** Sawtooth north-light roof — the classic foundry / workshop hall. */
const sawtooth = (x, y, teeth, w, h) => {
  let d = `M ${x} ${y}`;
  for (let i = 0; i < teeth; i++) {
    d += ` L ${x + i * w} ${y - h} L ${x + (i + 1) * w} ${y}`;
  }
  return `${d} L ${x + teeth * w} ${BASE} L ${x} ${BASE} Z`;
};

/**
 * Light spilled onto the floor in front of a source. Every accent uses one:
 * a glow with nothing under it looks pasted on, whereas light landing on the
 * ground places it in the scene.
 */
const Spill = ({ x, y, rx = 110, ry = 18, tint = "var(--j-stream)", opacity = 0.32 }) => (
  <ellipse cx={x} cy={y} rx={rx} ry={ry} fill={tint} filter="url(#jGlow)" opacity={opacity} />
);

/** The bright edge a nearby light throws along a silhouette facing it. */
const Rim = ({ d, width = 2.5, opacity = 0.7, tint = "var(--j-streamCore)" }) => (
  <path d={d} fill="none" stroke={tint} strokeWidth={width} strokeLinecap="round" opacity={opacity} />
);

/** A grid of lit windows — reused by the school and the office. */
const windows = (x, y, cols, rows, gap = 34, size = 16) =>
  Array.from({ length: cols * rows }).map((_, i) => ({
    x: x + (i % cols) * gap,
    y: y + Math.floor(i / cols) * (gap + 4),
    size,
    lit: (i * 7) % 5 !== 0,
  }));

/** 2005-2010 — an academic campus, intentionally unlike the later factory. */
export function Origin({ ax, sil = SIL }) {
  return (
    <g>
      <g fill={sil}>
        {/* broad teaching block */}
        <rect x={ax + 96} y="556" width="570" height={BASE - 556} rx="3" />
        <rect x={ax + 76} y="534" width="610" height="24" rx="3" />
        {/* a regular human-scale double entrance */}
        <rect x={ax + 144} y="766" width="76" height={BASE - 766} rx="2" fill="var(--j-ground)" opacity="0.76" />
        {/* library / clock tower: a pitched cap keeps it civic, not industrial */}
        <rect x={ax + 684} y="484" width="132" height={BASE - 484} />
        <polygon points={`${ax + 672},484 ${ax + 750},420 ${ax + 828},484`} />
        {/* curved lecture theatre */}
        <path d={`M ${ax + 836} ${BASE} V 704 Q ${ax + 952} 622 ${ax + 1068} 704 V ${BASE} Z`} />
      </g>
      {/* regular classroom windows and the clock face */}
      <g className="building-windows" fill="var(--j-streamCore)" opacity="0.34">
        {[
          ...windows(ax + 268, 596, 2, 5),
          ...windows(ax + 466, 596, 6, 5),
        ].map(
          (w, i) => w.lit && <rect key={i} x={w.x} y={w.y} width={w.size} height="22" />
        )}
        {windows(ax + 708, 532, 3, 7, 34, 15).map(
          (w, i) => w.lit && <rect key={`t${i}`} x={w.x} y={w.y} width={w.size} height="19" />
        )}
      </g>
      <g className="campus-details" fill="none" stroke="var(--j-streamCore)" opacity="0.42">
        <circle cx={ax + 750} cy="466" r="22" strokeWidth="3" />
        <path d={`M ${ax + 750} 452 V 467 L ${ax + 762} 474`} strokeWidth="3" strokeLinecap="round" />
        {/* two glazed door leaves, a centre seam and one shallow step */}
        <rect x={ax + 148} y="770" width="68" height={BASE - 770} rx="1" strokeWidth="2.5" />
        <path d={`M ${ax + 182} 770 V ${BASE} M ${ax + 154} 794 H ${ax + 210} M ${ax + 136} ${BASE} H ${ax + 228}`} strokeWidth="2" />
      </g>
      <g fill="var(--j-streamCore)" opacity="0.55">
        <circle cx={ax + 176} cy="812" r="2.5" />
        <circle cx={ax + 188} cy="812" r="2.5" />
      </g>

      {/* A dark inset window contains the study scene without becoming a
          bright screen-like panel. */}
      <g className="acc study-lamp">
        <rect x={ax + 326} y="550" width="128" height="138" rx="3" fill="var(--j-ground)" opacity="0.54" />
        <rect x={ax + 326} y="550" width="128" height="138" rx="3" fill="none" stroke="var(--j-streamCore)" strokeWidth="2" opacity="0.3" />
        <path d={`M ${ax + 320} 688 H ${ax + 460}`} stroke="var(--j-streamCore)" strokeWidth="4" opacity="0.32" />
        {/* hanging lamp and its soft cone */}
        <path d={`M ${ax + 390} 568 V 598`} stroke="var(--j-streamCore)" strokeWidth="2" opacity="0.5" />
        <path d={`M ${ax + 378} 610 Q ${ax + 390} 594 ${ax + 402} 610 Z`} fill="var(--j-streamCore)" />
        <circle cx={ax + 390} cy="610" r="4" fill="#fff7e8" filter="url(#jGlowSoft)" />
        <path d={`M ${ax + 380} 612 L ${ax + 350} 674 H ${ax + 430} L ${ax + 400} 612 Z`} fill="var(--j-stream)" filter="url(#jGlowSoft)" opacity="0.2" />
        <g fill="var(--j-ground)" opacity="0.94">
          <rect x={ax + 382} y="654" width="52" height="6" rx="2" />
          <rect x={ax + 426} y="660" width="5" height="23" />
          <circle cx={ax + 362} cy="628" r="9" />
          <path d={`M ${ax + 351} 642 Q ${ax + 362} 636 ${ax + 373} 642 L ${ax + 380} 658 H ${ax + 348} Z`} />
          <path d={`M ${ax + 371} 645 L ${ax + 390} 654`} fill="none" stroke="var(--j-ground)" strokeWidth="7" strokeLinecap="round" />
        </g>
      </g>

      {/* The study window is the only light on the campus, so it is the only
          thing here that can throw a shaft. */}
      <LightShaft x={ax + 390} y={686} len={190} spread={230} angle={9} opacity={0.45} />
    </g>
  );
}

/**
 * 2011-2023 — the steel foundry.
 *
 * The accent is the pour: a tilted ladle running molten steel into a sand
 * mould, with the stream the brightest thing in the frame.
 *
 * The technique that makes it read is RIM LIGHT. The stream is a light
 * source, so the edges facing it catch a bright line while the rest of the
 * silhouette stays dark. Without that the props were unlit cut-outs sitting
 * near a glow; with it they belong to the same scene.
 */
export function Foundry({ ax, sil = SIL }) {
  const POUR = `M ${ax + 895} 714 C ${ax + 884} 742 ${ax + 862} 772 ${ax + 824} 801`;
  return (
    <g>
      {/* Sawtooth glazing faces the sky, so a hall running at night spills
          UPWARD out of the roof — behind the silhouette, into the dark. */}
      <LightShaft x={ax + 246} y={520} len={340} spread={210} angle={188} opacity={0.24} />
      <LightShaft x={ax + 364} y={520} len={320} spread={200} angle={185} opacity={0.2} delay={1.6} />
      <LightShaft x={ax + 482} y={520} len={350} spread={214} angle={191} opacity={0.22} delay={3.1} />
      <g fill={sil}>
        {/* chimney + cap */}
        <polygon points={`${ax + 40},${BASE} ${ax + 56},262 ${ax + 112},262 ${ax + 128},${BASE}`} />
        <rect x={ax + 28} y="240" width="112" height="26" />
        {/* main hall with north-light roof */}
        <path d={sawtooth(ax + 176, 576, 4, 118, 76)} />
        {/* annex */}
        <rect x={ax + 640} y="648" width="150" height={BASE - 648} />
        <rect x={ax + 624} y="620" width="184" height="18" />
        {/* overhead crane, hook and a bowl-shaped ladle */}
        <rect x={ax + 748} y="566" width="298" height="12" />
        <rect x={ax + 958} y="578" width="8" height="42" />
        <path d={`M ${ax + 962} 618 C ${ax + 962} 648 ${ax + 948} 652 ${ax + 936} 664`} fill="none" stroke="var(--j-mid)" strokeWidth="9" />
        <g transform={`rotate(-19 ${ax + 946} 700)`}>
          <path d={`M ${ax + 876} 662 L ${ax + 1018} 662 L ${ax + 994} 738 Q ${ax + 946} 770 ${ax + 898} 738 Z`} />
          <rect x={ax + 864} y="650" width="166" height="18" rx="8" />
          <circle cx={ax + 884} cy="696" r="13" />
          <circle cx={ax + 1008} cy="696" r="13" />
        </g>
        {/* cope and drag: the two halves of a sand mould */}
        <path d={`M ${ax + 758} ${BASE} L ${ax + 766} 812 H ${ax + 878} L ${ax + 888} ${BASE} Z`} />
        <rect x={ax + 750} y="806" width="138" height="12" rx="3" />
      </g>

      {/* --- the accent ------------------------------------------------- */}
      <g className="fy-pour">
        {/* light thrown onto the floor around the mould */}
        <ellipse
          cx={ax + 820}
          cy={BASE - 4}
          rx="170"
          ry="26"
          fill="var(--j-stream)"
          filter="url(#jGlow)"
          opacity="0.3"
        />

        {/* rim light: the edges facing the stream catch it */}
        <g
          fill="none"
          stroke="var(--j-streamCore)"
          strokeLinecap="round"
          opacity="0.75"
        >
          <path d={`M ${ax + 895} 714 Q ${ax + 936} 766 ${ax + 994} 738`} strokeWidth="3" />
          <path d={`M ${ax + 766} 812 H ${ax + 878}`} strokeWidth="3" />
          <path d={`M ${ax + 758} ${BASE} L ${ax + 766} 812`} strokeWidth="2" opacity="0.6" />
        </g>

        <path
          d={POUR}
          fill="none"
          stroke="var(--j-stream)"
          strokeWidth="24"
          strokeLinecap="round"
          filter="url(#jGlow)"
          opacity="0.8"
        />
        <path
          d={POUR}
          fill="none"
          stroke="var(--j-stream)"
          strokeWidth="8"
          strokeLinecap="round"
          filter="url(#jGlowSoft)"
        />
        <path
          d={POUR}
          fill="none"
          stroke="var(--j-streamCore)"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        {/* a brighter slug running down, so the stream reads as flowing */}
        <path
          className="fy-pour-run"
          d={POUR}
          fill="none"
          stroke="#ffffff"
          strokeWidth="5"
          strokeLinecap="round"
        />

        {/* molten pool in the mould, and the glow off the ladle's lip */}
        <ellipse
          className="fy-pool"
          cx={ax + 824}
          cy="811"
          rx="54"
          ry="11"
          fill="var(--j-stream)"
          filter="url(#jGlowSoft)"
        />
        <ellipse cx={ax + 824} cy="811" rx="40" ry="6.5" fill="var(--j-streamCore)" />
        <ellipse
          cx={ax + 898}
          cy="711"
          rx="20"
          ry="10"
          fill="var(--j-streamCore)"
          filter="url(#jGlowSoft)"
          opacity="0.9"
        />
      </g>

      {/* Heat rising off the filled mould — in front, because it is between
          the camera and the pour. */}
      <LightShaft x={ax + 824} y={802} len={300} spread={250} angle={183} opacity={0.42} delay={0.7} />
    </g>
  );
}

/** 2017 — the second plant, India. */
export function IndiaCity({ ax, sil = SIL }) {
  return (
    <g>
      <IndiaSilhouette ax={ax} sil={sil} />
      {/* Rays off the sun World.jsx paints behind this skyline. Authored
          here so they recede with the place, not with the sky. */}
      <LightShaft x={ax + 590} y={330} len={600} spread={340} angle={-34} opacity={0.26} />
      <LightShaft x={ax + 590} y={330} len={660} spread={320} angle={-12} opacity={0.22} delay={1.2} />
      <LightShaft x={ax + 590} y={330} len={640} spread={340} angle={11} opacity={0.25} delay={2.4} />
      <LightShaft x={ax + 590} y={330} len={580} spread={300} angle={31} opacity={0.2} delay={3.6} />
      <IndiaAccent ax={ax} />
    </g>
  );
}

function IndiaSilhouette({ ax, sil = SIL }) {
  const towers = [
    [20, 566, 108],
    [148, 624, 84],
    [258, 512, 98],
    [860, 592, 122],
    [1000, 544, 88],
  ];
  return (
    <g fill={sil}>
      {towers.map(([x, y, w], i) => (
        <rect key={i} x={ax + x} y={y} width={w} height={BASE - y} />
      ))}
      {/* domed hall — arc + drum + finial */}
      <path d={`M ${ax + 420} 664 A 170 170 0 0 1 ${ax + 760} 664 Z`} />
      <rect x={ax + 420} y="664" width="340" height={BASE - 664} />
      <rect x={ax + 582} y="470" width="16" height="52" />
      {/* flanking minarets */}
      <rect x={ax + 386} y="596" width="26" height={BASE - 596} />
      <rect x={ax + 768} y="596" width="26" height={BASE - 596} />
      <path d={`M ${ax + 386} 596 A 13 13 0 0 1 ${ax + 412} 596 Z`} />
      <path d={`M ${ax + 768} 596 A 13 13 0 0 1 ${ax + 794} 596 Z`} />
    </g>
  );
}

/** India's accent: one production standard installed in a new plant, then
 * taught to the local team. The visual reads left-to-right as
 * specification -> CAD -> mould -> approved part. */
function IndiaAccent({ ax }) {
  return (
    <g className="acc india-rollout">
      <Spill x={ax + 616} y={BASE - 1} rx="188" ry="22" opacity="0.2" />

      {/* A single illuminated process board inside the plant. */}
      <rect x={ax + 458} y="612" width="284" height="126" rx="8" fill="var(--j-ground)" opacity="0.56" />
      <rect x={ax + 458} y="612" width="284" height="126" rx="8" fill="none" stroke="var(--j-streamCore)" strokeWidth="2" opacity="0.38" />

      {/* the controlled specification entering the workflow */}
      <g fill="none" stroke="var(--j-streamCore)" strokeLinecap="round" strokeLinejoin="round">
        <rect x={ax + 476} y="636" width="38" height="58" rx="3" strokeWidth="3" />
        <path d={`M ${ax + 487} 636 V 630 H ${ax + 503} V 636`} strokeWidth="4" />
        <path d={`M ${ax + 485} 652 L ${ax + 490} 657 L ${ax + 499} 647 M ${ax + 485} 672 L ${ax + 490} 677 L ${ax + 499} 667`} strokeWidth="2.5" />
      </g>

      {/* specification -> CAD -> mould -> approved casting */}
      <path d={`M ${ax + 516} 665 H ${ax + 708}`} fill="none" stroke="var(--j-stream)" strokeWidth="8" filter="url(#jGlowSoft)" opacity="0.54" />
      <path className="india-process-flow" d={`M ${ax + 516} 665 H ${ax + 708}`} fill="none" stroke="var(--j-streamCore)" strokeWidth="3" strokeLinecap="round" />
      {[552, 616, 680].map((x, i) => (
        <circle key={x} className={`india-process-node india-process-node--${i + 1}`} cx={ax + x} cy="665" r="22" fill="var(--j-ground)" stroke="var(--j-streamCore)" strokeWidth="3" />
      ))}
      {/* CAD drawing */}
      <path d={`M ${ax + 540} 674 V 653 H ${ax + 562} M ${ax + 542} 670 L ${ax + 558} 655 M ${ax + 542} 655 H ${ax + 558} V 671`} fill="none" stroke="var(--j-streamCore)" strokeWidth="2" />
      {/* two mould halves */}
      <path d={`M ${ax + 603} 653 H ${ax + 613} L ${ax + 617} 661 L ${ax + 621} 653 H ${ax + 631} V 677 H ${ax + 621} L ${ax + 617} 669 L ${ax + 613} 677 H ${ax + 603} Z`} fill="none" stroke="var(--j-streamCore)" strokeWidth="2" />
      {/* approved finished part */}
      <circle cx={ax + 680} cy="665" r="11" fill="none" stroke="var(--j-streamCore)" strokeWidth="4" />
      <path d={`M ${ax + 691} 651 L ${ax + 697} 657 L ${ax + 708} 644`} fill="none" stroke="var(--j-streamCore)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

      {/* one trainer and a local team: rollout rather than negotiation */}
      <g fill="var(--j-ground)" opacity="0.96">
        <circle cx={ax + 488} cy="774" r="15" />
        <path d={`M ${ax + 470} 795 Q ${ax + 488} 784 ${ax + 506} 795 L ${ax + 514} ${BASE} H ${ax + 462} Z`} />
        <circle cx={ax + 570} cy="810" r="13" />
        <path d={`M ${ax + 552} 828 Q ${ax + 570} 818 ${ax + 588} 828 L ${ax + 594} ${BASE} H ${ax + 546} Z`} />
        <circle cx={ax + 638} cy="810" r="13" />
        <path d={`M ${ax + 620} 828 Q ${ax + 638} 818 ${ax + 656} 828 L ${ax + 662} ${BASE} H ${ax + 614} Z`} />
        <circle cx={ax + 706} cy="810" r="13" />
        <path d={`M ${ax + 688} 828 Q ${ax + 706} 818 ${ax + 724} 828 L ${ax + 730} ${BASE} H ${ax + 682} Z`} />
      </g>
      <path className="india-pointer" d={`M ${ax + 501} 794 L ${ax + 544} 681`} fill="none" stroke="var(--j-streamCore)" strokeWidth="5" strokeLinecap="round" />
      <Rim d={`M ${ax + 467} 796 Q ${ax + 488} 784 ${ax + 506} 795`} width="2" opacity={0.62} />
    </g>
  );
}

/** 2023 — Växjö. Arrival, and the cold. */
export function SwedenForest({ ax, sil = SIL }) {
  // Overlapping wide triangles read as a forest; narrow ones read as obelisks.
  const pines = Array.from({ length: 9 }).map((_, i) => {
    const x = ax + 10 + i * 104;
    const h = 200 + ((i * 53) % 150);
    return { x, h, w: 118 + ((i * 29) % 46) };
  });
  return (
    <g>
      {/* Behind the pines on purpose: light coming down THROUGH a forest is
          only ever seen in the gaps between the trunks. */}
      <LightShaft x={ax + 300} y={248} len={700} spread={330} angle={7} opacity={0.16} />
      <LightShaft x={ax + 648} y={248} len={660} spread={290} angle={7} opacity={0.13} delay={2.2} />
      <g fill={sil}>
        {pines.map((p, i) => (
          <g key={i}>
            <polygon points={`${p.x},${BASE} ${p.x + p.w / 2},${BASE - p.h} ${p.x + p.w},${BASE}`} />
            {/* upper tier, tucked in — a conifer, not a spire */}
            <polygon
              points={`${p.x + p.w * 0.17},${BASE - p.h * 0.58} ${p.x + p.w / 2},${
                BASE - p.h * 1.02
              } ${p.x + p.w * 0.83},${BASE - p.h * 0.58}`}
            />
          </g>
        ))}
      </g>
      {/* falu-red cottage — the one warm note left in the cold, kept muted so
          it reads as a lit window at dusk rather than a toy */}
      <g opacity="0.86">
        <polygon points={`${ax + 812},706 ${ax + 900},640 ${ax + 988},706`} fill="#5c2018" />
        <rect x={ax + 828} y="706" width="144" height={BASE - 706} fill="#6b271e" />
        <rect x={ax + 922} y="760" width="30" height={BASE - 760} fill="#c9d5e6" opacity="0.6" />
      </g>

      {/* The reset happens at a real desk: a lone figure studies beside a
          laptop, framed by a cold Swedish night. */}
      <g className="acc study-window study-window--code">
        <Spill x={ax + 876} y={BASE - 2} rx="126" ry="18" tint="var(--j-streamCore)" opacity="0.2" />
        <rect x={ax + 846} y="726" width="76" height="66" fill="var(--j-streamCore)" filter="url(#jGlowSoft)" opacity="0.72" />
        <rect x={ax + 852} y="732" width="64" height="54" fill="#eaf2ff" opacity="0.9" />
        <g fill="var(--j-ground)" opacity="0.96">
          <rect x={ax + 856} y="770" width="54" height="5" />
          <rect x={ax + 861} y="775" width="4" height="11" />
          <rect x={ax + 902} y="775" width="4" height="11" />
          <path d={`M ${ax + 890} 755 H ${ax + 905} L ${ax + 908} 768 H ${ax + 887} Z`} />
          <circle cx={ax + 869} cy="750" r="7" />
          <path d={`M ${ax + 865} 757 Q ${ax + 874} 755 ${ax + 881} 763 L ${ax + 886} 775 H ${ax + 866} Z`} />
        </g>
        <rect className="screen-glow" x={ax + 891} y="757" width="13" height="8" fill="#ffffff" filter="url(#jGlowSoft)" />
        <path d={`M ${ax + 884} 732 V 786`} stroke="var(--j-mid)" strokeWidth="4" opacity="0.8" />
        <Rim d={`M ${ax + 844} 724 H ${ax + 924} V 794`} width="2" tint="#eaf2ff" opacity={0.65} />
        <Rim d={`M ${ax + 812} 706 L ${ax + 900} 640`} width="2" tint="#eaf2ff" opacity={0.28} />
      </g>

      {/* The cottage window, in front of the cottage it comes out of. */}
      <LightShaft x={ax + 937} y={790} len={130} spread={110} angle={4} opacity={0.34} delay={1.1} />
    </g>
  );
}

/** 2024 — the first Sprinta chapter: one developer and a makeshift setup. */
export function SoloStudio({ ax, sil = SIL }) {
  return (
    <g>
      {/* One room lit in an otherwise dark house. Behind the roof, so it
          reads as glow escaping rather than a lamp sitting on the tiles. */}
      <LightShaft x={ax + 706} y={548} len={320} spread={300} angle={181} opacity={0.26} />
      {/* A modest top-floor room, deliberately smaller than the office that
          follows it. The sloped roof and odd furniture keep it homemade. */}
      <g fill={sil}>
        <path d={`M ${ax + 430} ${BASE} V 604 L ${ax + 706} 482 L ${ax + 982} 604 V ${BASE} Z`} />
        <rect x={ax + 404} y="594" width="602" height="18" />
        <rect x={ax + 944} y="520" width="20" height="76" />
        <rect x={ax + 930} y="508" width="48" height="14" />
      </g>
      <g className="acc solo-studio">
        <Spill x={ax + 720} y={BASE - 2} rx="220" ry="24" tint="var(--j-streamCore)" opacity="0.18" />
        {/* lit attic room / cutaway */}
        <path d={`M ${ax + 536} 626 L ${ax + 706} 550 L ${ax + 876} 626 V 826 H ${ax + 536} Z`} fill="var(--j-stream)" filter="url(#jGlowSoft)" opacity="0.22" />
        <path d={`M ${ax + 548} 632 L ${ax + 706} 562 L ${ax + 864} 632 V 814 H ${ax + 548} Z`} fill="var(--j-streamCore)" opacity="0.2" />
        {/* folding table, laptop, cable and a single developer */}
        <g fill="var(--j-ground)" opacity="0.97">
          <rect x={ax + 650} y="730" width="154" height="12" rx="3" />
          <path d={`M ${ax + 670} 742 L ${ax + 650} 814 H ${ax + 662} L ${ax + 682} 742 Z M ${ax + 782} 742 L ${ax + 802} 814 H ${ax + 814} L ${ax + 794} 742 Z`} />
          <path d={`M ${ax + 724} 690 H ${ax + 774} L ${ax + 786} 730 H ${ax + 716} Z`} />
          <rect x={ax + 576} y="744" width="54" height="8" />
          <path d={`M ${ax + 582} 752 V 814 H ${ax + 592} V 752 Z M ${ax + 616} 752 V 814 H ${ax + 626} V 752 Z`} />
          <circle cx={ax + 624} cy="685" r="18" />
          <path d={`M ${ax + 606} 706 Q ${ax + 626} 696 ${ax + 646} 711 L ${ax + 670} 778 H ${ax + 596} Z`} />
          <path d={`M ${ax + 643} 716 L ${ax + 716} 733`} fill="none" stroke="var(--j-ground)" strokeWidth="14" strokeLinecap="round" />
        </g>
        <rect className="screen-glow" x={ax + 731} y="696" width="38" height="25" rx="2" fill="#eef6ff" filter="url(#jGlowSoft)" />
        {/* loose charger cable and the mug are the amateur details */}
        <path className="solo-cable" d={`M ${ax + 770} 724 C ${ax + 836} 740 ${ax + 820} 784 ${ax + 850} 800`} fill="none" stroke="var(--j-streamCore)" strokeWidth="3" strokeLinecap="round" />
        <path d={`M ${ax + 676} 716 H ${ax + 694} V 730 H ${ax + 676} Z M ${ax + 694} 719 Q ${ax + 705} 719 ${ax + 700} 728`} fill="none" stroke="var(--j-ground)" strokeWidth="4" />
        <Rim d={`M ${ax + 646} 712 L ${ax + 716} 730`} width="2" tint="#eef6ff" opacity={0.75} />
      </g>
    </g>
  );
}

/** 2025 — the mature portfolio: several products, one shared architecture. */
export function Office({ ax, sil = SIL }) {
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
      {/* Light pollution: a working city throws its own glow up off the
          blocks. Behind them, so the skyline stays a hard silhouette. */}
      <LightShaft x={ax + 120} y={470} len={320} spread={250} angle={182} opacity={0.16} />
      <LightShaft x={ax + 782} y={430} len={360} spread={290} angle={179} opacity={0.19} delay={1.8} />
      <LightShaft x={ax + 958} y={340} len={320} spread={240} angle={177} opacity={0.15} delay={3.2} />
      <g fill={sil}>
        {blocks.map(([x, y, w], i) => (
          <rect key={i} x={ax + x} y={y} width={w} height={BASE - y} />
        ))}
        {/* rooftop plant + mast */}
        <rect x={ax + 916} y="300" width="42" height="44" />
        <rect x={ax + 934} y="238" width="6" height="66" />
      </g>
      {/* lit windows — the only warmth in the frame */}
      <g className="building-windows" fill="var(--j-streamCore)" opacity="0.3">
        {[
          ...windows(ax + 62, 500, 4, 8),
          ...windows(ax + 232, 428, 3, 10),
          ...windows(ax + 722, 462, 4, 9),
          ...windows(ax + 912, 372, 3, 11),
        ].map((w, i) => w.lit && <rect key={i} x={w.x} y={w.y} width="14" height="18" />)}
      </g>

      {/* Four product windows converge on one bright platform node. */}
      <g className="acc office-network">
        <g fill="none" stroke="var(--j-stream)" strokeWidth="10" opacity="0.22">
          <path d={`M ${ax + 148} 690 C ${ax + 360} 690 ${ax + 470} 748 ${ax + 610} 748`} />
          <path d={`M ${ax + 292} 610 C ${ax + 430} 610 ${ax + 478} 720 ${ax + 610} 748`} />
          <path d={`M ${ax + 610} 748 C ${ax + 732} 716 ${ax + 792} 620 ${ax + 808} 566`} />
          <path d={`M ${ax + 610} 748 C ${ax + 780} 748 ${ax + 902} 684 ${ax + 946} 610`} />
        </g>
        <g fill="none" stroke="var(--j-streamCore)" strokeWidth="2.5" opacity="0.85">
          <path className="network-line" d={`M ${ax + 148} 690 C ${ax + 360} 690 ${ax + 470} 748 ${ax + 610} 748`} />
          <path className="network-line network-line--2" d={`M ${ax + 292} 610 C ${ax + 430} 610 ${ax + 478} 720 ${ax + 610} 748`} />
          <path className="network-line network-line--3" d={`M ${ax + 610} 748 C ${ax + 732} 716 ${ax + 792} 620 ${ax + 808} 566`} />
          <path className="network-line network-line--4" d={`M ${ax + 610} 748 C ${ax + 780} 748 ${ax + 902} 684 ${ax + 946} 610`} />
        </g>
        <g fill="var(--j-streamCore)" filter="url(#jGlowSoft)">
          <circle cx={ax + 148} cy="690" r="7" />
          <circle cx={ax + 292} cy="610" r="7" />
          <circle cx={ax + 808} cy="566" r="7" />
          <circle cx={ax + 946} cy="610" r="7" />
          <circle className="platform-node" cx={ax + 610} cy="748" r="13" />
        </g>
        <circle cx={ax + 610} cy="748" r="5" fill="#ffffff" />
      </g>
    </g>
  );
}

export const TINTS = {
  client: "#7dd3fc",
  compute: "#93c5fd",
  data: "#86efac",
  ai: "#fca5a5",
};

const PILL_H = 48;
const PILL_R = PILL_H / 2; // fully rounded — no square corners anywhere
const LOGO = 24; // logo box inside the pill
const LOGO_R = 17; // the light disc behind it

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
        stroke="var(--j-stream)"
        strokeWidth="1.6"
        opacity="0.45"
      >
        {edges.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </g>

      {/* junction dots, where the flow gathers and splits */}
      <g fill="var(--j-stream)" opacity="0.5">
        {[J1, J2, J3, J4].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="4" />
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
              fill="var(--j-ground)"
              stroke={TINTS[pill.tint]}
              strokeWidth="1.5"
              opacity="0.95"
            />
            {/* Logo sits in a disc whose colour is chosen from the artwork's
                tone, so both near-white and near-black marks stay legible
                (see src/data/techLogos.js). Label reads left-aligned beside
                it. */}
            {logo && (
              <>
                <circle
                  cx={pill.x + PILL_H / 2}
                  cy={pill.cy}
                  r={LOGO_R}
                  fill={logo.tone === "light" ? "#111827" : "#ffffff"}
                  stroke={TINTS[pill.tint]}
                  strokeOpacity="0.35"
                  strokeWidth="1"
                  opacity="0.96"
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
            <text
              x={logo ? pill.x + PILL_H + 4 : pill.x + pill.w / 2}
              y={pill.cy + 7}
              textAnchor={logo ? "start" : "middle"}
              fill={TINTS[pill.tint]}
              fontSize="20"
              fontWeight="600"
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
