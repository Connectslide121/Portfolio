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
| D5 | Default driver: **wheel advances one beat** (debounced), plus progress rail, arrow keys and swipe | Feels like scrolling (nothing to learn) but always lands cleanly on a beat. Autoplay was tried and removed — see D30 |
| D6 | **The molten stream is the protagonist**, not a character | Character art and walk cycles are what kill these projects. Animating one path is ~40 lines and looks expensive |
| D7 | Art is **authored as SVG in code**. No AI raster images | Rasters kill the heat-shift recolor, kill per-element animation, kill seamless parallax layers, and weigh MBs vs ~30KB |
| D8 | Text lives in **real DOM** over the SVG, never inside it | Selectable, translatable, screen-readable, indexable |
| D9 | All career facts extracted to **`src/data/journey.js`**, consumed by both modes | Currently hardcoded in ~350 lines of JSX. This is the blocker for everything else |
| D10 | Art style: **build both abstract + silhouette, compare real renders** | User chose to decide from screenshots, not descriptions |
| D11 | **Silhouette places + the giant year numerals** from the abstract study | Resolves **O1**. Silhouettes carry the story warmth; the numerals give the scale and typographic punch |
| D12 | Stepping scrubs the timeline at its **own natural rate** (`duration` = actual time distance, `ease: "none"`) | A fixed seek duration replayed beats faster than the Play button, and the mismatch was immediately noticeable |
| D13 | **Rail clicks jump instantly** (`tl.seek(target, false)`); wheel / arrows / swipe stay smooth | Picking a year should land on that year, not replay the two decades in between. Note `suppressEvents` must be `false` or `onUpdate` never fires and the camera never moves |
| D14 | **No "Level N" badges anywhere** | User disliked the framing. Quest *names* plus Constraint / Objective / Status stay — they carry the substance without the game scoring |
| D15 | Heat ramps through **three poles** (cold → warm → hot), not two | A straight blue→orange RGB lerp passes through grey mud at the midpoint, which made the middle beats look washed out |
| D16 | On phones the final beat lists the stack as **DOM chips**, not the SVG graph | A 400px portrait viewport shows only ~527 of the 1800 viewBox units. No amount of pull-back makes a wide graph readable there |
| D17 | **Journey mode is the default landing.** Choosing the CV is remembered in `localStorage`; the hero teaser always goes back in | User's call, overriding the original "Résumé is default" framing. Mitigated by D18 — and the CV markup is always in the DOM behind the overlay, so crawlers and screen readers still get it |
| D18 | The way out is **centred at the top, filled with the accent, labelled "View the full CV"** | It has to be unmissable now that the journey is the landing experience. The accent fill means it also travels molten → blue with the story |
| D19 | The stream is **screen-anchored, not part of the parallax world**, and fills left → right as a progress bar | A world-anchored line always spans the full frame however much of it is drawn, so it could never read as progress. Fill is simply `(i + 1) / beats` |
| D20 | The closing beat is **Selected Work** — the featured projects as real, clickable cards | The journey should end on things a visitor can go and open. Links through to the CV's full project list |
| D21 | The final diagram shows the **tech stack in recognisable names**, not the internal architecture | Recruiters are usually not engineers. Internal tooling (SAGE) is left to the CV, which has room to explain what it is |
| D22 | That diagram is a **flow of fully-rounded pills joined by S-curves**, with **no group headers**. Frontend converges into the backend, which then **branches two ways — data and AI as siblings** | A four-column table with headers read as rigid and square, and it implied AI sat downstream of the database. AI is a sibling concern, not a consequence of storage |
| D23 | The closing beat keeps its **explainer card** and puts a **wall of pinned work** beside it: six tiles, absolutely placed at uneven sizes and slight angles | A tidy grid read as a spreadsheet. Hovering straightens a tile and lifts it, like picking a print off a wall. Positions live in the `LAYOUT` table in `ProjectGallery.jsx` |
| D27 | **Logos everywhere**: a mark per organisation on both card types, and a tech logo inside every stack pill | Sourced from each organisation's own site (see below). Tech marks reuse `src/images/tools/` so both modes draw from the same assets |
| D28 | Every logo declares a **`tone`** describing its ARTWORK, and is drawn on a plate/disc coloured from that tone | Not a guess — measured from each file's mean non-transparent luminance, threshold 0.55. Near-white marks (Mithril 0.90, RAG 0.78) were invisible on a white disc; AML's white wordmark is invisible on a light theme. One component then works on the journey's dark scenes and the CV's light theme with no filters and no per-theme assets |
| D39 | The recap's caption is placed from **world coordinates**, like the labels, and the wall's height and padding are **viewport-height aware** | A fixed `top: 47%` and a fixed wall height collided on shorter screens — the work wall sat on top of the caption at 900px and 768px tall. Verified clear at 720, 768, 900, 1080 and 1290 |
| D38 | The lazy journey chunk gets a **full-screen curtain as its Suspense fallback**, and the stage content sits in a **100rem centred column** | `fallback={null}` let the static page paint first and then get covered, which read as landing on the wrong page. And past ~100rem the card and the work wall were pinned to opposite screen edges with a void between them. The overview layer is deliberately NOT bounded — its labels are projected from the world SVG's geometry and would drift off the silhouettes |
| D35 | A **landing beat** opens the journey, carrying the same headline as the static hero from a shared `profile` export | Journey mode is the default landing (D17), so it needed a front door rather than dropping straight into 2005. Both modes now say the same thing because they read the same object |
| D36 | The exit reads **"Static page →"**, not "View the full CV" | The journey now IS the full CV plus the work, so the old label implied it was the lesser view. The button switches presentation, not content |
| D37 | Lookup tables in the journey are **keyed by beat id, never index** | Inserting the landing beat silently broke the overview table and crashed the app through the particle-kind map. Second time an index-keyed table has bitten; `Particles` now also renders nothing for an unknown kind rather than throwing |
| D33 | The overview is **not a mode** — it is the closing beat. Arriving at `recap` tweens `camera.overview` 0→1 as part of the timeline, so reaching the end IS the camera rising, and stepping back lowers it | Removes a button and a keyboard shortcut, and makes the finale one thing: the work wall in the top half, the whole road that led to it laid out below. The `O` key and Overview button are gone |
| D34 | The architect beat gains the **office silhouette**, and the stack diagram fades out as the camera lifts | It was the one beat with no place of its own, so from above it showed a postage-stamp stack diagram. It now shares 2024's office — the same building — with the diagram floating over it in the linear view |
| D31 | The overview is a **camera lift over the real world**, not a diagram of it. `camera.overview` tweens 0→1 and `projectScenes` blends each scene from its stage placement to a spot on a laid-out ground plane | First built as an abstract map of plinths; rejected — the ask was to see the actual silhouettes from above. Blending the same transform is what makes it read as the camera rising rather than a different screen appearing. Silhouettes stay upright: they are elevations, and skewing them flat reads as broken |
| D31b | The laid-out spots are **hand-placed and deliberately uneven**, and **"My Work" is excluded** | A regular alternation just looked like a sine wave. My Work is a gallery, not a place — it has no silhouette to show |
| D32 | Below 900px the overview drops the layout and becomes a **tinted vertical list** | The laid-out view needs width a phone has not got, and labels pinned to world coordinates are unreadable at that size. The list still delivers the point — the whole arc in one view |
| D30 | **No autoplay.** The Play button is gone, along with the ticker that kept the rail in sync; `Space` now means "next" | At the timeline's authored rate you could not finish reading a beat's title before it moved on, and slowing it down would have meant per-beat dwell logic for a feature nobody needs on a seven-beat journey. Stepping is smooth and takes one keypress |
| D29 | `.NET` shares one pill with C# as **"C# / .NET"** | No .NET mark exists in the repo and none is cleanly obtainable. Two identical C# discs side by side looked like a bug; a recruiter reads the two together anyway |
| D26 | Gallery clips **autoplay while the beat is on screen**, and the detail overlay is a **drawer over the lower part only** | With a full-cover overlay there was no hover left to start a video with, so nothing ever played. Autoplay is gated on the beat being current — six clips do not decode through the whole journey — and the drawer leaves the clip visible above it |
| D24 | Project media lives in **`src/data/projectMedia.js`**, shared by Résumé mode and the gallery | The title→media mapping was hardcoded inside `Projects.jsx`; duplicating it for the journey would have guaranteed drift |
| D25 | Locations read as **"Spain"**, not "Basque Country, Spain" | User's preference — simpler, and recognisable to a wider audience |

