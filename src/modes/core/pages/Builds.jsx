import React, { useRef, useState } from "react";
import { gsap, revealLines, useMotion } from "../motion";
import ProjectDialog from "../components/ProjectDialog";
import ProjectLinks from "../components/ProjectLinks";
import ProjectMedia from "../components/ProjectMedia";
import SectionHead from "../components/SectionHead";
import { allProjects, featuredProjects } from "../../../components/projectList";
import { projectBlurbs } from "../../../data/journey";
import { techFor } from "../../../data/projectTech";

const everything = [...featuredProjects, ...allProjects];
const kind = (p) => p.category || "Web app";
const tech = (p) => p.technologies.map((k) => techFor(k)?.name || k);

/**
 * Things built on the side. The featured ones stack: each card holds at the
 * top (CSS sticky) and the one before it sinks back as the next arrives.
 */
export default function Builds() {
  const ref = useRef(null);
  const [open, setOpen] = useState(null);
  const step = (by) => setOpen((at) => (at == null ? at : (at + by + everything.length) % everything.length));

  useMotion(ref, () => {
    const root = ref.current;
    revealLines(root.querySelector(".section-head h2"), { scrollTrigger: { trigger: root, start: "top 75%" } });
    const cards = Array.from(root.querySelectorAll(".build"));
    cards.forEach((card, i) => {
      const next = cards[i + 1];
      if (!next) return;
      gsap.to(card.querySelector(".build-card"), {
        scale: 0.92,
        autoAlpha: 0.35,
        ease: "none",
        scrollTrigger: { trigger: next, start: "top bottom", end: "top 20%", scrub: true },
      });
    });
    gsap.from(root.querySelectorAll(".shelf-row"), { y: 24, autoAlpha: 0, duration: 0.7, ease: "power3.out", stagger: 0.04, scrollTrigger: { trigger: root.querySelector(".shelf"), start: "top 85%" } });
  });

  return (
    <section id="builds" className="section builds" ref={ref}>
      <div className="wrap">
        <SectionHead num="05" label="Side builds" title="Things I build because I want to.">
          <p>Apps and games made outside the day job, most of them with AI at the centre.</p>
        </SectionHead>

        <ol className="build-stack">
          {featuredProjects.map((p, i) => (
            <li key={p.title} className="build" style={{ "--i": i }}>
              <article className="build-card">
                <div className="build-media">
                  <ProjectMedia title={p.title} />
                </div>
                <div className="build-body">
                  <p className="build-meta">
                    <span>{kind(p)}</span>
                    <time>{p.date}</time>
                  </p>
                  <h3>
                    <button type="button" className="build-open" onClick={() => setOpen(i)} aria-haspopup="dialog">
                      {p.title}
                    </button>
                  </h3>
                  <p className="build-text">{projectBlurbs[p.title] || p.description}</p>
                  <p className="build-tech">{tech(p).join(" · ")}</p>
                  <div className="build-foot">
                    <ProjectLinks project={p} />
                    <span className="build-more" aria-hidden="true">
                      Details →
                    </span>
                  </div>
                </div>
              </article>
            </li>
          ))}
        </ol>

        <div className="shelf">
          <div className="shelf-head">
            <h3>Everything else</h3>
            <p>{allProjects.length} more, newest first. Open any row for the full story and its links.</p>
          </div>
          <ol>
            {allProjects.map((p, i) => (
              <li key={p.title} className="shelf-row">
                <button type="button" className="shelf-btn" onClick={() => setOpen(featuredProjects.length + i)} aria-haspopup="dialog">
                  <span className="shelf-title">{p.title}</span>
                  <span className="shelf-kind">{kind(p)}</span>
                  <span className="shelf-tech">{tech(p).join(" · ")}</span>
                  <span className="shelf-date">{p.date}</span>
                  <span className="shelf-arrow" aria-hidden="true">
                    →
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </div>
      </div>
      <ProjectDialog projects={everything} index={open} onStep={step} onClose={() => setOpen(null)} />
    </section>
  );
}
