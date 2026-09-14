import React, { useEffect, useRef, useState } from "react";
import { galleryProjects, projectBlurbs, beats } from "../data/journey";
import { mediaFor } from "../data/projectMedia";
import { featuredProjects, allProjects } from "../components/projectList";
import { techFor } from "../data/projectTech";

// A wall of pinned work: real screenshots and clips at deliberately uneven
// sizes, angles and positions. A tidy grid read as a spreadsheet; this is
// closer to prints tacked up on a wall.
//
// On phones there is no wall. Six tiles squeezed into a scrolling half-screen
// showed neither the work nor the clips — it read as a broken grid. The same
// six projects are listed there instead (D62), each row opening as a sheet (D63).

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
 * The still for a list row: the clip's own first frame, never playing.
 *
 * `preload="metadata"` and nothing more. These clips are tens of megabytes
 * (see D66) — six of them warmed for six thumbnails the size of a stamp would
 * cost more than the rest of the site put together.
 *
 * The frame is painted by seeking in JS rather than by asking for `#t=0.1` in
 * the URL. A poster-less video shows a black box until it has seeked
 * somewhere, so something has to do it — but a fragment makes this a
 * different URL from the one the sheet opens, which is a second fetch of the
 * same clip. One URL, one fetch, and the sheet reuses what this pulled.
 */
function Thumb({ project, mounted }) {
  const media = mediaFor(project.title);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const paint = () => {
      try {
        el.currentTime = 0.1;
      } catch {
        /* a clip shorter than that, or metadata that never arrived */
      }
    };
    el.addEventListener("loadedmetadata", paint, { once: true });
    return () => el.removeEventListener("loadedmetadata", paint);
  }, [mounted]);

  // Empty until the recap is close — six metadata fetches should not happen
  // while the reader is still in 2005. The box keeps its size either way, so
  // the rows do not jump when the stills arrive.
  return (
    <span className="j-work-thumb" aria-hidden="true">
      {!mounted ? null : media.type === "video" ? (
        <video ref={ref} src={media.src} muted playsInline preload="metadata" />
      ) : (
        <img src={media.src} alt="" loading="lazy" />
      )}
    </span>
  );
}

/**
 * The phone version: one row per project, nothing to hover. The row is a
 * button rather than a card with links in it — a thumb aiming at a 0.68rem
 * link pill hits the row instead, so the row is the target and the detail
 * sheet is where the links live at a size worth tapping.
 */
function WorkRow({ project, mounted, onOpen }) {
  return (
    <li>
      <button type="button" className="j-work" onClick={() => onOpen(project)}>
        <Thumb project={project} mounted={mounted} />
        <span className="j-work-text">
          <span className="j-work-title">{project.title}</span>
          <span className="j-work-blurb">
            {projectBlurbs[project.title] || project.description}
          </span>
          {project.technologies && (
            <span className="j-work-tech">
              {project.technologies
                .slice(0, 4)
                .map((tech) => techFor(tech)?.name || tech)
                .join(" · ")}
            </span>
          )}
        </span>
        <span className="j-work-more" aria-hidden="true">
          ›
        </span>
      </button>
    </li>
  );
}

/**
 * The expanded project, over the whole stage.
 *
 * This is where the clip actually plays, at a size that shows something, and
 * where the full description and the links live. Rendered by JourneyStage
 * rather than from in here, because opening it also has to take the journey's
 * drivers out of the way — a wheel or a swipe over an open sheet must not
 * step the story behind it.
 */
export function WorkSheet({ project, onClose }) {
  const media = mediaFor(project.title);
  const panelRef = useRef(null);
  const links = linksFor(project);

  useEffect(() => {
    panelRef.current?.focus();

    // Capture phase, and stop there: App.jsx listens for Escape on window to
    // leave journey mode altogether, and it registered first — bubbling would
    // close the whole journey behind the sheet.
    const onKey = (e) => {
      if (e.key !== "Escape") return;
      e.stopPropagation();
      e.preventDefault();
      onClose();
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [onClose]);

  return (
    <div className="j-sheet" role="dialog" aria-modal="true" aria-label={project.title}>
      <div className="j-sheet-scrim" onClick={onClose} />

      <div className="j-sheet-panel" ref={panelRef} tabIndex={-1}>
        <button type="button" className="j-sheet-close" onClick={onClose}>
          Close <span aria-hidden="true">✕</span>
        </button>

        <div className="j-sheet-media">
          {media.type === "video" ? (
            <video src={media.src} autoPlay muted loop playsInline preload="auto" />
          ) : (
            <img src={media.src} alt={project.title} />
          )}
        </div>

        <div className="j-sheet-body">
          <h3>{project.title}</h3>
          {project.date && <p className="j-sheet-date">{project.date}</p>}
          <p className="j-sheet-blurb">{project.description}</p>

          {project.details && (
            <ul className="j-sheet-details">
              {project.details.map((detail) => (
                <li key={detail}>{detail}</li>
              ))}
            </ul>
          )}

          {project.technologies && (
            <ul className="j-sheet-tech">
              {project.technologies.map((tech) => {
                const info = techFor(tech);
                return (
                  <li key={tech}>
                    {info && <img src={info.icon} alt="" />}
                    {info?.name || tech}
                  </li>
                );
              })}
            </ul>
          )}

          <div className="j-sheet-links">
            {links.map((link) => (
              <a key={link.label} href={link.href} target="_blank" rel="noreferrer">
                {link.label}
                <span aria-hidden="true"> ↗</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProjectGallery({ mounted, active, onOpen }) {
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
            <WorkRow
              key={project.title}
              project={project}
              mounted={mounted}
              onOpen={onOpen}
            />
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
