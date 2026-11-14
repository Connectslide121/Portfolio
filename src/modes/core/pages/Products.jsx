import React, { useRef } from "react";
import { gsap, revealLines, useMotion } from "../motion";
import SectionHead from "../components/SectionHead";
import { products } from "../../../data/products";

/**
 * The products. Wide, the section pins and the cards run past sideways as
 * the page scrolls; each card leans towards the pointer. Narrow, or with
 * reduced motion, they are a plain grid.
 */
export default function Products() {
  const ref = useRef(null);

  useMotion(ref, ({ wide }) => {
    const root = ref.current;
    revealLines(root.querySelector(".section-head h2"), { scrollTrigger: { trigger: root, start: "top 75%" } });
    const cards = Array.from(root.querySelectorAll(".product"));

    // Lean towards the pointer, where there is one.
    const leaners = [];
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      cards.forEach((card) => {
        const rx = gsap.quickTo(card, "rotationX", { duration: 0.5, ease: "power3" });
        const ry = gsap.quickTo(card, "rotationY", { duration: 0.5, ease: "power3" });
        const move = (e) => {
          const r = card.getBoundingClientRect();
          ry(((e.clientX - r.left) / r.width - 0.5) * 12);
          rx(-((e.clientY - r.top) / r.height - 0.5) * 10);
          card.style.setProperty("--gx", `${((e.clientX - r.left) / r.width) * 100}%`);
          card.style.setProperty("--gy", `${((e.clientY - r.top) / r.height) * 100}%`);
        };
        const leave = () => {
          rx(0);
          ry(0);
        };
        card.addEventListener("pointermove", move);
        card.addEventListener("pointerleave", leave);
        leaners.push(() => {
          card.removeEventListener("pointermove", move);
          card.removeEventListener("pointerleave", leave);
        });
      });
    }

    if (wide) {
      root.classList.add("is-rail");
      const track = root.querySelector(".product-track");
      const viewport = root.querySelector(".product-viewport");
      // How far the track must move for its last card to reach the right edge.
      const distance = () => Math.max(0, track.scrollWidth + parseFloat(getComputedStyle(viewport).paddingLeft) - viewport.clientWidth);
      gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: { trigger: root, start: "top top", end: () => `+=${distance()}`, pin: true, scrub: 0.7, invalidateOnRefresh: true, anticipatePin: 1 },
      });
      gsap.from(cards, { y: 80, autoAlpha: 0, duration: 1, ease: "expo.out", stagger: 0.08, scrollTrigger: { trigger: root, start: "top 60%" } });
    } else {
      cards.forEach((c) => gsap.from(c, { y: 50, autoAlpha: 0, duration: 0.9, ease: "expo.out", scrollTrigger: { trigger: c, start: "top 88%" } }));
    }

    return () => {
      root.classList.remove("is-rail");
      leaners.forEach((off) => off());
    };
  });

  return (
    <section id="products" className="section products" ref={ref}>
      <div className="wrap">
        <SectionHead num="03" label="Products" title="What I build and lead now.">
          <p>Platforms for the Jambiz Group at Sprinta, from a seven-year-old system rebuilt to new AI products shipped as MVPs.</p>
        </SectionHead>
      </div>
      <div className="product-viewport">
        <ol className="product-track">
          {products.map((p, i) => (
            <li key={p.id} id={`product-${p.id}`} className={`product product-${p.id}`}>
              <div className="product-top">
                <span className="product-no">{String(i + 1).padStart(2, "0")}</span>
                <span className="product-role">{p.role}</span>
              </div>
              <h3 className="product-name">{p.name}</h3>
              <p className="product-kind">{p.kind}</p>
              <p className="product-line">{p.line}</p>
              <ul className="product-stack">
                {p.stack.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
              <div className="product-foot">
                {p.url ? (
                  <a className="product-link" href={p.url} target="_blank" rel="noreferrer">
                    Visit {p.name} <span aria-hidden="true">↗</span>
                  </a>
                ) : (
                  <span className="product-internal">Internal platform, not public</span>
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
