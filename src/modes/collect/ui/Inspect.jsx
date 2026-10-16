import React, { useEffect, useRef } from "react";
import Card from "../components/Card";
import SocialIcon from "../components/SocialIcon";
import { renderRichText } from "../../../components/richText";
import { RARITY, cardById, cardsOf, collectorNo, setById, toolFor, usersOf } from "../cards/catalog";
import { profile, chapters } from "../../../data/journey";
import { orgById } from "../../../data/orgLogos";
import { contact } from "../../../data/site";
import { socialLinks } from "../../../data/social";

const LINKS = [
  ["livedemo", null],
  ["repository", "Source code"],
  ["npm", "npm"],
  ["play", "Play"],
];

/** A tech name, as a link to its tool card when you own it. */
function Tech({ label, owned, onInspect }) {
  const tool = toolFor(label);
  if (tool && owned[tool.id]) {
    return (
      <button type="button" className="chip" onClick={() => onInspect(tool)}>
        <img src={tool.art.image} alt="" /> {label}
      </button>
    );
  }
  return <span className="chip">{label}</span>;
}

function TechList({ items, owned, onInspect }) {
  return (
    <ul className="chips">
      {items.map((t) => (
        <li key={t}>
          <Tech label={t} owned={owned} onInspect={onInspect} />
        </li>
      ))}
    </ul>
  );
}

function EntryDetails({ e, owned, onInspect }) {
  const org = orgById(e.orgId);
  return (
    <>
      <p className="ins-meta">
        {e.dateLabel} · {e.location}
      </p>
      <h3 className="ins-title">{e.title}</h3>
      <p className="ins-org">
        {org?.url ? (
          <a href={org.url} target="_blank" rel="noreferrer">
            {e.org} ↗
          </a>
        ) : (
          e.org
        )}
      </p>
      <div className="ins-quest">
        <p>
          <b>{e.quest.name}</b> · {e.quest.status}
        </p>
        <p>
          <span>Challenge</span> {e.quest.constraint}
        </p>
        <p>
          <span>Goal</span> {e.quest.objective}
        </p>
      </div>
      <p>{renderRichText(e.summary, e.summaryLinks)}</p>
      {e.bullets && (
        <ul className="ins-bullets">
          {e.bullets.map((b, i) => (
            <li key={i}>{renderRichText(b.text, b.links)}</li>
          ))}
        </ul>
      )}
      <h4>Skills</h4>
      <TechList items={e.tech} owned={owned} onInspect={onInspect} />
      <p className="ins-note">Material: {e.material}</p>
    </>
  );
}