### Static page restyle (2026-09-12)

The journey became the landing, which left the static page looking like a
different product — its 3D isometric hero render and violet gradients had
nothing to do with the journey's flat silhouettes and molten→cold ramp.

- **Palette**: gradients run molten → cold, the same two poles the journey
  travels. Violet is gone. Interpolated `in oklab`, because sRGB takes
  orange → blue through grey and washed out the middle of the name and every
  section heading.
- **Hero art**: `HeroPanorama.jsx` replaces the 3D render — a foundry, a city,
  and the stream cooling between them. It carries **its own sky** (warm at the
  foundry end, cold at the city end) so the silhouettes can be dark ink the way
  they are in the journey. Without a sky they were light shapes on a dark page,
  which reads inside out — and the panel then works unchanged in either theme.
- **Teaser**: reduced to a pill with one molten dot. It used to carry its own
  stream, which was pure repetition once the hero art carried that motif.
- **Shape language**: buttons are pills, matching the journey's controls.

Two latent bugs fell out of it:

1. `--radius-full` was used by the tech tags and quest pills but **never
   defined**, so they had been rendering square.
2. Theme persistence never worked. `public/index.html` hardcodes
   `<body class="dark-theme">`, and the init code only ever *added* the class —
   so a stored "light" preference could not take effect on reload. It toggles
   both ways now.

