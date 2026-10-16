import React from "react";
import ProjectMedia from "../components/ProjectMedia";
import SocialIcon from "../components/SocialIcon";
import { renderRichText } from "../../../components/richText";
import { profile, experience, education, chapters } from "../../../data/journey";
import { orgById } from "../../../data/orgLogos";
import { toolCategories, toolsIntro } from "../../../data/tools";
import { featuredProjects, allProjects } from "../../../components/projectList";
import { techFor } from "../../../data/projectTech";
import { contact, projectsIntro } from "../../../data/site";
import { socialLinks } from "../../../data/social";

const LINKS = [
  ["livedemo", null],
  ["repository", "Source code"],
  ["npm", "npm"],
  ["play", "Play"],
];

function Entry({ e }) {
  const org = orgById(e.orgId);
  return (
    <article className="cv-entry">
      <p className="cv-meta">
        {e.dateLabel} · {e.location}
      </p>
      <h4>{e.title}</h4>
      <p className="cv-org">
        {org?.url ? (
          <a href={org.url} target="_blank" rel="noreferrer">
            {e.org} ↗
          </a>
        ) : (
          e.org
        )}
      </p>
      {e.quest && (
        <p className="cv-quest">
          <b>“{e.quest.name}”</b> ({e.quest.status}). {e.quest.constraint} <i>{e.quest.objective}</i>
        </p>
      )}
      <p>{renderRichText(e.summary, e.summaryLinks)}</p>
      {e.bullets && (
        <ul>
          {e.bullets.map((b, i) => (
            <li key={i}>{renderRichText(b.text, b.links)}</li>
          ))}
        </ul>
      )}
      <p className="cv-tech">
        {e.tech.join(" · ")} — material: {e.material}
      </p>
    </article>
  );
}

/** Everything in the game, on one plain page, for reading or printing. */
export default function CV({ onPlay }) {
  return (
    <main className="cv">
      <header className="cv-head cv-sheet">
        <button type="button" className="btn" onClick={onPlay}>
          ← Back to the table
        </button>
        <h1>{profile.name}</h1>
        <p className="cv-title">{profile.title} · Växjö, Sweden</p>
        <p className="cv-lede">{profile.lede}</p>
        <p>{profile.blurb}</p>
        <ul className="cv-social">
          {socialLinks.map((l) => (
            <li key={l.id}>
              <a href={l.href} target="_blank" rel="noreferrer">
                <SocialIcon link={l} /> {l.label}
              </a>
            </li>
          ))}
        </ul>
      </header>

      <section className="cv-sheet">
        <h2>The story</h2>
        <ol className="cv-chapters">
          {chapters.map((c) => (
            <li key={c.id}>
              <b>{c.title}</b> <span>{c.span}</span> — {c.detail}
            </li>
          ))}
        </ol>
      </section>

      <section className="cv-sheet">
        <h2>Experience</h2>
        {experience.map((e) => (
          <Entry key={e.id} e={e} />
        ))}
      </section>

      <section className="cv-sheet">
        <h2>Education</h2>
        {education.map((e) => (
          <Entry key={e.id} e={e} />
        ))}
      </section>

      <section className="cv-sheet">
        <h2>{toolsIntro.title}</h2>
        <p>{toolsIntro.tagline}</p>
        {toolCategories.map((c) => (
          <p key={c.name} className="cv-tools">
            <b>{c.name}:</b> {c.tools.map((t) => t.name).join(", ")}
          </p>
        ))}
      </section>

      <section className="cv-sheet">
        <h2>{projectsIntro.title}</h2>
        <p>{projectsIntro.text}</p>
        <div className="cv-projects">
          {[...featuredProjects, ...allProjects].map((p) => (
            <article key={p.title} className="cv-project">
              <div className="cv-media">
                <ProjectMedia title={p.title} className="media" />
              </div>
              <div>
                <h4>{p.title}</h4>
                <p className="cv-meta">
                  {p.category || "Web App"} · {p.date}
                </p>
                <p>{p.description.trim()}</p>
                <p className="cv-tech">{(p.technologies || []).map((t) => techFor(t)?.name || t).join(" · ")}</p>
                <p className="cv-links">
                  {LINKS.filter(([k]) => p[k]).map(([k, label]) => (
                    <a key={k} href={p[k]} target="_blank" rel="noopener noreferrer">
                      {label || p.button || "Live demo"} ↗
                    </a>
                  ))}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="cv-sheet">
        <h2>{contact.heading}</h2>
        <p>{contact.intro}</p>
        <p>
          <a href={`mailto:${contact.email}`}>{contact.email}</a> · {contact.phone} · {contact.location}
        </p>
      </section>
      <footer className="cv-foot">
        {new Date().getFullYear()} · Made with ♥ by Jon Mendizabal
      </footer>
    </main>
  );
}
