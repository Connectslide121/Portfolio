// The platforms of today's role, as data: every line here restates a fact
// from the experience entries in journey.js (no new claims), shaped for
// designs that show the products themselves rather than the CV.

import { productUrl } from "./journey";

/** The products, in the order a visitor should meet them. */
export const products = [
  {
    id: "podium",
    name: "Podium Suite",
    role: "Leading the rebuild",
    kind: "Tourism & transport platform",
    line: "A 7-year-old legacy platform rebuilt on Angular 21 and Azure Functions, with feature parity and multi-tenant support, plus React Native staff apps.",
    stack: ["Angular 21", "Azure Functions", "CosmosDB", "React Native"],
    url: productUrl.podium,
  },
  {
    id: "knowia",
    name: "Knowia Studio",
    role: "Built",
    kind: "AI e-learning",
    line: "A multi-agent pipeline that generates courses, grounded with vector-based RAG.",
    stack: ["Angular", "Azure Functions", "Agents", "RAG"],
    url: productUrl.knowia,
  },
  {
    id: "govensa",
    name: "Govensa",
    role: "Leading development",
    kind: "AI contract accountability",
    line: "Extracts contract obligations for human review and tracks them through an immutable, audit-ready trail, for the Swedish public sector.",
    stack: ["AI extraction", "Human review", "Audit trail"],
    url: productUrl.govensa,
  },
  {
    id: "jambiz",
    name: "Jambiz Hub",
    role: "Built",
    kind: "CRM, procurement & recruiting",
    line: "One platform for customers, purchasing and hiring, with AI CV parsing, embeddings and similarity scoring.",
    stack: ["Embeddings", "CV parsing", "Similarity scoring"],
    url: productUrl.jambizHub,
  },
  {
    id: "certumhub",
    name: "CertumHub",
    role: "Sole developer",
    kind: "AI e-learning & sustainability",
    line: "E-learning and ISO 26000 sustainability assessments, multilingual, with a course builder and chat assistants.",
    stack: ["OpenAI", "Vector database", "Azure Functions", "CosmosDB"],
    url: productUrl.certumHub,
  },
  {
    id: "sage",
    name: "SAGE",
    role: "Designed",
    kind: "Shared platform",
    line: "A reusable Nx monorepo of shared platform packages that the products above are built on.",
    stack: ["Nx", "Shared packages"],
    url: null,
  },
];

/** The shared stack, layer by layer, top of the system to the bottom. */
export const layers = [
  { id: "client", name: "Client", items: ["Angular 21", "React Native / Expo", "TypeScript"], line: "Interfaces people enjoy using, on the web and on staff phones." },
  { id: "services", name: "Services", items: [".NET 8", "Azure Functions", "C#"], line: "Serverless backends, built multi-tenant." },
  { id: "data", name: "Data", items: ["CosmosDB", "Vector databases", "SQL"], line: "Documents, relations and embeddings, each where it fits." },
  { id: "ai", name: "AI", items: ["Azure AI", "OpenAI", "RAG", "Agents"], line: "Brought in where it genuinely adds value, and grounded in real data." },
];

/** How an AI feature runs in these products: Govensa's and Knowia's pattern. */
export const pipeline = [
  { id: "source", name: "Source", line: "A contract, a document, a course brief: the customer's own material." },
  { id: "ground", name: "Ground", line: "Embedded into a vector store, ready to be retrieved." },
  { id: "generate", name: "Generate", line: "Agents extract the obligations or build the course, grounded in what was retrieved." },
  { id: "review", name: "Review", line: "A person checks and approves. The AI proposes; it does not decide." },
  { id: "trace", name: "Trace", line: "Every step is kept in an audit-ready trail." },
];
