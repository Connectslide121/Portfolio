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
  const tools = [
    { name: "HTML", image: html, alt: "html" },
    { name: "CSS", image: css, alt: "css" },
    { name: "JavaScript", image: js, alt: "javascript" },
    { name: "TypeScript", image: ts, alt: "typescript" },
    { name: "Node.js", image: nodejs, alt: "node.js" },
    { name: "React.js", image: reactjs, alt: "react.js" },
    { name: "Angular", image: angular, alt: "angular" },
    { name: "C#", image: csharp, alt: "c-sharp" },
    { name: "Azure", image: azure, alt: "azure" },
    { name: "AWS", image: aws, alt: "aws" },
    { name: "SQL", image: sql, alt: "sql" },
    { name: "NoSQL", image: nosql, alt: "nosql" },
    { name: "Unity", image: unity, alt: "unity" },
    { name: "Git", image: git, alt: "git" },
    { name: "GitHub", image: github, alt: "github" },
    { name: "Azure DevOps", image: azuredevops, alt: "azure devops" }
  ];

  return (
    <div className="tools-wrapper">
      <div className="tools-header">
        <h3>Technologies & Tools</h3>
        <p>Technologies I work with to build amazing digital experiences</p>
      </div>
      <div className="tool-cards-wrapper">
        {tools.map((tool, index) => (
          <div key={index} className="tool-card" title={tool.name}>
            <img src={tool.image} alt={tool.alt} />
            <h3>{tool.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}
