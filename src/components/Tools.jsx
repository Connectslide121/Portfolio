import React from "react";
import html from "../images/tools/html.webp";
import css from "../images/tools/css.webp";
import js from "../images/tools/js.webp";
import nodejs from "../images/tools/nodejs.webp";
import reactjs from "../images/tools/reactjs.webp";
import csharp from "../images/tools/csharp.webp";
import sql from "../images/tools/sql.webp";
import unity from "../images/tools/unity.webp";
import git from "../images/tools/git.webp";
import github from "../images/tools/github.webp";
import aws from "../images/tools/aws.webp";
import angular from "../images/tools/angular.webp";
import ts from "../images/tools/ts.webp";
import nosql from "../images/tools/nosql.webp";
import azure from "../images/tools/azure.webp";
import azuredevops from "../images/tools/azuredevops.webp";

export default function Tools() {
  return (
    <div className="tools-wrapper">
      <h2>TECH STACK</h2>
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
          <img src={ts} alt="typescript" />
          <h3>TypeScript</h3>
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
          <img src={angular} alt="angular.js" />
          <h3>Angular</h3>
        </div>
        <div className="tool-card">
          <img src={csharp} alt="c-sharp" />
          <h3>C#</h3>
        </div>
        <div className="tool-card">
          <img src={azure} alt="azure" />
          <h3>Azure</h3>
        </div>
        <div className="tool-card">
          <img src={aws} alt="aws" />
          <h3>AWS</h3>
        </div>
        <div className="tool-card">
          <img src={sql} alt="sql" />
          <h3>SQL</h3>
        </div>
        <div className="tool-card">
          <img src={nosql} alt="nosql" />
          <h3>No SQL</h3>
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
          <img src={azuredevops} alt="azure devops" />
          <h3>Azure DevOps</h3>
        </div>
      </div>
    </div>
  );
}
