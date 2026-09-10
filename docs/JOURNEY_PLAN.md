# Interactive Journey — Implementation Plan

> Working document. Update the **Status** boxes as phases land so any future
> session can pick this up cold. Branch: `feat/interactive-journey`.

---

## 1. Goal

Turn a static single-scroll portfolio into something interactive **without
losing the 40-second recruiter**. Two modes over one dataset:

| Mode | What it is | Who it is for |
|---|---|---|
| **Journey mode** | Animated, driven cinematic of the career arc | Devs, curious visitors, anyone who wants to be impressed |
| **Résumé mode** | The existing clean scroll site, restyled with the hot→cold motif | Recruiters, hiring managers, people in a hurry |

Journey mode is **launched from the hero**, never forced. Scrolling down from
the hero always lands you in Résumé mode with no interception.

---

## 2. The narrative hook

2011–2023 was spent as a plant manager / product designer in a **sand casting
steel foundry** (Spain, then setting up a plant in India), followed by a move to
Sweden in 2023, retraining, and reaching Lead Developer & Platform Architect by
2025.

The framing: **the work was always building systems — only the material changed.**

| Foundry | Software |
|---|---|
| sand **mold** / **pattern** | design **pattern**, **template** |
| **casting** parts | **instantiating**, **casts** |
| production line | **build pipeline** |
| tolerances, QA | tests, validation |
| built a plant in India from nothing | greenfield platform architecture |
| plant manager, cross-cultural teams | lead developer |

Closing beat: the current primary AI platform is literally **Azure AI Foundry**.

> *"Twelve years in a foundry, casting steel into molds. Still working in a
> foundry — the molds are just made of TypeScript now."*

**Decision (user, session 1): keep the metaphor LIGHT.** Use the story arc and
the hot→cold palette journey. Do not plaster foundry vocabulary over every
surface. One `material:` line per résumé card is the right dose.

---

## 3. Locked decisions

Recorded so they are not re-litigated in a later session.

| # | Decision | Rationale |
|---|---|---|
| D1 | Journey is a **mode/overlay launched from the hero**, not a scroll-pinned section | Scroll cannot both advance the journey and leave the hero. Pinning the hero traps the hurried visitor — the exact failure mode to avoid |
| D2 | The hero holds a **live idling miniature** of the world; clicking expands the *same* SVG to fullscreen | Hero becomes "beat 0". Shared-element transition, no jarring context switch |
| D3 | **GSAP** for the journey cinematic | Only library with the needed primitive: timeline **labels** + `tweenTo(label)`. Free including formerly-paid plugins (DrawSVG, MotionPath, MorphSVG, SplitText) |
| D4 | One **paused timeline**, many **drivers** | Animation code knows nothing about input. Add wheel/keys/swipe/autoplay/deep-links later without touching animation |
| D5 | Default driver: **wheel advances one beat** (debounced), plus progress rail, arrow keys, swipe, and a `Play` autoplay | Feels like scrolling (nothing to learn) but always lands cleanly on a beat |
| D6 | **The molten stream is the protagonist**, not a character | Character art and walk cycles are what kill these projects. Animating one path is ~40 lines and looks expensive |
| D7 | Art is **authored as SVG in code**. No AI raster images | Rasters kill the heat-shift recolor, kill per-element animation, kill seamless parallax layers, and weigh MBs vs ~30KB |
| D8 | Text lives in **real DOM** over the SVG, never inside it | Selectable, translatable, screen-readable, indexable |
| D9 | All career facts extracted to **`src/data/journey.js`**, consumed by both modes | Currently hardcoded in ~350 lines of JSX. This is the blocker for everything else |
| D10 | Art style: **build both abstract + silhouette, compare real renders** | User chose to decide from screenshots, not descriptions |

### Still open

- [ ] **O1** Art style final pick (abstract vs silhouette vs blend) — pending render comparison
- [ ] **O2** CRA → Vite migration? `react-scripts` 5 is unmaintained. ~1h. Recommended before Phase 2, not blocking
- [ ] **O3** Does Résumé mode stay the default, or does a first-time visitor get actively offered the journey?
- [ ] **O4** Phase 5 (RAG "ask my portfolio") — needs a backend + API key. Separate project

---

## 4. Architecture

### 4.1 The core pattern — one timeline, many drivers

The animation is a single **paused** GSAP timeline with a label per beat.
Input never touches animation code; it only seeks the timeline.

```js
// timeline.js — knows nothing about input
export function buildJourney({ camera, scenes }) {
  const tl = gsap.timeline({ paused: true, defaults: { ease: "power2.inOut" } });
  tl.addLabel("foundry")
    .to(camera, { x: -1200, heat: 1.0, duration: 2.2 })
    .to(scenes.sparks, { opacity: 1, duration: 0.6 }, "<")
    .addLabel("india")
    .to(camera, { x: -2400, heat: 0.85, duration: 2.2 });
  return tl;
}
```

