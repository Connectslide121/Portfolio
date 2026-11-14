import React, { useRef } from "react";
import { ScrollTrigger, gsap, revealLines, useMotion } from "../motion";
import SectionHead from "../components/SectionHead";
import { layers } from "../../../data/products";

/**
 * The system opens: as this section comes up, the graph behind it explodes
 * into the four layers of the shared stack, and the layer being read lights
 * up on the stage.
 */
export default function Layers({ state }) {
  const ref = useRef(null);

  useMotion(ref, () => {
    const root = ref.current;
    ScrollTrigger.create({
      trigger: root,
      start: "top bottom",
      end: "top 15%",
      scrub: true,
      onUpdate: (self) => {
        state.explode = self.progress;
      },
      onLeaveBack: () => {
        state.explode = 0;
      },
    });
    root.querySelectorAll(".layer").forEach((el, i) => {
      ScrollTrigger.create({
        trigger: el,
        start: "top 55%",
        end: "bottom 45%",
        onToggle: (self) => {
          if (self.isActive) state.focus = i;
          else if (state.focus === i) state.focus = -1;
        },
      });
      gsap.from(el.querySelectorAll(".layer-no, .layer-name, .layer-line, .layer-items li"), {
        x: -40,
        autoAlpha: 0,
        duration: 0.9,
        ease: "expo.out",
        stagger: 0.06,
        scrollTrigger: { trigger: el, start: "top 75%" },
      });
    });
    revealLines(root.querySelector(".section-head h2"), { scrollTrigger: { trigger: root.querySelector(".section-head"), start: "top 80%" } });
    return () => {
      state.focus = -1;
    };
  });

  return (
    <section id="system" className="section layers" ref={ref}>
      <div className="wrap">
        <SectionHead num="01" label="The system" title="One stack, four layers, every product.">
          <p>The products I lead share one modern stack and one set of platform packages, SAGE, from the screen down to the AI.</p>
        </SectionHead>
        <ol className="layer-list">
          {layers.map((l, i) => (
            <li key={l.id} className={`layer layer-${l.id}`}>
              <span className="layer-no">L{i + 1}</span>
              <h3 className="layer-name">{l.name}</h3>
              <p className="layer-line">{l.line}</p>
              <ul className="layer-items">
                {l.items.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