### Confirmed

- **ATPL framing** — the plant already existed; the entry reads as establishing
  operations there, transferring the process and training the team. Wording
  confirmed by Jon, 2026-09-11.
- **Shipped.** Merged to `master` and deployed via
  `.github/workflows/deploy.yml` on 2026-09-11.

### Still open

- [x] **O1** ~~Art style final pick~~ — **resolved: silhouette + giant year numerals** (D11)
- [ ] **O2** CRA → Vite migration? `react-scripts` 5 is unmaintained. ~1h. Recommended before Phase 2, not blocking
- [x] **O3** ~~Résumé vs Journey as default~~ — **resolved: Journey is the default** (D17)
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

### Phase 0 — Data extraction · Status: ☑ done

1. Create `src/data/journey.js` with all 6 beats plus education entries.
2. Refactor `Experience.jsx` to `.map()` over it. Delete the literal markup.
3. Refactor `Education.jsx` the same way.
4. Verify the rendered site is **visually identical** (screenshot before/after).
5. Commit — invisible change, unblocks everything else.

Landed as `src/data/journey.js` exporting `experience`, `education`, `beats`
and `architecture`. `Experience.jsx` / `Education.jsx` are now ~15 lines each,
both mapping over the data through a shared `TimelineCard`. Inline links inside
bullets survived via `{Label}` / `*bold*` placeholders resolved by
`src/components/richText.jsx`.

Beats do **not** map 1:1 onto résumé entries (the AML years are two beats, the
two engineering degrees are one), so each beat carries `entryIds` pointing at
the entries it came from.

*Still optional: **O2** CRA → Vite.*

### Phase 1 — Journey prototype (3 beats, both art styles) · Status: ☑ done, **O1** resolved

1. `gsap` installed (3.15.0). ✅
2. Opt-in via `?journey`, mounted in `src/index.js`, `React.lazy`-loaded. ✅
3. `foundry → india → sweden` built — parallax camera, stream draw + freeze,
   heat shift, and the full driver set (wheel / arrows / swipe / rail / Play). ✅
4. Both worlds built and switchable live from the top-left toggle. ✅
5. Renders compared; **silhouette + giant numerals** chosen (D11). The two
   `World*` prototypes were replaced by a single `World.jsx` + `scenes.jsx`.

**Run it:** `npm start` then open `http://localhost:3000/?journey`.

**Verified:** main bundle grew only 1.28 kB — GSAP (28.8 kB gz) and the journey
(5.5 kB gz) land in separate lazy chunks, so a Résumé-mode visitor pays nothing.
No console errors.

#### Gotcha found while building (do not re-discover this)

