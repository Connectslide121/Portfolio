import React, { useEffect, useState } from "react";
import "./picker.css";
import { MODES, hrefFor, modeById } from "../modes/registry";
import { profile } from "../data/journey";
import { contact } from "../data/site";
import { socialLinks } from "../data/social";

// Thumbnails: <id>-light.webp and <id>-dark.webp, one pair per mode.
const thumbs = (() => {
  const ctx = require.context("../images/modes", false, /\.webp$/);
  return Object.fromEntries(ctx.keys().map((k) => [k.replace(/^\.\/|\.webp$/g, ""), ctx(k)]));
})();

const LAST = "jm-mode";
const WORDS = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve"];

const go = (id) => {
  window.location.href = hrefFor(id);
};

/** The front door: the nine designs, side by side. */
export default function Picker() {
  const [dark, setDark] = useState(() => document.body.classList.contains("dark-theme"));
  const last = (() => {
    try {
      return modeById(window.localStorage.getItem(LAST));
    } catch {
      return undefined;
    }
  })();

  // 1–9 open a mode straight away.
  useEffect(() => {
    const onKey = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey || e.target.closest?.("input, textarea")) return;
      const n = Number(e.key);
      if (n >= 1 && n <= MODES.length) go(MODES[n - 1].id);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const toggleTheme = () => {
    const next = !document.body.classList.contains("dark-theme");
    document.body.classList.toggle("dark-theme", next);
    try {
      window.localStorage.setItem("jm-theme", next ? "dark" : "light");
    } catch {
      /* fine */
    }
    setDark(next);
  };

  const surprise = () => {
    const pool = MODES.filter((m) => m !== last);
    go(pool[Math.floor(Math.random() * pool.length)].id);
  };

  return (
    <div className="picker">
      <header className="pk-top">
        <span className="pk-brand">
          <span className="pk-mark" aria-hidden="true">
            JM
          </span>
          <span>
            <b>{profile.name}</b>
            <small>{profile.title}</small>
          </span>
        </span>
        <button type="button" className="pk-btn pk-theme" onClick={toggleTheme} aria-pressed={dark}>
          {dark ? "☾ Dark" : "☀ Light"}
        </button>
      </header>

      <main className="pk-main">
        <section className="pk-intro">
          <p className="pk-eyebrow">Portfolio · {MODES.length} styles</p>
          <h1>
            One career, <em>{WORDS[MODES.length] || MODES.length} ways</em> to read it.
          </h1>
          <p className="pk-lede">
            {profile.lede} The same CV is in every one of these — the roles, the degrees, the projects and the tools — told in a
            different style. Pick one, and switch any time with the style switcher.
          </p>
          <div className="pk-actions">
            {last && (
              <a className="pk-btn pk-btn-main" href={hrefFor(last.id)}>
                Back to {last.name} →
              </a>
            )}
            <button type="button" className={`pk-btn${last ? "" : " pk-btn-main"}`} onClick={surprise}>
              Surprise me
            </button>
          </div>
        </section>

        <ol className="pk-grid">
          {MODES.map((m, i) => (
            <li key={m.id}>
              <a className="pk-card" href={hrefFor(m.id)} aria-label={`${m.name}: ${m.blurb}`}>
                <span className="pk-thumb">
                  {thumbs[`${m.id}-light`] && <img className="pk-light" src={thumbs[`${m.id}-light`]} alt="" loading="lazy" />}
                  {thumbs[`${m.id}-dark`] && <img className="pk-dark" src={thumbs[`${m.id}-dark`]} alt="" loading="lazy" />}
                  <span className="pk-open" aria-hidden="true">
                    Open →
                  </span>
                </span>
                <span className="pk-meta">
                  <span className="pk-no">{String(i + 1).padStart(2, "0")}</span>
                  <span className="pk-kind">{m.kind}</span>
                  {last === m && <span className="pk-last">Last visited</span>}
                </span>
                <h2>{m.name}</h2>
                <p>{m.blurb}</p>
              </a>
            </li>
          ))}
        </ol>
      </main>

      <footer className="pk-foot">
        <a href={`mailto:${contact.email}`}>{contact.email}</a>
        {socialLinks.map((l) => (
          <a key={l.id} href={l.href} target="_blank" rel="noreferrer">
            {l.label}
          </a>
        ))}
        <span>Tip: press 1–{MODES.length} to jump straight in.</span>
      </footer>
    </div>
  );
}
