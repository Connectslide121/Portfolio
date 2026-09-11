// Logos for the stack diagram, keyed by the label shown on each pill. Reuses
// the marks already in src/images/tools/ so Résumé mode and Journey mode draw
// from the same assets.
//
// `tone` describes the ARTWORK, and decides the colour of the disc drawn
// behind it. It is not a guess: it comes from the mean luminance of each
// file's non-transparent pixels, with anything above 0.55 treated as light
// artwork that needs a dark disc. Without this, near-white marks (Mithril at
// 0.90, RAG at 0.78) vanished completely on a white disc.

import angular from "../images/tools/angular.webp";
import reactjs from "../images/tools/reactjs.webp";
import mithriljs from "../images/tools/mithriljs.png";
import ts from "../images/tools/ts.webp";
import csharp from "../images/tools/csharp.webp";
import azure from "../images/tools/azure.webp";
import nodejs from "../images/tools/nodejs.webp";
import sql from "../images/tools/sql.webp";
import cosmosdb from "../images/tools/cosmosdb.webp";
import mongodb from "../images/tools/mongodb.webp";
import vectorDb from "../images/tools/vector_db.webp";
import openai from "../images/tools/openai.webp";
import azureai from "../images/tools/azureai.webp";
import rag from "../images/tools/rag.webp";
import embedding from "../images/tools/embedding.webp";

const dark = (src) => ({ src, tone: "dark" }); // dark ink -> light disc
const light = (src) => ({ src, tone: "light" }); // light ink -> dark disc

export const TECH_LOGOS = {
  Angular: dark(angular),
  React: light(reactjs),
  "React Native": light(reactjs),
  "Mithril.js": light(mithriljs),
  TypeScript: dark(ts),
  // No .NET mark exists in the repo, and C# and .NET belong on one pill
  // anyway — a recruiter reads them together.
  "C# / .NET": dark(csharp),
  "Azure Functions": dark(azure),
  "Node.js": light(nodejs),
  SQL: dark(sql),
  CosmosDB: light(cosmosdb),
  MongoDB: light(mongodb),
  "Vector databases": light(vectorDb),
  OpenAI: dark(openai),
  "Azure AI": dark(azureai),
  RAG: light(rag),
  Embeddings: dark(embedding),
};

export const logoFor = (label) => TECH_LOGOS[label];
