import React, { useState } from "react";
import { Icon } from "../os/PixelArt";
import { projectIcon } from "../os/icons";
import { featuredProjects, allProjects } from "../components/projectList";
import { techFor } from "../data/projectTech";
import { projectsIntro } from "../data/site";

const techName = (t) => techFor(t)?.name || t;

/** C:\Projects — the work as a folder of files, in icon or details view. */
export default function ProjectsApp({ os }) {
  const [view, setView] = useState("icons");
  const [selected, setSelected] = useState(null);

  const openProject = (p) => os.openProject(p);

  const Item = ({ project, featured }) => (
    <li>
      <button
        type="button"
        className={`file-icon${selected === project.title ? " is-selected" : ""}`}
        onClick={(e) => {
          setSelected(project.title);
          // Touch and keyboard open on a single activation; mice double-click.
          if (e.detail === 0 || os.touch) openProject(project);
        }}
        onDoubleClick={() => openProject(project)}
        aria-label={`${project.title}, ${project.category || "Web App"}${featured ? ", featured" : ""}`}
      >
        <span className="file-glyph">
          <Icon name={projectIcon(project.category)} scale={2} />
          {featured && <Icon name="star" scale={1} className="file-badge" />}
        </span>
        <span className="file-label">{project.title}</span>
      </button>
    </li>
  );

  const rows = [...featuredProjects.map((p) => ({ ...p, featured: true })), ...allProjects];

  return (
    <div className="explorer">
      <div className="toolbar">
        <div className="address-bar">
          <span>Address</span>
          <span className="address-field">C:\Projects</span>
        </div>
        <div className="view-switch" role="group" aria-label="View">
          <button type="button" className="btn95" aria-pressed={view === "icons"} onClick={() => setView("icons")}>
            Large icons
          </button>
          <button type="button" className="btn95" aria-pressed={view === "details"} onClick={() => setView("details")}>
            Details
          </button>
        </div>
      </div>

      <div className="folder-pane sunken">
        <p className="folder-note">{projectsIntro.text}</p>
        {view === "icons" ? (
          <>
            <h3 className="folder-group">Featured</h3>
            <ul className="file-grid">
              {featuredProjects.map((p) => (
                <Item key={p.title} project={p} featured />
              ))}
            </ul>
            <h3 className="folder-group">All projects</h3>
            <ul className="file-grid">
              {allProjects.map((p) => (
                <Item key={p.title} project={p} />
              ))}
            </ul>
          </>
        ) : (
          <table className="details-view">
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Type</th>
                <th scope="col">Date</th>
                <th scope="col">Built with</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p.title} className={selected === p.title ? "is-selected" : ""}>
                  <td>
                    <button type="button" className="details-name" onClick={() => openProject(p)}>
                      <Icon name={projectIcon(p.category)} scale={1} />
                      {p.title}
                      {p.featured && <span className="featured-mark"> ★</span>}
                    </button>
                  </td>
                  <td>{p.category || "Web App"}</td>
                  <td>{p.date}</td>
                  <td>{(p.technologies || []).map(techName).join(", ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <footer className="status-bar">
        <span>{rows.length} object(s)</span>
        <span>{selected ? `Selected: ${selected}` : "Double-click a file to open it"}</span>
      </footer>
    </div>
  );
}
