import React, { useRef } from "react";
import { gsap, revealLines, useMotion } from "../motion";
import { profile } from "../../../data/journey";
import { contact } from "../../../data/site";

const cut = profile.blurb.indexOf(". ");
const opening = cut > 0 ? profile.blurb.slice(0, cut + 1) : profile.blurb;

export default function Hero() {
  const ref = useRef(null);

  useMotion(ref, () => {
    const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
    tl.from(".hero-kicker > *", { y: 16, autoAlpha: 0, duration: 0.8, stagger: 0.08 });
    revealLines(ref.current.querySelector(".hero-title"), { delay: 0.15, duration: 1.3, stagger: 0.1 });
    tl.from(".hero-sub", { y: 24, autoAlpha: 0, duration: 1 }, 0.55);
    tl.from(".hero-actions > *", { y: 20, autoAlpha: 0, duration: 0.9, stagger: 0.08 }, 0.7);
    tl.from(".hero-foot > *", { autoAlpha: 0, duration: 1, stagger: 0.1 }, 1.1);

    // Leaving: the words drift up and fade as the system opens.
    gsap.to(".hero-inner", {
      yPercent: -18,
      autoAlpha: 0,
      ease: "none",
      scrollTrigger: { trigger: ref.current, start: "top top", end: "bottom 35%", scrub: true },
    });
  });

  return (
    <section id="top" className="hero" ref={ref}>
      <div className="wrap hero-inner">
        <p className="hero-kicker">
          <span className="pulse" aria-hidden="true" />
          <span>{profile.name}</span>
          <span>{profile.title}</span>
        </p>
        <h1 className="hero-title">{profile.headline}</h1>
        <p className="hero-sub">{opening}</p>
        <div className="hero-actions">
          <a className="btn" href="#products">
            See the products <span aria-hidden="true">→</span>
          </a>
          <a className="btn btn-ghost" href="#contact">
            Get in touch
          </a>
        </div>
        <div className="hero-foot">
          <p className="hint">
            <span className="hint-live">Drag the system. Point at a product.</span>
            <span className="hint-still">The products and the stack they share.</span>
          </p>
          <p className="hero-place">{contact.location}</p>
        </div>
      </div>
      <a className="scroll-cue" href="#system" aria-label="Scroll to the system">
        <span />
      </a>
    </section>
  );
}