Parallax anchoring: a layer moving at rate `k` must have its scene clusters
authored at `i * SCENE_W * k` to stay aligned when the camera arrives. But that
also means **scene spacing on a slow layer is narrower than the viewport**, so
neighbouring scenes bleed into frame — the first build showed the India skyline
sitting behind the foundry beat.

Fix, now encoded in `config.js`:

- Slow layers (`far` 0.22, `mid` 0.55) carry **only ambient, repeating** content.
- Anything scene-specific lives on `scene` (k 0.9) or faster **and** is tagged
  `data-atmos={beat.id}` so the timeline crossfades it per beat.
- `FOCAL = 700` — the beat card covers roughly the left 700 viewBox units, so
  scene props must be authored in local `0..1080` to the right of it.

#### More gotchas (sessions 2-3)

1. **Stream draw fraction must be derived from world x, not `(i+1)/n`.**
   `DrawSVG` works in percentages of path *length*, but the stream path
   overdraws far past the world on both sides (`OVERDRAW`). A naive `(i+1)/n`
   therefore ran the leading edge ahead of the camera — by the third beat the
   tip had already left the frame and you stopped seeing it draw at all.
   `drawTo()` in `timeline.js` now converts a target world x into a percentage
   using `PATH_START` / `PATH_SPAN`.

2. **Eagerly importing GSAP anywhere pulls it into the main bundle.** The hero
   teaser originally used GSAP; because `Home.jsx` imports it eagerly, the main
   bundle grew +30 kB and the lazy split was defeated. The teaser is CSS-only
   now. *If you add motion to anything the hero renders, use CSS.*

3. **`tl.seek(t)` suppresses events by default.** The camera and heat are
   applied in the timeline's `onUpdate`, so a plain `seek()` moved the playhead
   without moving the world. Must be `tl.seek(t, false)`.

4. **A deep link must tell the driver its index.** `JourneyStage` seeks straight
   to the hash's beat, but `useJourneyDriver` kept its own `idx` at 0, so
   clicking beat 0 on the rail was a no-op (`clamped === idx.current`). The
   driver now takes a `startIndex`.

5. **The camera pull-back reveals the world's edges.** Scaling the camera group
   to 0.82 widens the visible content box past the nominal frame. Every
   full-width shape overdraws by `OVERDRAW` horizontally and down to `FLOOR`.

6. **The stage needs an explicit `z-index`.** `position: fixed` alone left the
   navbar (100) and sidebar painting over it. Stage is `2000`.

7. **GSAP writes `translate: none` when it takes over transforms.** The beat
   card was never actually vertically centred: its CSS `transform:
   translateY(-50%)` was replaced by GSAP's `y` tween, and moving it to the
   standalone `translate` property did not help either. Fixed by wrapping each
   card in a full-height `.j-card-slot` that carries `data-card` — GSAP
   animates the slot, flexbox centres the card inside it.

8. **Never key a beat special-case on the index.** `isFinal = i === BEATS.length
   - 1` silently moved the stack reveal and the camera pull-back onto the new
   closing "work" beat the moment it was added. Key on `beat.id`.

9. **A hash-only URL change is a same-document navigation.** Pasting
   `#journey/india` while the page is already open did nothing, because React
   never re-read it. `App.jsx` now listens for `hashchange`. Note
   `replaceState` (which the stage uses to keep the URL current) does *not*
   fire the event, so there is no loop.

### Phase 2 — Full journey · Status: ☑ done

1. All six beats live: `origin`, `foundry`, `india`, `sweden`, `sprinta`, `architect`. ✅
2. Architect pull-back reveal — camera scales to 0.82 and the stream branches
   into the real architecture graph (Angular 21 / React Native → SAGE → Azure
   Functions → CosmosDB / Vector Store / Azure AI Foundry). ✅
3. Hero teaser + expand into the stage (**D2**). Deliberately **CSS-animated**,
   not GSAP — see the bundle gotcha below. ✅
4. Rail (instant jumps), keyboard, wheel, swipe, `Play`, `#journey/<id>` deep
   links, `Esc` / "Skip to CV" to exit. ✅