function ProjectDetails({ card, owned, onInspect }) {
  const p = card.project;
  return (
    <>
      <p className="ins-meta">
        {p.category || "Web App"} · {p.date}
      </p>
      <p>{p.description.trim()}</p>
      {p.details && (
        <ul className="ins-bullets">
          {p.details.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
      )}
      <h4>Built with</h4>
      <TechList items={card.tech} owned={owned} onInspect={onInspect} />
      <p className="ins-links">
        {LINKS.filter(([k]) => p[k]).map(([k, label]) => (
          <a key={k} className="btn btn-sm" href={p[k]} target="_blank" rel="noopener noreferrer">
            {label || p.button || "Live demo"} ↗
          </a>
        ))}
      </p>
    </>
  );
}

function ToolDetails({ card, owned, onInspect }) {
  const users = usersOf(card);
  return (
    <>
      <p className="ins-meta">{card.category}</p>
      {users.length ? (
        <>
          <h4>Used in</h4>
          <ul className="ins-users">
            {users.map((u) => (
              <li key={u.id}>
                {owned[u.id] ? (
                  <button type="button" className="link-btn" onClick={() => onInspect(u)}>
                    {u.name}
                  </button>
                ) : (
                  <span className="ins-locked">??? · not collected yet</span>
                )}
                <small>{u.type}</small>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p>{card.text}</p>
      )}
    </>
  );
}

function HeroDetails() {
  return (
    <>
      <p className="ins-meta">{profile.title}</p>
      <p className="ins-lede">{profile.lede}</p>
      <p>{profile.blurb}</p>
      <h4>The story</h4>
      <ol className="ins-chapters">
        {chapters.map((c) => (
          <li key={c.id}>
            <b>{c.title}</b> <span>{c.span}</span> — {c.detail}
          </li>
        ))}
      </ol>
      <h4>Find me</h4>
      <p className="ins-links">
        <a className="btn btn-sm" href={`mailto:${contact.email}`}>
          {contact.email}
        </a>
        {socialLinks.map((l) => (
          <a key={l.id} className="btn btn-sm" href={l.href} target="_blank" rel="noreferrer">
            <SocialIcon link={l} /> {l.label}
          </a>
        ))}
      </p>
    </>
  );
}

function Details({ card, owned, onInspect }) {
  switch (card.kind) {
    case "hero":
      return <HeroDetails />;
    case "role":
    case "degree":
      return <EntryDetails e={card.entry} owned={owned} onInspect={onInspect} />;
    case "project":
      return <ProjectDetails card={card} owned={owned} onInspect={onInspect} />;
    case "tool":
      return <ToolDetails card={card} owned={owned} onInspect={onInspect} />;
    case "event": {
      const b = card.beat;
      const aml = cardById["exp-aml"];
      return (
        <>
          <p className="ins-meta">
            {b.year} · {b.place}
          </p>
          <h3 className="ins-title">{b.role}</h3>
          <p className="ins-org">{b.org}</p>
          <div className="ins-quest">
            <p>
              <span>Challenge</span> {b.constraint}
            </p>
            <p>
              <span>Goal</span> {b.objective}
            </p>
          </div>
          {owned[aml.id] && (
            <p>
              Part of{" "}
              <button type="button" className="link-btn" onClick={() => onInspect(aml)}>
                {aml.name}
              </button>
              .
            </p>
          )}
        </>
      );
    }
    default:
      return (
        <>
          <p className="ins-meta">{card.subtitle}</p>
          <p className="ins-lede">{card.text}</p>
        </>
      );
  }
}

/** One card, big, in your hand: tilt it, and read everything it stands for. */
export default function Inspect({ card, owned, onInspect, onClose }) {
  const ref = useRef(null);
  const set = setById(card.set);
  const mine = cardsOf(card.set).filter((c) => owned[c.id]);
  const at = mine.findIndex((c) => c.id === card.id);
  const prev = mine[(at - 1 + mine.length) % mine.length];
  const next = mine[(at + 1) % mine.length];

  useEffect(() => {
    const previous = document.activeElement;
    ref.current?.querySelector(".ins-close")?.focus();
    return () => previous?.focus?.();
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.target.closest?.("input, textarea")) return;
      if (e.key === "ArrowLeft" && mine.length > 1) onInspect(prev);
      if (e.key === "ArrowRight" && mine.length > 1) onInspect(next);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, onInspect, prev, next, mine.length]);

  useEffect(() => {
    ref.current?.querySelector(".ins-text")?.scrollTo?.(0, 0);
  }, [card.id]);

  return (
    <div className="scrim" onPointerDown={(e) => e.target === e.currentTarget && onClose()}>
      <section ref={ref} className="inspect" role="dialog" aria-modal="true" aria-label={card.name}>
        <div className="ins-hand">
          <Card key={card.id} card={card} live className="is-big" />
          {mine.length > 1 && (
            <div className="ins-nav">
              <button type="button" className="btn btn-sm" onClick={() => onInspect(prev)} aria-label={`Previous: ${prev.name}`}>
                ←
              </button>
              <span>
                {at + 1} of {mine.length} owned
              </span>
              <button type="button" className="btn btn-sm" onClick={() => onInspect(next)} aria-label={`Next: ${next.name}`}>
                →
              </button>
            </div>
          )}
        </div>
        <div className="ins-text">
          <header className="ins-head">
            <p className="eyebrow">
              {set.name} · {set.code} {collectorNo(card)} · <span className={`rarity-${card.rarity}`}>{RARITY[card.rarity].mark} {RARITY[card.rarity].label}</span>
            </p>
            <h2>{card.name}</h2>
            <button type="button" className="btn btn-sm ins-close" onClick={onClose} aria-label="Close">
              ✕
            </button>
          </header>
          <Details card={card} owned={owned} onInspect={onInspect} />
        </div>
      </section>
    </div>
  );
}
