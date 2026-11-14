import React, { useRef } from "react";
import { gsap, SplitText, useMotion } from "../motion";
import SocialIcon from "../components/SocialIcon";
import { useLocalTime } from "../components/hooks";
import { contact } from "../../../data/site";
import { socialLinks } from "../../../data/social";

/**
 * The close: one big line, a button that pulls towards the pointer, and the
 * form in a dialog (a form never opens inline, so nothing on the page moves).
 */
export default function Contact() {
  const ref = useRef(null);
  const dialog = useRef(null);
  const time = useLocalTime();

  useMotion(ref, () => {
    const root = ref.current;
    const split = SplitText.create(root.querySelector(".contact-title"), { type: "chars,words", mask: "chars" });
    gsap.from(split.chars, { yPercent: 120, duration: 1, ease: "expo.out", stagger: 0.018, scrollTrigger: { trigger: root, start: "top 70%" } });
    gsap.from(root.querySelectorAll(".contact-row > *"), { y: 30, autoAlpha: 0, duration: 0.9, ease: "expo.out", stagger: 0.07, scrollTrigger: { trigger: root.querySelector(".contact-row"), start: "top 90%" } });

    // The button leans after the pointer, then springs back.
    const btn = root.querySelector(".magnet");
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return undefined;
    const x = gsap.quickTo(btn, "x", { duration: 0.6, ease: "elastic.out(1, 0.4)" });
    const y = gsap.quickTo(btn, "y", { duration: 0.6, ease: "elastic.out(1, 0.4)" });
    const zone = btn.parentElement;
    const move = (e) => {
      const r = btn.getBoundingClientRect();
      x((e.clientX - (r.left + r.width / 2)) * 0.35);
      y((e.clientY - (r.top + r.height / 2)) * 0.35);
    };
    const leave = () => {
      x(0);
      y(0);
    };
    zone.addEventListener("pointermove", move);
    zone.addEventListener("pointerleave", leave);
    return () => {
      zone.removeEventListener("pointermove", move);
      zone.removeEventListener("pointerleave", leave);
    };
  });

  const close = () => dialog.current?.close();

  return (
    <section id="contact" className="section contact" ref={ref}>
      <div className="wrap">
        <p className="eyebrow">
          <span>08</span>Contact
        </p>
        <h2 className="contact-title">Let's build the next one.</h2>
        <div className="contact-row">
          <div className="magnet-zone">
            <button type="button" className="btn btn-big magnet" onClick={() => dialog.current?.showModal()} aria-haspopup="dialog">
              Write to me <span aria-hidden="true">→</span>
            </button>
          </div>
          <a className="contact-email" href={`mailto:${contact.email}`}>
            {contact.email}
          </a>
          <dl className="contact-facts">
            <div>
              <dt>Phone</dt>
              <dd>
                <a href={`tel:${contact.phone.replace(/[^+\d]/g, "")}`}>{contact.phone}</a>
              </dd>
            </div>
            <div>
              <dt>Based in</dt>
              <dd>{contact.location}</dd>
            </div>
            <div>
              <dt>Local time</dt>
              <dd>
                <time>{time}</time>
              </dd>
            </div>
          </dl>
          <ul className="contact-social">
            {socialLinks.map((l) => (
              <li key={l.id}>
                <a href={l.href} target="_blank" rel="noreferrer">
                  <SocialIcon link={l} />
                  <b>{l.label}</b>
                  <span>{l.handle}</span>
                  <i aria-hidden="true">↗</i>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Closes with ×, Cancel or Escape; never on a click beside it. */}
      <dialog ref={dialog} className="contact-dialog" aria-labelledby="contact-dialog-title">
        <form className="contact-form" action={contact.formAction} method="POST">
          <div className="cd-head">
            <h3 id="contact-dialog-title">Send me a message</h3>
            <button type="button" className="icon-btn" onClick={close} aria-label="Close">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>
          <p className="cd-note">It goes straight to my inbox ({contact.email}); I answer from there.</p>
          <label>
            <span>Name</span>
            <input type="text" name="name" autoComplete="name" placeholder="Your full name" required />
          </label>
          <label>
            <span>Email</span>
            <input type="email" name="email" autoComplete="email" placeholder="you@example.com" required />
          </label>
          <label>
            <span>Message</span>
            <textarea name="message" rows="6" placeholder="Tell me about your project, or just say hello." required />
          </label>
          <div className="cd-actions">
            <button type="button" className="btn btn-ghost" onClick={close}>
              Cancel
            </button>
            <button type="submit" className="btn">
              Send message <span aria-hidden="true">→</span>
            </button>
          </div>
        </form>
      </dialog>
    </section>
  );
}