5. Reduced-motion fallback: `JourneyStatic.jsx`, no timeline ever built. ✅
6. `React.lazy` in `App.jsx`; `body` scroll locked while open; stage at
   `z-index: 2000` (the projects modal is 1000). ✅

### Phase 3 — Résumé mode twist · Status: ☑ done

1. `.timeline` rail vertical gradient — molten at the 2008 end, blue at 2025.
   Note the timeline renders newest-first, so orange sits at the **bottom**.
2. `--cardHeat` per `.experience-card`; marker, date icon and `.tech-tag`
   borders derive from it. AML SA reads genuinely warm; Lexicon is the
   transition; Sprinta is cold blue.
3. `IntersectionObserver` sets section heat from the centred card, so the accent
   drifts as you read down. Subtle by design — most people will not notice
   consciously, which is why it works.
4. Quest-log restyle of the cards (section 5) — quest name + Constraint /
   Objective / Status, no level badge (D14).
5. One `material:` line per card — *steel*, *cast iron & steel*, *C#*,
   *TypeScript + vectors*, *systems*.

All five landed. `useTimelineHeat.jsx` drives `--sectionHeat`; each card carries
`--cardHeat` and derives `--heatAccent` via `color-mix`.

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

## 8b. Logo assets

Organisation marks live in `src/images/orgs/`, pulled from each organisation's
own site and downscaled to a 96px cap (PIL, WebP q92) — AML's wordmark went
from 108 kB to 2.8 kB. SVGs are kept as vectors.

| id | file | source | tone |
|---|---|---|---|
| `aml` | `aml.webp` | amlsa.com `/img/logo.png` (found via the `a.logo` CSS background) | light |
| `lea-artibai` | `lea-artibai.webp` | leartik.eus `/images/logo_header_lea_2026.png` | colour |
| `london-met` | `london-met.svg` | londonmet.ac.uk site-assets | dark |
| `lexicon` | `lexicon.svg` | lexicongruppen.se `/media/wi5hphtd/lexicon-logo.svg` | colour |
| `atpl` | `atpl.webp` | arihanttechnocastindia.com `/wp-content/themes/atpl/images/logo.png` | dark |
| `sprinta` | `sprinta.webp` | sprinta.se `/assets/Sprinta_webb.png` (found in the Angular bundle) | dark |
| `github` | reuses `tools/github.webp` | already in the repo | dark |

To add or replace one: drop the file in `src/images/orgs/`, then add an entry
to `src/data/orgLogos.js` with its `tone`. Measure the tone rather than
eyeballing it:

```py
from PIL import Image
im = Image.open("file.webp").convert("RGBA"); im.thumbnail((64, 64))
vis = [(r,g,b) for r,g,b,a in im.getdata() if a > 40]
print(sum(0.2126*r + 0.7152*g + 0.0722*b for r,g,b in vis) / len(vis) / 255)
# > 0.55 -> tone "light" (dark plate);  <= 0.55 -> tone "dark" (light plate)
```

