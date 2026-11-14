import React, { useRef } from "react";
import { gsap, revealLines, useMotion } from "../motion";
import SectionHead from "../components/SectionHead";
import { pipeline } from "../../../data/products";

/**
 * How the AI features run: a scrubbed walk through the pipeline. Wide, the
 * section pins and a document travels the rail, lighting each step as it
 * arrives; narrow, each step comes in as it is reached.
 */
export default function Pipeline() {
  const ref = useRef(null);

  useMotion(ref, ({ wide }) => {
    const root = ref.current;
    revealLines(root.querySelector(".section-head h2"), { scrollTrigger: { trigger: root, start: "top 75%" } });
    const steps = root.querySelectorAll(".pipe-step");

    if (!wide) {
      steps.forEach((s) => gsap.from(s, { y: 40, autoAlpha: 0, duration: 0.9, ease: "expo.out", scrollTrigger: { trigger: s, start: "top 85%" } }));
      return;
    }

    const rail = root.querySelector(".pipe-rail");
    const tl = gsap.timeline({
      defaults: { ease: "none" },
      // Held once the whole section is on screen (its foot at the screen's foot).
      scrollTrigger: { trigger: root, start: "bottom bottom", end: "+=170%", pin: true, scrub: 0.6, anticipatePin: 1 },
    });
    tl.fromTo(root.querySelector(".pipe-fill"), { scaleX: 0 }, { scaleX: 1, duration: steps.length - 1 }, 0);
    tl.fromTo(root.querySelector(".pipe-token"), { x: 0 }, { x: () => rail.offsetWidth, duration: steps.length - 1 }, 0);
    steps.forEach((s, i) => {
      tl.from(s.querySelector(".pipe-dot"), { scale: 0.4, autoAlpha: 0.3, duration: 0.25, ease: "back.out(3)" }, Math.max(0, i - 0.15));
      tl.from(s.querySelectorAll(".pipe-name, .pipe-line"), { y: 26, autoAlpha: 0.08, duration: 0.4, stagger: 0.05, ease: "power2.out" }, Math.max(0, i - 0.15));
    });
  });

  return (
    <section id="pipeline" className="section pipeline" ref={ref}>
      <div className="wrap">
        <SectionHead num="02" label="AI, done properly" title="The model proposes. People decide.">
          <p>The pattern behind Govensa and Knowia Studio: AI grounded in the customer's own material, with a person in the loop and a trail behind every step.</p>
        </SectionHead>
        <div className="pipe">
          <div className="pipe-rail" aria-hidden="true">
            <span className="pipe-fill" />
            <span className="pipe-token" />
          </div>
          <ol className="pipe-steps">
            {pipeline.map((s, i) => (
              <li key={s.id} className="pipe-step">
                <span className="pipe-dot" aria-hidden="true" />
                <span className="pipe-no">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="pipe-name">{s.name}</h3>
                <p className="pipe-line">{s.line}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
