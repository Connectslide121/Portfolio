import React, { useEffect, useRef, useState } from "react";
import "../styles/journey.css";
import { stack } from "../data/journey";

import { BEATS } from "./config";
import { buildJourney } from "./timeline";
import { useJourneyDriver } from "./useJourneyDriver";
import World from "./World";
import { ProgressStream } from "./parts";
import ProjectGallery from "./ProjectGallery";
import { OrgMarks } from "../components/OrgMark";
import JourneyStatic from "./JourneyStatic";

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

  // No timeline at all under reduced motion — the beats are served as a
  // readable list instead (guardrail in docs/JOURNEY_PLAN.md §8).
  const [reduced] = useState(prefersReducedMotion);
  const [start] = useState(beatFromHash);

  useEffect(() => {
    if (reduced) return;
    const root = stageRef.current;
    if (!root) return;

    const built = buildJourney({ root });
    setTl(built.tl);

    if (start === 0) {
      built.tl.tweenTo(BEATS[0].id, { duration: 1.2 });
    } else {
      built.tl.seek(BEATS[start].id);
      built.render();
    }

    return () => {
      built.tl.kill();
      setTl(null);
    };
  }, [reduced, start]);

  const { index, jumpTo, next, prev, playing, togglePlay } = useJourneyDriver(
    tl,
    stageRef,
    reduced,
    start,
  );

  // Keep the URL shareable as you move.
  useEffect(() => {
    if (reduced) return;
    const id = BEATS[index]?.id;
    if (id) window.history.replaceState(null, "", `#journey/${id}`);
  }, [index, reduced]);

  // Leave the journey and land on the projects section of the CV.
  const exitToProjects = () => {
    onExit();
    requestAnimationFrame(() => {
      document
        .getElementById("projects")
        ?.scrollIntoView({ behavior: "smooth" });
    });
  };

  const nearEnd = index >= BEATS.length - 2;

  if (reduced) return <JourneyStatic onExit={onExit} />;

  return (
    <div className="j-stage" ref={stageRef}>
      <World />

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

            {/* The closing beat keeps its explainer card and puts the wall of
                actual work beside it. */}
            {beat.kind === "projects" && (
              <ProjectGallery
                mounted={nearEnd}
                active={BEATS[index]?.id === "work"}
                onSeeAll={exitToProjects}
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
        <button className="j-exit" onClick={onExit}>
          View the full CV <span aria-hidden="true">→</span>
        </button>
      </div>

      <div className="j-rail">
        <button
          className="j-nav"
          onClick={prev}
          disabled={index === 0}
          aria-label="Previous beat"
        >
          ‹
        </button>
        <ol>
          {BEATS.map((beat, i) => (
            <li key={beat.id}>
              <button
                className={i === index ? "on" : ""}
                onClick={() => jumpTo(i)}
                aria-current={i === index}
                title={`${beat.year} — ${beat.role}`}
              >
                <span className="j-tick" />
                <span className="j-rail-label">{beat.railLabel}</span>
              </button>
            </li>
          ))}
        </ol>
        <button
          className="j-nav"
          onClick={next}
          disabled={index === BEATS.length - 1}
          aria-label="Next beat"
        >
          ›
        </button>
        <button className="j-play" onClick={togglePlay}>
          {playing ? "Pause" : "Play"}
        </button>
      </div>

      <ProgressStream />

      <p className="j-hint">scroll · arrows · swipe · space to play</p>
    </div>
  );
}