```js
// useJourneyDriver.js — every input does the same one thing
const goTo = (label) => tl.tweenTo(label, { duration: 1.4 });
// wheel (debounced) -> next/prev     ArrowLeft/Right/Space -> prev/next
// swipe -> next/prev                 rail dot -> jump
// Play -> tl.play()
```

Consequences: the progress rail, keyboard nav, deep links (`#journey/india`)
and the reduced-motion fallback all fall out for free.

### 4.2 The camera is one number

One wide SVG world strip (`viewBox="0 0 7200 1080"`) holding all beats side by
side, terrain flowing continuously between them. Five depth layers as `<g>`.
Camera = `camera.x`; each layer translates by that times its parallax factor.

```js
const layers = [
  { el: ".l-sky",    k: 0.05 },
  { el: ".l-far",    k: 0.25 },
  { el: ".l-mid",    k: 0.55 },
  { el: ".l-ground", k: 1.00 },
  { el: ".l-fore",   k: 1.45 },
];
const setters = layers.map((l) => ({ set: gsap.quickSetter(l.el, "x", "px"), k: l.k }));
// timeline onUpdate:
setters.forEach((s) => s.set(camera.x * s.k));
```

Parallax, depth and travel from one tweened scalar. No canvas, no 3D, no physics.

### 4.3 Heat is one number

`camera.heat` runs 1 → 0 across the journey and drives CSS custom properties
(GSAP tweens CSS vars directly). Accent colour, stream gradient, particle tint
and glow intensity all derive from it. The existing design system already runs
on CSS vars (`--accentColor` in `src/styles/styles.css`), so this composes with
the current site instead of fighting it.

### 4.4 The stream arc (the emotional spine)

| Beat | Stream state |
|---|---|
| Foundry | Steel pours from a ladle. Bright orange, sparks |
| India | Flows on, hot, dust in the air |
| Sweden | **Freezes.** Glow drains, goes solid blue-white |
| Sprinta | Frozen rail resolves into a circuit trace, pulses running along it |
| Architect | Trace **branches** into the real architecture diagram; camera pulls back |

Mechanically: `DrawSVGPlugin` on one path plus a tweened gradient stroke.

The final pull-back is the payoff — you zoom out and see the whole journey *was*
a system being built.

---

## 5. Story beats

Sourced from `src/components/Experience.jsx` and `src/components/Education.jsx`.

| # | Label | Year | Place | Role | Heat |
|---|---|---|---|---|---|
| 0 | `origin` | 2008–2010 | Basque Country, Spain | Mechanical design @ Leartik | 0.25 |
| 1 | `foundry` | 2011–2023 | Spain | Plant Manager / Product Designer @ AML SA | 1.00 |
| 2 | `india` | 2017 | India | International expansion — built a plant from the ground up | 0.85 |
| 3 | `sweden` | 2023–2024 | Växjö, Sweden | .NET Full-stack course @ Lexicon | 0.10 |
| 4 | `sprinta` | 2024–2025 | Sweden | AI Developer & Consultant @ Sprinta — CertumHub, Podium facelift | 0.05 |
| 5 | `architect` | 2025– | Sweden | Lead Developer & Platform Architect — Podium 2.0, SAGE, Larademy, Jambiz Hub, Govensa | 0.00 |

Each beat in `journey.js` carries: `id, year, place, role, org, challenge,
outcome, tech[], links[], material, heat, cameraX`.

### Quest-log framing (Résumé mode + beat cards)

Recruiter-friendly substance in a developer-friendly frame:

```
Level 5 — "The Seven-Year Legacy"
Constraint: 7-year-old tourism platform, one developer, must not break for live customers
Objective:  Feature parity on Angular 21 + Azure Functions, add multi-tenancy
Status:     In progress
```

This is STAR-format résumé content. Pure text + CSS, no animation dependency —
so it can ship independently of everything else.

---

## 6. Phases

Each phase ships standalone. Never sit on a half-finished rewrite.

### Phase 0 — Data extraction · Status: ☐ not started

1. Create `src/data/journey.js` with all 6 beats plus education entries.
2. Refactor `Experience.jsx` to `.map()` over it. Delete the literal markup.
3. Refactor `Education.jsx` the same way.
4. Verify the rendered site is **visually identical** (screenshot before/after).
5. Commit — invisible change, unblocks everything else.

*Optional to fold in here: **O2** CRA → Vite.*

### Phase 1 — Journey prototype (3 beats, both art styles) · Status: ☑ in progress

1. `gsap` installed (3.15.0). ✅
2. Standalone route so the live site cannot destabilise. ✅
3. Build `foundry → india → sweden` — contains every hard problem (parallax
   camera, stream freeze, heat shift, driver plumbing) and none of the busywork.
4. Build the world twice: `WorldAbstract` + `WorldSilhouette`, switchable live.
5. Screenshot both, pick a direction (**O1**).

**Test:** if the stream-freezing moment gives a small thrill when it moves, the
concept is sound and the remaining beats are just more of the same.

### Phase 2 — Full journey · Status: ☐ not started