**Caveat:** the test assumes transparency. A fully opaque file has its
background baked in, which dominates the mean and gives the wrong answer —
ATPL reads 0.59 ("light") despite being black text, because it carries a
white background. Check alpha coverage first: if the file is ~100% opaque,
match the plate to its baked background instead (white background -> tone
`"dark"`, so the white plate blends in seamlessly).

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
| 2026-09-10 | Brainstorm → locked D1–D10. Branch `feat/interactive-journey`, gsap 3.15.0, this plan. Phase 1 prototype built and rendered in both art styles. Found and fixed the parallax scene-bleed gotcha. Footer year made dynamic (separate commit, cherry-pick to master). | Resolve **O1** art style, then Phase 0 before Phase 2 |
| 2026-09-11 (8) | **Merged to `master` and deployed.** Then fixed a recap collision only visible on short viewports (D39) — caught by checking the live site at 900px rather than trusting the 1290px test. ATPL wording confirmed. | **Phase 4**; **O2** Vite; **O4** |
| 2026-09-11 (7) | Killed the static-page flash on load and bounded the layout on wide screens (D38). Added the hero artwork to the landing beat. | **Phase 4**; **O2** Vite; **O4** |
| 2026-09-11 (6) | Added the landing beat (D35), relabelled the exit (D36), removed the see-all button from the recap. Keyed the overview table by beat id after inserting a beat crashed the app (D37). | **Phase 4**; **O2** Vite; **O4** |
| 2026-09-11 (5) | Merged the overview into the closing beat as **Recap** (D33): work wall above, journey laid out below, no mode and no button. The trail now draws itself on as the camera rises. Architect beat given the office silhouette (D34). | **Phase 4**; **O2** Vite; **O4** |
| 2026-09-11 (4) | Rebuilt the overview as a camera lift over the real world (D31, D31b) after the abstract-map version was rejected. Excluded My Work from it. | superseded next session by D33 |
| 2026-09-11 (3) | Receding past reworked twice more: the landmark mask was still cutting scenes down, so it is now one wide mask feathering only the extreme edges. Active scene refitted for tall windows (slice crops the SIDES). Work slide scrimmed. Built the isometric overview (D31, D32). Recentred the AML entry on the twelve years rather than the India trip; "Selected Work" → "My Work". | **Phase 4** game mechanics; **O2** Vite; **O4** |
| 2026-09-11 (2) | Added the ATPL mark: **Arihant Technocast Private Limited**, AML's Indian foundry — the plant stood up in 2017. The India beat now carries both marks and names the entity in the CV bullet. Removed autoplay entirely (D30). | **Phase 4**, **O2** Vite, **O4** |
| 2026-09-11 | Logos throughout (D27–D29). Pulled the five real organisation logos from their own sites, optimised them into `src/images/orgs/` (AML went 108 kB → 2.8 kB), and added marks to the journey beat cards and the CV timeline cards. Every stack pill now carries its tech logo on a tone-matched disc. | ~~ATPL~~ resolved next session |
| 2026-09-10 (5) | Reworked the closing beat to what it is now (D23, D26): explainer card restored beside a scattered, tilted wall of six tiles; clips autoplay while the beat is current; the detail overlay became a bottom drawer so the clip stays visible. Fixed the touch branch, which set the drawer opaque without sliding it in — on a real phone the tiles showed nothing. | **Phase 4** game mechanics; then **O2** Vite, **O4** |
| 2026-09-10 (4) | Closing beat became a media gallery: real screenshots and clips, detail overlays, shared project-media map (D24) with `Projects.jsx` pointed at it. Simplified locations (D25). | superseded next session by D23/D26 |
| 2026-09-10 (3) | Journey is now the default landing (D17) with a prominent centred way out (D18). Stream reworked into a screen-anchored progress bar (D19). Added the **Selected Work** closing beat linking through to the full project list (D20). Replaced the internal architecture graph with a recognisable tech stack (D21), then reshaped it from rigid columns into a pill-and-curve flow with AI branching off the backend (D22). Fixed the never-actually-centred beat card, an index-keyed special case that broke when the new beat was added, and hash-only navigation. | **Phase 4** game mechanics; then **O2** Vite, **O4** |
| 2026-09-10 (cont.) | **O1 resolved** (D11). Phases 0, 2 and 3 all landed: data extraction, all six beats, architecture pull-back, hero teaser, rail / keyboard / swipe / autoplay / deep links, reduced-motion fallback, and the hot→cold résumé timeline with quest framing. Fixed scrub pacing (D12), rail instant-jump (D13), removed level badges (D14), three-pole heat ramp (D15), mobile architecture chips (D16). Six current renders in `docs/prototype-shots/`. | **Phase 4** game mechanics — skill tree and Ctrl+K palette are the cheap wins; the architecture puzzle is the headline one. Then **O2** Vite, **O3**, **O4** |

### Current renders

`docs/prototype-shots/` — one per beat (`beat-0-origin` … `beat-6-work`),
plus `beat-6-work-hover.png` showing a tile's detail overlay, and `mobile.png`.

### Verified

- Main bundle 92.3 kB gz (was 89.5 kB before any of this); GSAP 28.8 kB and the
  journey 6.2 kB sit in separate lazy chunks.
- No console errors across all six beats, résumé mode, and both tabs.
- No horizontal overflow at 400px; rail fits (290px of 400px).
- Rail jump 2025 → 2005 lands in under 400ms (heat 0 → 0.400) instead of
  scrubbing the whole timeline.
