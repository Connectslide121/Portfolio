import React, { useCallback, useRef } from "react";
import { galleryProjects, projectBlurbs } from "../data/journey";
import { mediaFor } from "../data/projectMedia";
import { featuredProjects, allProjects } from "../components/projectList";

// An editorial gallery wall: uneven tiles of real screenshots and clips, each
// opening a detail overlay on hover or keyboard focus. This replaces the
// placeholder SVG frames that used to sit behind the closing beat.

const ALL = [...featuredProjects, ...allProjects];
const byTitle = (title) => ALL.find((p) => p.title === title);

// Uneven spans so the wall reads as a gallery rather than a spreadsheet.
// These tile a 4x3 grid exactly (4 + 1 + 1 + 1 + 1 + 2 + 1 + 1 = 12 cells),
// so dense auto-placement leaves no holes:
//   row 1: [ hero    ][ 1 ][ 2 ]
//   row 2: [ hero    ][ 3 ][ 4 ]
//   row 3: [ wide    ][ 6 ][ 7 ]
const SPANS = [
  { column: "span 2", row: "span 2" }, // hero
  { column: "span 1", row: "span 1" },
  { column: "span 1", row: "span 1" },
  { column: "span 1", row: "span 1" },
  { column: "span 1", row: "span 1" },
  { column: "span 2", row: "span 1" }, // wide
  { column: "span 1", row: "span 1" },
  { column: "span 1", row: "span 1" },
];

function Tile({ project, span, playable }) {
  const media = mediaFor(project.title);
  const videoRef = useRef(null);

  // Only play on pointer/focus, so eight clips are not decoding at once.
  const play = useCallback(() => {
    const el = videoRef.current;
    if (el) el.play().catch(() => {});
  }, []);
  const pause = useCallback(() => {
    const el = videoRef.current;
    if (!el) return;
    el.pause();
    el.currentTime = 0;
  }, []);

  const links = [
    project.repository && { label: "Code", href: project.repository },
    project.livedemo && { label: project.button || "Live demo", href: project.livedemo },
  ].filter(Boolean);

  return (
    <figure
      className="j-tile"
      style={{ gridColumn: span.column, gridRow: span.row }}
      onMouseEnter={play}
      onMouseLeave={pause}
      onFocus={play}
      onBlur={pause}
    >
      {playable && media.type === "video" ? (
        <video
          ref={videoRef}
          className="j-tile-media"
          muted
          loop
          playsInline
          preload="metadata"
          aria-label={project.title}
        >
          <source src={media.src} type="video/mp4" />
        </video>
      ) : (
        playable && (
          <img className="j-tile-media" src={media.src} alt={project.title} loading="lazy" />
        )
      )}

      {/* Always-visible label, so the wall is readable without hovering */}
      <figcaption className="j-tile-label">{project.title}</figcaption>

      {/* Detail overlay, revealed on hover or keyboard focus */}
      <div className="j-tile-detail">
        <h4>{project.title}</h4>
        <p>{projectBlurbs[project.title] || project.description}</p>
        {project.technologies && (
          <p className="j-tile-tech">{project.technologies.slice(0, 6).join(" · ")}</p>
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

export default function ProjectGallery({ playable, onSeeAll }) {
  const projects = galleryProjects.map(byTitle).filter(Boolean);

  return (
    <div className="j-gallery">
      <header>
        <div>
          <h2>Selected Work</h2>
          <p>Side projects, games &amp; packages · hover any tile for detail</p>
        </div>
        <button type="button" onClick={onSeeAll}>
          See all {ALL.length} projects <span aria-hidden="true">→</span>
        </button>
      </header>

      <div className="j-tiles">
        {projects.map((project, i) => (
          <Tile
            key={project.title}
            project={project}
            span={SPANS[i % SPANS.length]}
            playable={playable}
          />
        ))}
      </div>
    </div>
  );
}