1. Remaining beats: `origin`, `sprinta`, `architect`.
2. Architect pull-back reveal (camera zooms out into the architecture diagram).
3. Hero idling miniature + expand transition (**D2**).
4. Progress rail, keyboard nav, `Play` autoplay, deep links.
5. Reduced-motion fallback: static illustrated beat list, timeline never built.
6. `React.lazy` the journey bundle so GSAP never touches first paint.

### Phase 3 — Résumé mode twist · Status: ☐ not started

1. `.timeline` rail vertical gradient — molten at the 2008 end, blue at 2025.
   Note the timeline renders newest-first, so orange sits at the **bottom**.
2. `--cardHeat` per `.experience-card`; marker, date icon and `.tech-tag`
   borders derive from it. AML SA reads genuinely warm; Lexicon is the
   transition; Sprinta is cold blue.
3. `IntersectionObserver` sets section heat from the centred card, so the accent
   drifts as you read down. Subtle by design — most people will not notice
   consciously, which is why it works.
4. Quest-log restyle of the cards (section 5).
5. One `material:` line per card — *steel*, *steel + CAD*, *C#*, *TypeScript*.

### Phase 4 — Game mechanics · Status: ☐ not started

Ranked by value per hour:

1. **Skill tree** replacing the `Tools.jsx` icon grid. Nodes unlock
   chronologically, edges show dependencies (C# → .NET → Azure Functions),
   hover shows *"acquired 2024 · shipped in Larademy"*. Better information
   design than the grid *and* it reads as a game.
2. **Command palette (Ctrl+K)** — `whoami`, `goto 2017`, `open larademy`.
   ~1h, signals craft, doubles as the skip-the-story escape hatch.
3. **Architecture puzzle** (the killer set piece) — at the final beat, drag
   unwired nodes (Angular client, Azure Functions, CosmosDB, vector store,
   OpenAI) onto a canvas and connect them. Correct → snaps into the real
   SAGE / Podium 2.0 diagram, annotated. *The only portfolio interaction that
   makes the visitor perform the actual job.*
4. **Collectibles** — 6 hidden items across the journey (molten droplet,
   cinnamon bun in Växjö, Konami code). All 6 unlocks an arcade cabinet with the
   real Unity games (Plastic Slurg, Sokoban, Flapry Blirb) playable in-page.

Explicitly **rejected**: full game-as-portfolio (walk a character round a hub
world). Huge effort, and it walls a recruiter off from the CV.

### Phase 5 — "Ask my portfolio anything" · Status: ☐ not started

RAG chatbot grounded on the real CV and project data. Multi-agent RAG pipelines
are the day job, so a portfolio that *is* one is unfalsifiable proof. Needs an
Azure Functions backend and key handling. Arguably higher career ROI than the
game. Separate project (**O4**).

---

## 7. File map

```
docs/JOURNEY_PLAN.md            # this document
src/data/journey.js             # single source of truth for both modes (Phase 0)
src/journey/
  JourneyStage.jsx              # overlay shell, lazy-loaded
  WorldAbstract.jsx             # art style A — type + geometry + light
  WorldSilhouette.jsx           # art style B — geometric places
  timeline.js                   # buildJourney() — labels + tweens, input-agnostic
  useJourneyDriver.js           # wheel / keys / swipe / rail -> tl.tweenTo(label)
  BeatCard.jsx                  # DOM text overlay
  parallax.js                   # layer table + quickSetter wiring
src/styles/journey.css          # heat variables, stage chrome
```

---

## 8. Guardrails

- Animate **only** `transform` and `opacity` inside the timeline. Nothing that
  triggers layout.
- `prefers-reduced-motion` → journey degrades to a static illustrated beat list;
  the timeline is never built. This is also the accessibility answer.
- Mobile: horizontal pan + swipe fits phones *better* than desktop. Halve
  parallax layers and particles under 768px.
- Particles: ~20 animated elements per beat is plenty. Do not build a particle
  engine.
- Journey bundle lazy-loaded — a visitor who never opens it pays nothing.
- Keep real content in the DOM for SEO (**D8**).

---

## 9. Art sourcing (no drawing required — **D7**)

Everything is authored as SVG coordinates in code: a factory is 3 polygons,
pines are triangles, mountains are a polyline, a ladle is a trapezoid plus an
arc. The iteration loop is render → screenshot → adjust coordinates.

Useful free tools if generated shapes are wanted:

- **Haikei** (app.haikei.app) — layered wave/blob/mountain SVGs. Best fit for
  the terrain bands.
- **SVG Backgrounds**, **Hero Patterns** — textures.
- **Iconify** — 200k+ SVG icons for props and tech marks.
- **unDraw** — free recolourable flat SVG, but a very recognisable "corporate
  illustration people" style that will not fit a landscape journey.

Rejected: AI raster images (**D7**) — they break the heat recolor, per-element
animation, and seamless parallax layering.

---

## 10. Session log

| Date | Session did | Next up |
|---|---|---|
| 2026-09-10 | Brainstorm → locked D1–D10. Branch `feat/interactive-journey`, gsap 3.15.0 installed, this plan written. Phase 1 prototype started. | Finish Phase 1, screenshot both art styles, resolve **O1** |
