import React, { useRef, useState } from "react";
import { mediaFor } from "../../../data/projectMedia";
import { techFor } from "../../../data/projectTech";

const LINKS = [
  ["livedemo", null],
  ["repository", "Source code"],
  ["npm", "npm"],
  ["play", "Play"],
];

/** One project, open in the media player. */
export default function ProjectViewer({ project }) {
  const media = mediaFor(project.title);
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(true);

  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play().catch(() => {});
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  return (
    <div className="viewer">
      <div className="viewer-screen sunken">
        {media.type === "video" ? (
          <video ref={videoRef} src={media.src} aria-label={project.title} autoPlay loop muted playsInline />
        ) : (
          <img src={media.src} alt={project.title} />
        )}
      </div>
      <div className="viewer-controls">
        {media.type === "video" && (
          <button type="button" className="btn95 btn95-square" onClick={toggle} aria-label={playing ? "Pause" : "Play"}>
            {playing ? "❚❚" : "▶"}
          </button>
        )}
        <div className="viewer-seek" aria-hidden="true">
          <span className={playing && media.type === "video" ? "is-playing" : ""} />
        </div>
        {LINKS.filter(([k]) => project[k]).map(([k, label]) => (
          <a key={k} className="btn95 btn95-link" href={project[k]} target="_blank" rel="noopener noreferrer">
            {label || project.button || "Live demo"} ↗
          </a>
        ))}
      </div>
      <div className="viewer-info">
        <h3>{project.title}</h3>
        <p className="viewer-meta">
          {project.category || "Web App"} · {project.date}
        </p>
        <p>{project.description}</p>
        {project.technologies && (
          <ul className="tech-list">
            {project.technologies.map((t) => {
              const info = techFor(t);
              return (
                <li key={t}>
                  {info && <img src={info.icon} alt="" width="16" height="16" />}
                  {info?.name || t}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
