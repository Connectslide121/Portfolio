import React, { useRef } from "react";
import { gsap, revealLines, useMotion } from "../motion";
import SectionHead from "../components/SectionHead";
import { toolCategories } from "../../../data/tools";

// Marks drawn in light ink get a dark plate; the rest a light one (by `alt`).
const LIGHT_ART = new Set(["cosmos db", "llm", "mithril js", "mongodb", "node.js", "rag", "react.js", "react native", "tailwind css", "vector database"]);

/** The tools: scattered as the section arrives, gathering into their groups. */
export default function Stack() {
  const ref = useRef(null);

  useMotion(ref, () => {
    const root = ref.current;
    revealLines(root.querySelector(".section-head h2"), { scrollTrigger: { trigger: root, start: "top 75%" } });
    const tools = root.querySelectorAll(".tool");
    const r = (n) => gsap.utils.random(-n, n);
    gsap.from(tools, {
      x: () => r(260),
      y: () => r(160),
      rotation: () => r(40),
      scale: 0.6,
      autoAlpha: 0,
      ease: "power2.out",
      stagger: { each: 0.012, from: "random" },
      scrollTrigger: { trigger: root.querySelector(".groups"), start: "top bottom", end: "top 35%", scrub: 0.8 },
    });
  });

  return (
    <section id="stack" className="section stack" ref={ref}>
      <div className="wrap">
        <SectionHead num="06" label="Stack" title="The tools I reach for." />
        <dl className="groups">
          {toolCategories.map((c) => (
            <div key={c.name} className="group">
              <dt>
                {c.name}
                <small>{String(c.tools.length).padStart(2, "0")}</small>
              </dt>
              <dd>
                <ul>
                  {c.tools.map((t) => (
                    <li key={t.name} className="tool">
                      <span className={`tool-icon${LIGHT_ART.has(t.alt) ? " on-dark" : ""}`}>
                        <img src={t.image} alt="" width="22" height="22" loading="lazy" />
                      </span>
                      {t.name}
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
