import React, { useRef } from "react";
import { SplitText, gsap, revealLines, useMotion } from "../motion";
import SectionHead from "../components/SectionHead";
import { products } from "../../../data/products";

// What the role is, in his words from the CV, and three figures taken from it.
const STATEMENTS = [
  { lead: "I lead the team.", rest: "The development team behind the Jambiz Group's AI-powered products." },
  { lead: "I set the stack.", rest: "One modern stack for all of them: Angular 21, .NET 8 Azure Functions and CosmosDB." },
  { lead: "I ship fast.", rest: "MVPs built quickly, as the company moves to product-led growth." },
];
const FIGURES = [
  { value: products.filter((p) => p.url).length, label: "products built or led" },
  { value: 7, label: "year-old platform, rebuilt with feature parity" },
  { value: 2, label: "staff mobile apps in React Native" },
];

export default function Lead() {
  const ref = useRef(null);

  useMotion(ref, () => {
    const root = ref.current;
    revealLines(root.querySelector(".section-head h2"), { scrollTrigger: { trigger: root, start: "top 75%" } });

    // Each statement reads itself in, word by word, with the scroll.
    root.querySelectorAll(".statement").forEach((el) => {
      const split = SplitText.create(el, { type: "words" });
      gsap.fromTo(split.words, { opacity: 0.12 }, { opacity: 1, stagger: 0.1, ease: "none", scrollTrigger: { trigger: el, start: "top 85%", end: "top 45%", scrub: true } });
    });

    // The figures count up once, when they arrive.
    root.querySelectorAll(".figure-value").forEach((el) => {
      const to = Number(el.dataset.value);
      const n = { v: 0 };
      gsap.to(n, {
        v: to,
        duration: 1.6,
        ease: "power2.out",
        onUpdate: () => {
          el.textContent = String(Math.round(n.v));
        },
        scrollTrigger: { trigger: el, start: "top 85%" },
      });
    });
    gsap.from(root.querySelectorAll(".figure"), { y: 40, autoAlpha: 0, duration: 1, ease: "expo.out", stagger: 0.1, scrollTrigger: { trigger: root.querySelector(".figures"), start: "top 85%" } });
  });

  return (
    <section id="lead" className="section lead" ref={ref}>
      <div className="wrap">
        <SectionHead num="04" label="Leading" title="Architect, lead and hands on." />
        <ol className="statements">
          {STATEMENTS.map((s) => (
            <li key={s.lead} className="statement">
              <strong>{s.lead}</strong> {s.rest}
            </li>
          ))}
        </ol>
        <dl className="figures">
          {FIGURES.map((f) => (
            <div key={f.label} className="figure">
              <dt>{f.label}</dt>
              <dd className="figure-value" data-value={f.value}>
                {f.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
