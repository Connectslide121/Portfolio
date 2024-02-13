import React from "react";
import html from "../../images/tools/skill1.png";
import css from "../../images/tools/skill2.png";
import js from "../../images/tools/skill3.png";
import nodejs from "../../images/tools/skill14.png";
import reactjs from "../../images/tools/skill4.png";
import csharp from "../../images/tools/skill5.png";
import sql from "../../images/tools/skill6.png";
import dapper from "../../images/tools/skill12.png";
import entityfw from "../../images/tools/skill13.png";
import unity from "../../images/tools/skill7.png";
import git from "../../images/tools/skill8.png";
import github from "../../images/tools/skill9.png";
import nx from "../../images/tools/skill10.png";
import quikcast from "../../images/tools/skill11.png";

export default function Tools() {
  return (
    <div className="tools-wrapper">
      <h2>TECH-STACK</h2>
      <div className="tool-cards-wrapper">
        <div className="tool-card">
          <img src={html} alt="html" />
          <h4>HTML</h4>
        </div>
        <div className="tool-card">
          <img src={css} alt="css" />
          <h4>CSS</h4>
        </div>
        <div className="tool-card">
          <img src={js} alt="javascript" />
          <h4>JavaScript</h4>
        </div>
        <div className="tool-card">
          <img src={nodejs} alt="node.js" />
          <h4>Node.js</h4>
        </div>
        <div className="tool-card">
          <img src={reactjs} alt="react.js" />
          <h4>React.js</h4>
        </div>
        <div className="tool-card">
          <img src={csharp} alt="c-sharp" />
          <h4>C#</h4>
        </div>
        <div className="tool-card">
          <img src={sql} alt="sql" />
          <h4>SQL</h4>
        </div>
        <div className="tool-card">
          <img src={dapper} alt="dapper" />
          <h4>Dapper</h4>
        </div>
        <div className="tool-card">
          <img src={entityfw} alt="entity framework" />
          <h4>Entity FW</h4>
        </div>
        <div className="tool-card">
          <img src={unity} alt="unity" />
          <h4>Unity</h4>
        </div>
        <div className="tool-card">
          <img src={git} alt="git" />
          <h4>Git</h4>
        </div>
        <div className="tool-card">
          <img src={github} alt="github" />
          <h4>GitHub</h4>
        </div>
        <div className="tool-card">
          <img src={nx} alt="siemens nx" />
          <h4>NX</h4>
        </div>
        <div className="tool-card">
          <img src={quikcast} alt="quikcast" />
          <h4>QuikCAST</h4>
        </div>
      </div>
    </div>
  );
}
