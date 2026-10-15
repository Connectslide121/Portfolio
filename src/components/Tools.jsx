import React from "react";
import Wobble from "./Wobble";
import { toolCategories, toolsIntro } from "../data/tools";

export default function Tools() {
  return (
    <div className="tools-wrapper">
      <div className="section-header">
        <p className="eyebrow">01 · About</p>
        <h2>
          Technologies <Wobble>& tools</Wobble>
        </h2>
        <p>{toolsIntro.tagline}</p>
      </div>

      {toolCategories.map((category, categoryIndex) => (
        <div key={categoryIndex} className="tool-category">
          <h4 className="category-title">{category.name}</h4>
          <div className="tool-cards-wrapper">
            {category.tools.map((tool, index) => (
              <div key={index} className="tool-card" title={tool.name}>
                <img src={tool.image} alt={tool.alt} width="64" height="64" decoding="async" />
                <h3>{tool.name}</h3>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
