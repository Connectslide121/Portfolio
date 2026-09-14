import React, { useEffect, useRef, useState } from "react";
import { galleryProjects, projectBlurbs, beats } from "../data/journey";
import { mediaFor } from "../data/projectMedia";
import { featuredProjects, allProjects } from "../components/projectList";

// A wall of pinned work: real screenshots and clips at deliberately uneven
// sizes, angles and positions. A tidy grid read as a spreadsheet; this is
// closer to prints tacked up on a wall.
//
// On phones there is no wall. Six tiles squeezed into a scrolling half-screen
// showed neither the work nor the clips — it read as a broken grid. The same
// six projects are listed there instead (D62).

const ALL = [...featuredProjects, ...allProjects];
const byTitle = (title) => ALL.find((p) => p.title === title);

// Hand-placed, as percentages of the wall. Kept inside 0..100 on both axes,
// with only slight overlaps so the arrangement looks casual rather than
// broken. Hovering straightens a tile and lifts it above its neighbours.
const LAYOUT = [
  { l: "0%", t: "4%", w: "37%", h: "56%", rot: "-1.6deg", z: 3 },
  { l: "40%", t: "0%", w: "27%", h: "43%", rot: "1.5deg", z: 2 },
  { l: "70%", t: "7%", w: "19%", h: "39%", rot: "-2.4deg", z: 1 },
  { l: "3%", t: "64%", w: "31%", h: "36%", rot: "2deg", z: 2 },
  { l: "37%", t: "47%", w: "30%", h: "48%", rot: "-1.1deg", z: 4 },
  { l: "70%", t: "51%", w: "20%", h: "42%", rot: "2.6deg", z: 2 },
];

// The width the wall needs. Below it the list takes over — same breakpoint the
// recap's other mobile rules use, so layout and markup switch together.
const NARROW = "(max-width: 900px)";

function useNarrow() {
  const [narrow, setNarrow] = useState(
    () => typeof window !== "undefined" && window.matchMedia(NARROW).matches,
  );

  useEffect(() => {
    const mq = window.matchMedia(NARROW);
    const onChange = (e) => setNarrow(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return narrow;
}

const linksFor = (project) =>
  [
    project.repository && { label: "Code", href: project.repository },
    project.livedemo && {
      label: project.button || "Live demo",
      href: project.livedemo,
    },
  ].filter(Boolean);

function Tile({ project, place, active }) {
  const media = mediaFor(project.title);
  const videoRef = useRef(null);

  // Autoplay, but only while this beat is on screen — six clips decoding
  // through the whole journey would be wasteful, and the overlay means there
  // is no hover left to start them with.
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    if (active) {
      el.play().catch(() => {});
    } else {
      el.pause();
      el.currentTime = 0;
    }
  }, [active]);

  const links = linksFor(project);

  return (
    <figure
      className="j-tile"
      style={{
        "--l": place.l,
        "--t": place.t,
        "--w": place.w,
        "--h": place.h,
        "--rot": place.rot,
        zIndex: place.z,
      }}
    >
      {media.type === "video" ? (
        <video
          ref={videoRef}
          className="j-tile-media"
          muted
          loop
          playsInline
          preload="auto"
          aria-label={project.title}
        >
          <source src={media.src} type="video/mp4" />
        </video>
      ) : (
        <img className="j-tile-media" src={media.src} alt={project.title} loading="lazy" />
      )}

      {/* Readable without hovering — the wall is not a guessing game. */}
      <figcaption className="j-tile-label">{project.title}</figcaption>

      {/* Detail drawer. Covers the lower part only, so the clip keeps playing
          in view above it. */}
      <div className="j-tile-detail">
        <h4>{project.title}</h4>
        <p>{projectBlurbs[project.title] || project.description}</p>
        {project.technologies && (
          <p className="j-tile-tech">{project.technologies.slice(0, 5).join(" · ")}</p>
        )}
        <div className="j-tile-links">
          {links.map((link) => (
            <a key={link.label} href={link.href} target="_blank" rel="noreferrer">
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </figure>
  );
}

/**
 * The phone version: one row per project, nothing to hover and nothing to
 * decode. Title, what it is, what it was built with, and the links — the
 * whole point of the wall, minus the wall.
 */
function WorkRow({ project }) {
  const links = linksFor(project);

  return (
    <li className="j-work">
      <h3>{project.title}</h3>
      <p className="j-work-blurb">
        {projectBlurbs[project.title] || project.description}
      </p>
      <p className="j-work-foot">
        {project.technologies && (
          <span className="j-work-tech">
            {project.technologies.slice(0, 4).join(" · ")}
          </span>
        )}
        {links.map((link) => (
          <a key={link.label} href={link.href} target="_blank" rel="noreferrer">
            {link.label}
            <span aria-hidden="true"> ↗</span>
          </a>
        ))}
      </p>
    </li>
  );
}

export default function ProjectGallery({ mounted, active }) {
  const projects = galleryProjects.map(byTitle).filter(Boolean);
  const narrow = useNarrow();

  const recap = beats.find((b) => b.id === "recap");

  return (
    <div className={`j-gallery${narrow ? " j-gallery-list" : ""}`}>
      <header>
        <h2>My Work</h2>
        <p>{recap?.note}</p>
      </header>

      {narrow ? (
        <ol className="j-worklist">
          {projects.map((project) => (
            <WorkRow key={project.title} project={project} />
          ))}
        </ol>
      ) : (
        <div className="j-wall">
          {mounted &&
            projects.map((project, i) => (
              <Tile
                key={project.title}
                project={project}
                place={LAYOUT[i % LAYOUT.length]}
                active={active}
              />
            ))}
        </div>
      )}
    </div>
  );
}
