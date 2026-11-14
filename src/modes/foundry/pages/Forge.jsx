import React, { useEffect, useRef, useState } from "react";
import Billet from "../forge/Billet";
import { START, blurbOpening, blurbRest, processSteps } from "../components/copy";
import { profile } from "../../../data/journey";
import { contact } from "../../../data/site";

const STATES = [START, ...processSteps.map((s) => ({ heat: s.heat, open: s.open }))];
const pad = (n) => String(n).padStart(2, "0");

/**
 * The hero and the process in one section. The text scrolls; the billet stays
 * beside it (sticky) and is handed the state of whichever step is at the
 * middle of the screen, blended between two steps on the way.
 */
export default function Forge() {
  const section = useRef(null);
  const target = useRef({ ...START });
  const [step, setStep] = useState(0);

  useEffect(() => {
    const root = section.current;
    const anchors = Array.from(root.querySelectorAll("[data-anchor]"));
    let frame = 0;

    const measure = () => {
      frame = 0;
      const mid = window.innerHeight / 2;
      const centres = anchors.map((el) => {
        const r = el.getBoundingClientRect();
        return r.top + r.height / 2;
      });
      let state = STATES[0];
      let nearest = 0;
      if (mid >= centres[centres.length - 1]) {
        state = STATES[STATES.length - 1];
        nearest = STATES.length - 1;
      } else {
        for (let i = 0; i < centres.length - 1; i++) {
          if (mid >= centres[i] && mid < centres[i + 1]) {
            const k = (mid - centres[i]) / (centres[i + 1] - centres[i]);
            const a = STATES[i];
            const b = STATES[i + 1];
            state = { heat: a.heat + (b.heat - a.heat) * k, open: a.open + (b.open - a.open) * k };
            nearest = k < 0.5 ? i : i + 1;
            break;
          }
        }
      }
      target.current = state;
      root.style.setProperty("--heat", state.heat.toFixed(3));
      setStep(nearest);
    };
    const wake = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", wake, { passive: true });
    window.addEventListener("resize", wake);
    return () => {
      window.removeEventListener("scroll", wake);
      window.removeEventListener("resize", wake);
      cancelAnimationFrame(frame);
    };
  }, []);

  const current = step === 0 ? null : processSteps[step - 1];

  return (
    <section id="top" className="forge" ref={section}>
      <div className="wrap forge-grid">
        <div className="forge-intro" data-anchor>
          <p className="sheet">
            <span>{profile.title}</span>
            <span>{contact.location}</span>
          </p>
          <h1 className="forge-name">
            <span>Jon</span> <span>Mendizabal</span>
          </h1>
          <p className="forge-lede">{profile.lede}</p>
          <p className="forge-blurb">{blurbOpening}</p>
          <div className="forge-actions">
            <a className="btn" href="#work">
              See the work <span aria-hidden="true">↓</span>
            </a>
            <a className="btn btn-ghost" href="#contact">
              Get in touch
            </a>
          </div>
        </div>

        <div className="forge-stage">
          <Billet
            target={target}
            readout={
              <figcaption className="readout" aria-hidden="true">
                <span className="readout-step">
                  <b>{pad(step)}</b>
                  {current ? current.verb : "Pour"}
                </span>
                <span className="readout-gauge">
                  <span>Heat</span>
                  <i />
                </span>
              </figcaption>
            }
          />
        </div>

        <ol id="process" className="steps" aria-label="The process so far">
          {processSteps.map((s, i) => (
            <li key={s.id} className={`step${step === i + 1 ? " is-current" : ""}`} data-anchor style={{ "--step-heat": s.heat }}>
              <p className="step-no">
                <b>{pad(i + 1)}</b>
                <span>{s.span}</span>
              </p>
              <h2 className="step-verb">
                {s.verb}
                <small>{s.title}</small>
              </h2>
              <p className="step-detail">{s.detail}</p>
              {i === processSteps.length - 1 && blurbRest && <p className="step-more">{blurbRest}</p>}
              <ul className="step-entries">
                {s.entries.map((e) => (
                  <li key={e.id}>
                    <a href={`#${e.id}`}>
                      <span>{e.title}</span>
                      <small>{e.org}</small>
                      <time>{e.dateLabel.replace(" - ", "–")}</time>
                    </a>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
