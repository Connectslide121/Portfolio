import React from "react";
import html from "../images/tools/skill1.webp";
import css from "../images/tools/skill2.webp";
import js from "../images/tools/skill3.webp";
import nodejs from "../images/tools/skill14.webp";
import reactjs from "../images/tools/skill4.webp";
import csharp from "../images/tools/skill5.webp";
import sql from "../images/tools/skill6.webp";
import dapper from "../images/tools/skill12.webp";
import entityfw from "../images/tools/skill13.webp";
import unity from "../images/tools/skill7.webp";
import git from "../images/tools/skill8.webp";
import github from "../images/tools/skill9.webp";
import nx from "../images/tools/skill10.webp";
import quikcast from "../images/tools/skill11.webp";

export default function Tools() {
  return (
    <div className="tools-wrapper">
      <h2>TECH-STACK</h2>
      <div className="tool-cards-wrapper">
        <div className="tool-card">
          <img src={html} alt="html" />
          <h3>HTML</h3>
        </div>
        <div className="tool-card">
          <img src={css} alt="css" />
          <h3>CSS</h3>
        </div>
        <div className="tool-card">
          <img src={js} alt="javascript" />
          <h3>JavaScript</h3>
        </div>
        <div className="tool-card">
          <img src={nodejs} alt="node.js" />
          <h3>Node.js</h3>
        </div>
        <div className="tool-card">
          <img src={reactjs} alt="react.js" />
          <h3>React.js</h3>
        </div>
        <div className="tool-card">
          <img src={csharp} alt="c-sharp" />
          <h3>C#</h3>
        </div>
        <div className="tool-card">
          <img src={sql} alt="sql" />
          <h3>SQL</h3>
        </div>
        <div className="tool-card">
          <img src={dapper} alt="dapper" />
          <h3>Dapper</h3>
        </div>
        <div className="tool-card">
          <img src={entityfw} alt="entity framework" />
          <h3>EntityFW</h3>
        </div>
        <div className="tool-card">
          <img src={unity} alt="unity" />
          <h3>Unity</h3>
        </div>
        <div className="tool-card">
          <img src={git} alt="git" />
          <h3>Git</h3>
        </div>
        <div className="tool-card">
          <img src={github} alt="github" />
          <h3>GitHub</h3>
        </div>
        <div className="tool-card">
          <img src={nx} alt="siemens nx" />
          <h3>NX</h3>
        </div>
        <div className="tool-card">
          <img src={quikcast} alt="quikcast" />
          <h3>QuikCAST</h3>
        </div>
      </div>
    </div>
  );
}
