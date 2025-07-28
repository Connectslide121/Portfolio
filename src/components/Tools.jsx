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
import tailwind from "../images/tools/tailwind.webp";
import openai from "../images/tools/openai.webp";
import llm from "../images/tools/llm.webp";
import embedding from "../images/tools/embedding.webp";
import vectorDb from "../images/tools/vector_db.webp";
import rag from "../images/tools/rag.webp";
import azureai from "../images/tools/azureai.webp";
import cosmosdb from "../images/tools/cosmosdb.webp";
import mongodb from "../images/tools/mongodb.webp";
import mcp from "../images/tools/mcp.PNG";

export default function Tools() {
  const toolCategories = [
    {
      name: "AI & Machine Learning",
      tools: [
        { name: "OpenAI API", image: openai, alt: "openai" },
        { name: "Azure AI Foundry", image: azureai, alt: "azure ai foundry" },
        { name: "LLMs", image: llm, alt: "llm" },
        { name: "Embedding Models", image: embedding, alt: "embedding" },
        { name: "Vector Databases", image: vectorDb, alt: "vector database" },
        { name: "RAG", image: rag, alt: "rag" },
        { name: "MCP Servers", image: mcp, alt: "mcp servers" }
      ]
    },
    {
      name: "Frontend Development",
      tools: [
        { name: "React.js", image: reactjs, alt: "react.js" },
        { name: "Angular", image: angular, alt: "angular" },
        { name: "Tailwind", image: tailwind, alt: "tailwind css" },
        { name: "HTML", image: html, alt: "html" },
        { name: "CSS", image: css, alt: "css" },
        { name: "JavaScript", image: js, alt: "javascript" },
        { name: "TypeScript", image: ts, alt: "typescript" }
      ]
    },
    {
      name: "Backend Development",
      tools: [
        { name: "Node.js", image: nodejs, alt: "node.js" },
        { name: "C#", image: csharp, alt: "c-sharp" },
        { name: "SQL", image: sql, alt: "sql" },
        { name: "NoSQL", image: nosql, alt: "nosql" },
        { name: "CosmosDB", image: cosmosdb, alt: "cosmos db" },
        { name: "MongoDB", image: mongodb, alt: "mongodb" }
      ]
    },
    {
      name: "Cloud & DevOps",
      tools: [
        { name: "Azure", image: azure, alt: "azure" },
        { name: "AWS", image: aws, alt: "aws" },
        { name: "Azure DevOps", image: azuredevops, alt: "azure devops" },
        { name: "Git", image: git, alt: "git" },
        { name: "GitHub", image: github, alt: "github" }
      ]
    },
    {
      name: "Game Development",
      tools: [{ name: "Unity", image: unity, alt: "unity" }]
    }
  ];

  return (
    <div className="tools-wrapper">
      <div className="section-header">
        <h2>Technologies & Tools</h2>
        <p>Specialized in AI-powered solutions and full-stack development</p>
      </div>

      {toolCategories.map((category, categoryIndex) => (
        <div key={categoryIndex} className="tool-category">
          <h4 className="category-title">{category.name}</h4>
          <div className="tool-cards-wrapper">
            {category.tools.map((tool, index) => (
              <div key={index} className="tool-card" title={tool.name}>
                <img src={tool.image} alt={tool.alt} />
                <h3>{tool.name}</h3>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
