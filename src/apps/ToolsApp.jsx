import React from "react";
import { toolCategories, toolsIntro } from "../data/tools";

/** Technologies and tools, as a Control Panel of applets. */
export default function ToolsApp() {
  const count = toolCategories.reduce((n, c) => n + c.tools.length, 0);
  return (
    <div className="control-panel">
      <p className="cp-intro">{toolsIntro.tagline}</p>
      <div className="cp-groups sunken">
        {toolCategories.map((cat) => (
          <fieldset key={cat.name} className="group-box">
            <legend>{cat.name}</legend>
            <ul className="applets">
              {cat.tools.map((tool) => (
                <li key={tool.name} title={tool.name}>
                  <span className="applet-icon">
                    <img src={tool.image} alt="" width="32" height="32" decoding="async" />
                  </span>
                  <span className="applet-label">{tool.name}</span>
                </li>
              ))}
            </ul>
          </fieldset>
        ))}
      </div>
      <footer className="status-bar">
        <span>{toolsIntro.title}</span>
        <span>{count} object(s)</span>
      </footer>
    </div>
  );
}
