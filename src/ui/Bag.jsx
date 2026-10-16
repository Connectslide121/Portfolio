import React, { useState } from "react";
import Panel from "./Panel";
import { toolCategories, toolsIntro } from "../data/tools";

/** The tools as an inventory: every one an item in a slot. */
export default function Bag({ onClose }) {
  const items = toolCategories.flatMap((c) => c.tools.map((t) => ({ ...t, cat: c.name })));
  const [sel, setSel] = useState(items[0]);
  return (
    <Panel title={`Bag · ${items.length} items`} onClose={onClose} wide>
      <p className="panel-note">{toolsIntro.tagline}</p>
      <div className="bag">
        <div className="bag-grid">
          {toolCategories.map((c) => (
            <section key={c.name}>
              <h3>{c.name}</h3>
              <ul>
                {c.tools.map((t) => (
                  <li key={t.name}>
                    <button
                      type="button"
                      className={`slot${sel.name === t.name ? " is-sel" : ""}`}
                      onClick={() => setSel({ ...t, cat: c.name })}
                      onMouseEnter={() => setSel({ ...t, cat: c.name })}
                      aria-label={t.name}
                    >
                      <img src={t.image} alt="" width="28" height="28" />
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
        <aside className="bag-item">
          <span className="slot is-big">
            <img src={sel.image} alt="" width="56" height="56" />
          </span>
          <h3>{sel.name}</h3>
          <p>{sel.cat}</p>
        </aside>
      </div>
    </Panel>
  );
}
