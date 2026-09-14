// Technology marks for the project cards, keyed by the short names used in
// `technologies` in src/components/projectList.js.
//
// Shared by Résumé mode's cards and Journey mode's work sheet, for the same
// reason the media map is (D24): this table lived inside Projects.jsx, and
// copying it into the journey would have guaranteed drift the first time a
// project gained a technology.
//
// Note this is keyed differently from TECH_LOGOS in techLogos.js, which is
// keyed by the label printed on a stack pill ("C# / .NET"). Same images, two
// vocabularies — the projects data has always spoken in short keys.

import html from "../images/tools/html.webp";
import css from "../images/tools/css.webp";
import js from "../images/tools/js.webp";
import nodejs from "../images/tools/nodejs.webp";
import reactjs from "../images/tools/reactjs.webp";
import csharp from "../images/tools/csharp.webp";
import sql from "../images/tools/sql.webp";
import unity from "../images/tools/unity.webp";
import aws from "../images/tools/aws.webp";
import angular from "../images/tools/angular.webp";
import ts from "../images/tools/ts.webp";
import nosql from "../images/tools/nosql.webp";
import azure from "../images/tools/azure.webp";
import openai from "../images/tools/openai.webp";
import tailwind from "../images/tools/tailwind.webp";

export const PROJECT_TECH = {
  html: { icon: html, name: "HTML" },
  css: { icon: css, name: "CSS" },
  js: { icon: js, name: "JavaScript" },
  javascript: { icon: js, name: "JavaScript" },
  ts: { icon: ts, name: "TypeScript" },
  typescript: { icon: ts, name: "TypeScript" },
  node: { icon: nodejs, name: "Node.js" },
  nodejs: { icon: nodejs, name: "Node.js" },
  react: { icon: reactjs, name: "React.js" },
  reactjs: { icon: reactjs, name: "React.js" },
  angular: { icon: angular, name: "Angular" },
  csharp: { icon: csharp, name: "C#" },
  sql: { icon: sql, name: "SQL" },
  nosql: { icon: nosql, name: "NoSQL" },
  unity: { icon: unity, name: "Unity" },
  aws: { icon: aws, name: "AWS" },
  azure: { icon: azure, name: "Azure" },
  ai: { icon: openai, name: "OpenAI" },
  tailwind: { icon: tailwind, name: "Tailwind CSS" },
};

/** Unknown keys return undefined — callers print the raw key instead. */
export const techFor = (key) => PROJECT_TECH[String(key).toLowerCase()];
