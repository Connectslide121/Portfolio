import React, { useCallback, useEffect, useRef, useState } from "react";
import "../styles/journey.css";
import { stack, profile, chapters } from "../data/journey";
import heroArt from "../images/home-image.webp";

import { BEATS } from "./config";
import { buildJourney } from "./timeline";
import { useJourneyDriver } from "./useJourneyDriver";
import World from "./World";
import { ProgressStream } from "./parts";
import ProjectGallery, { WorkSheet } from "./ProjectGallery";
import { OrgMarks } from "../components/OrgMark";
import JourneyOverview from "./JourneyOverview";
import JourneyStatic from "./JourneyStatic";
import JourneyGlobe from "./JourneyGlobe";
import JourneyTrail from "./JourneyTrail";
import { heatColor } from "./heat";
import ThemeToggle from "../components/ThemeToggle";

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** #journey/india deep-links straight to that beat. */
const beatFromHash = () => {
  const id = window.location.hash.replace(/^#\/?journey\/?/, "");
  const i = BEATS.findIndex((b) => b.id === id);
  return i < 0 ? 0 : i;
};

export default function JourneyStage({ onExit }) {
  const stageRef = useRef(null);
  const [tl, setTl] = useState(null);
  const built = useRef(null);

  // No timeline at all under reduced motion — the beats are served as a
  // readable list instead (guardrail in docs/JOURNEY_PLAN.md §8).
  const [reduced] = useState(prefersReducedMotion);
  const [start] = useState(beatFromHash);

  // The expanded project on the recap's narrow-screen list, if one is open.
  const [work, setWork] = useState(null);
  const closeWork = useCallback(() => setWork(null), []);

  useEffect(() => {
    if (reduced) return;
    const root = stageRef.current;
    if (!root) return;

    const b = buildJourney({ root });
    built.current = b;
    setTl(b.tl);

    if (start === 0) {
      b.tl.tweenTo(BEATS[0].id, { duration: 1.2 });
    } else {
      b.tl.seek(BEATS[start].id);
      b.render();
    }

    return () => {
      // destroy(), not tl.kill(): the pointer lean owns a listener pair and a
      // rAF that the timeline knows nothing about.
      b.destroy();
      built.current = null;
      setTl(null);
    };
  }, [reduced, start]);

  // Heat writes the active palette as inline SVG variables. Repaint once when
  // the shared theme changes so a stationary scene switches immediately too.
  useEffect(() => {
    const refreshTheme = () => built.current?.render();
    window.addEventListener("jm-theme-change", refreshTheme);
    return () => window.removeEventListener("jm-theme-change", refreshTheme);
  }, []);

  // An open sheet parks every driver: a wheel, a swipe or an arrow key meant
  // for the project you are reading must not step the story behind it.
  const { index, jumpTo, next, prev } = useJourneyDriver(
    tl,
    stageRef,
    reduced || !!work,
    start,
  );

  const atRecap = BEATS[index]?.id === "recap";

  // Keep the URL shareable as you move.
  useEffect(() => {
    if (reduced) return;
    const id = BEATS[index]?.id;
    if (id) window.history.replaceState(null, "", `#journey/${id}`);
  }, [index, reduced]);

  const nearEnd = index >= BEATS.length - 2;

  if (reduced) return <JourneyStatic onExit={onExit} />;

  return (
    <div
      className="j-stage"
      ref={stageRef}
      data-recap={atRecap ? "true" : "false"}
    >
      <World />

      {/* Where on earth each beat happened, half-sunk behind the map. Before
          .j-atmos in the DOM so the grain and vignette sit over it too — it
          belongs to the world, not to the chrome. */}
      <JourneyGlobe />

      {/* Film, not vector. Grain and a vignette over the world — and only the
          world, never the cards: the single biggest reason flat SVG reads as
          clip art is that it has no surface, and the single fastest way to
          make text look cheap is to lay noise over it. */}
      <div className="j-atmos" aria-hidden="true" />

      {/* A breath of the arriving beat's accent across the frame, driven from
          the timeline so it scrubs with everything else. */}
      <div className="j-bloom" data-bloom aria-hidden="true" />

      {/* Beat content lives in real DOM over the SVG — selectable, readable,
          indexable (D8). The slot carries data-card so GSAP animates the
          wrapper: it owns the transform, leaving the content free to be
          centred by flexbox. (GSAP writes `translate: none` when it takes over
          transforms, so a CSS `translate: 0 -50%` on the animated element is
          wiped out.) */}
      <div className="j-cards">
        {BEATS.map((beat) => (
          <div
            className="j-card-slot"
            data-card={beat.id}
            data-kind={beat.kind || "story"}
            key={beat.id}
          >
            {beat.kind === "intro" ? (
              <>
                <article className="j-card j-intro">
                  <p className="j-intro-eyebrow">the journey · 2005 → today</p>
                  <h1>{profile.name}</h1>
                  <h2>{profile.title}</h2>
                  <p className="j-intro-blurb">{profile.lede}</p>

                  {/* The three acts, before the first scene. Without this the
                      journey opens on engineering studies and a foundry, and
                      a recruiter who came for a software CV has no reason yet
                      to believe they are in the right place. */}
                  <ol className="j-chapters">
                    {chapters.map((act) => (
                      <li key={act.id} style={{ "--tint": heatColor(act.heat) }}>
                        <span className="j-ch-span">{act.span}</span>
                        <span className="j-ch-title">{act.title}</span>
                        <span className="j-ch-detail">{act.detail}</span>
                      </li>
                    ))}
                  </ol>

                  <button type="button" className="j-intro-go" onClick={next}>
                    Walk me through it <span aria-hidden="true">→</span>
                  </button>
                  <p className="j-intro-aside">
                    Seven stops — or pick any of them off the map below.
                  </p>
                </article>
                <img className="j-intro-art" src={heroArt} alt="" />
              </>
            ) : beat.kind === "projects" ? null : (
              <article className="j-card">
                <div className="j-card-head">
                  <span className="j-year">{beat.year}</span>
                  <OrgMarks ids={beat.orgs} size="lg" />
                </div>
                <h2>{beat.role}</h2>
                <h3>
                  {beat.org} <span className="j-dot">·</span> {beat.place}
                </h3>

                {beat.note ? (
                  <p className="j-card-note">{beat.note}</p>
                ) : (
                  <dl>
                    <dt>Constraint</dt>
                    <dd>{beat.constraint}</dd>
                    <dt>Objective</dt>
                    <dd>{beat.objective}</dd>
                  </dl>
                )}

                {/* The things you can actually go and open. The résumé wraps
                    these in bullet prose; the card has no room for that, so
                    they stand on their own as links. */}
                {beat.products && (
                  <ul className="j-products">
                    {beat.products.map((product) => (
                      <li key={product.label}>
                        <a
                          href={product.href}
                          target="_blank"
                          rel="noreferrer"
                          title={`${product.label} — opens in a new tab`}
                        >
                          {product.label}
                          <span aria-hidden="true">↗</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                )}

                {beat.id === "architect" && (
                  <ul className="j-arch-chips">
                    {stack.flatMap((group) =>
                      group.items.map((item) => (
                        <li key={item} data-kind={group.tint}>
                          {item}
                        </li>
                      )),
                    )}
                  </ul>
                )}

                <p className="j-material">
                  material: <strong>{beat.material}</strong>
                  <span
                    className={`j-status${beat.status === "In progress" ? " active" : ""}`}
                  >
                    {beat.status}
                  </span>
                </p>
              </article>
            )}

            {/* The recap: the work wall above, the journey laid out below. */}
            {beat.kind === "projects" && (
              <ProjectGallery
                /* The list's stills stand down while a sheet is open: they
                   are behind the scrim anyway, and a phone has a small,
                   shared pool of video decoders — the one clip actually
                   playing should have it to itself. */
                mounted={nearEnd && !work}
                active={atRecap}
                onOpen={setWork}
              />
            )}
          </div>
        ))}
      </div>

      {/* chrome. Journey mode is the default landing (D17), so the way out to
          the CV has to be unmissable: centred, filled, and plainly labelled. */}
      <div className="j-topbar">
        <p className="j-brand">
          Jon Mendizabal <span className="j-dot">·</span> the journey
        </p>
        <ThemeToggle id="journey-theme-toggle" />
        <button className="j-exit" onClick={onExit}>
          Classic view <span aria-hidden="true">→</span>
        </button>
      </div>

      <JourneyTrail
        index={index}
        onPick={jumpTo}
        onPrev={prev}
        onNext={next}
      />

      <ProgressStream />

      {/* The recap's labels stand on the places laid out below the work. */}
      {atRecap && <JourneyOverview index={index} onPick={jumpTo} />}

      <p className="j-hint">scroll · arrows · swipe</p>

      {/* A project expanded out of the recap's list: the clip playing at a
          size that shows something, the full description, and the links. */}
      {work && <WorkSheet project={work} onClose={closeWork} />}
    </div>
  );
}
