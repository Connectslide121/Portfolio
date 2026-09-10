// Single source of truth for career facts (D9 in docs/JOURNEY_PLAN.md).
// Consumed by BOTH Résumé mode (Experience.jsx / Education.jsx) and Journey
// mode (src/journey/*), so the two can never drift apart.
//
// Bullet text uses {Label} placeholders resolved against `links` — see
// renderRichText in src/components/richText.jsx.
//
// `heat` is the hot -> cold position of an entry, 1 = the foundry, 0 = today.
// It drives the accent colour in both modes.

export const experience = [
  {
    id: "exp-sprinta-lead",
    dateLabel: "2025 - Present",
    location: "Sweden",
    org: "Sprinta Consulting AB",
    orgUrl: "https://sprinta.se",
    orgUrlTitle: "Sprinta website",
    title: "Lead Developer & Platform Architect",
    material: "systems",
    heat: 0,
    quest: {
      name: "The Architect",
      constraint:
        "Sole architect across a whole product portfolio, mid-pivot to product-led growth.",
      objective:
        "Define one shared modern stack and ship MVPs fast without fragmenting the platform.",
      status: "In progress",
    },
    summary:
      "Lead developer and sole architect across a portfolio of AI-powered products for the Jambiz Group, defining a shared modern stack — Angular 21, .NET 8 Azure Functions, and CosmosDB — and rapidly building MVPs as the company pivots to product-led growth.",
    bullets: [
      {
        text: "Leading the modernization of {Podium Suite} (Podium 2.0), rebuilding a 7-year-old legacy tourism/transport platform on Angular 21 and Azure Functions with feature parity and multi-tenant support",
        links: { "Podium Suite": "https://www.podiumsystem.com" },
      },
      {
        text: "Built {Larademy}, an AI eLearning platform with a multi-agent course-generation pipeline and vector-based RAG grounding",
        links: {
          Larademy: "https://gentle-desert-0612fb603.7.azurestaticapps.net/",
        },
      },
      {
        text: "Built {Jambiz Hub}, a CRM/Procurement/Recruit platform featuring AI-driven CV parsing, embeddings, and cosine-similarity scoring",
        links: { "Jambiz Hub": "https://www.jambizhub.se" },
      },
      {
        text: "Designed *SAGE*, a reusable Nx monorepo of shared platform packages consumed across the product portfolio",
      },
      {
        text: "Took over and now lead development of {Govensa}, an AI contract-accountability platform for the Swedish public sector that extracts contract obligations for human review and tracks them through an immutable, audit-ready trail",
        links: { Govensa: "https://www.govensa.se/" },
      },
      {
        text: "Built *two React Native / Expo staff mobile apps* — one for the new Podium 2.0 and one for the legacy Podium system, each talking to its own backend",
      },
    ],
    tech: [
      "Angular 21",
      ".NET 8",
      "Azure Functions",
      "CosmosDB",
      "React Native",
      "Vector Databases",
      "Azure AI",
      "RAG",
    ],
  },
  {
    id: "exp-sprinta-ai",
    dateLabel: "2024 - 2025",
    location: "Sweden",
    org: "Sprinta Consulting AB",
    orgUrl: "https://sprinta.se",
    orgUrlTitle: "Sprinta website",
    title: "AI Developer & Consultant",
    material: "TypeScript + vectors",
    heat: 0.06,
    quest: {
      name: "The Seven-Year Legacy",
      constraint:
        "A 7-year-old platform with live customers, and AI modules with no prior art in-house.",
      objective:
        "Ship CertumHub solo, then modernize the legacy Podium suite without breaking it.",
      status: "Complete",
    },
    summary:
      "Sole developer of {CertumHub}, an AI-powered platform for e-learning and sustainability assessments with multilingual support, and later brought in as a consultant to modernize the legacy {Podium Stromma Suite} with a full UI facelift.",
    summaryLinks: {
      CertumHub: "https://www.certumhub.com",
      "Podium Stromma Suite": "https://www.podiumsystem.com",
    },
    bullets: [
      {
        text: "Architected complex AI modules including course builder, ISO 26000 verification, and chat assistants",
      },
      {
        text: "Implemented a vector database-powered AI content system using embedding models and RAG architecture",
      },
      {
        text: "Developed custom AI solutions integrating OpenAI APIs, Azure Functions, CosmosDB, and ML models",
      },
      {
        text: "Delivered a rapid UI facelift of the 7-year-old Podium Stromma Suite, leading to a lead developer role on the platform",
      },
    ],
    tech: [
      "Angular",
      "Azure Functions",
      "CosmosDB",
      "OpenAI API",
      "Vector Databases",
    ],
  },
  {
    id: "exp-aml",
    dateLabel: "2011 - 2023",
    location: "Spain & India",
    org: "AML SA",
    orgUrl: "https://www.amlsa.com/?lang=eng",
    orgUrlTitle: "AML website",
    title: "Plant Manager / Product Designer",
    material: "steel",
    heat: 1,
    quest: {
      name: "Greenfield, 8000 km From Home",
      constraint:
        "Sand casting steel foundry, make-to-order, no margin for scrap. Then: no facility, no team, no local process.",
      objective:
        "Run production end to end, then stand up a second plant in India from the ground up.",
      status: "Complete",
    },
    summary:
      "Successfully established and managed production facilities across Spain and India, leading international expansion and cross-cultural operations.",
    bullets: [
      {
        text: "Managed sand casting steel foundry production including MTO planning, CAD design, and process simulation",
      },
      {
        text: "Led international expansion to India in 2017, establishing new production facility from ground up",
      },
      {
        text: "Trained international teams and coordinated cross-cultural operations between countries",
      },
      {
        text: "Designed workflows and led team leadership initiatives across multiple locations",
      },
    ],
    tech: ["CAD Design", "Process Simulation", "MTO Planning", "Team Leadership"],
  },
];

export const education = [
  {
    id: "edu-lexicon",
    dateLabel: "2023 - 2024",
    location: "Sweden",
    org: "Lexicon Växjö",
    orgUrl: "https://www.lexicon.se/",
    orgUrlTitle: "Lexicon website",
    title: ".NET Full-stack Developer Course",
    material: "C#",
    heat: 0.12,
    quest: {
      name: "Career Reset At The Deep End",
      constraint: "New country, new language, no software background.",
      objective: "Retrain as a developer. C#, .NET, React, SQL Server, from zero.",
      status: "Complete",
    },
    summary:
      "Comprehensive full-stack development program focusing on modern .NET technologies, web development, and software engineering best practices.",
    tech: ["C#", ".NET Core", "ASP.NET", "Entity Framework", "React", "SQL Server"],
  },
  {
    id: "edu-leartik",
    dateLabel: "2008 - 2010",
    location: "Spain",
    org: "Lea-Artibai",
    orgUrl: "https://www.leartik.eus/",
    orgUrlTitle: "Lea Artibai website",
    title: "HNC Casting Manufacturing & Powder Metallurgy",
    material: "cast iron & steel",
    heat: 0.6,
    quest: {
      name: "Learning The Material",
      constraint: "Advanced manufacturing, metallurgy and production systems.",
      objective: "Learn how things are actually made, and how process defines quality.",
      status: "Complete",
    },
    summary:
      "Specialized technical education in advanced manufacturing processes, metallurgy, and industrial production systems.",
    tech: ["Manufacturing", "Metallurgy", "Quality Control", "Process Design"],
  },
  {
    id: "edu-polymers",
    dateLabel: "2005 - 2008",
    location: "Spain",
    org: "London Metropolitan University (Spain Campus)",
    orgUrl: "https://www.leartik.eus/",
    orgUrlTitle: "Lea Artibai website",
    title: "Polymers Engineering",
    material: "polymers",
    heat: 0.45,
    quest: {
      name: "Origin",
      constraint: "Polymer science, materials engineering, advanced manufacturing.",
      objective: "Build the engineering foundation everything else would stand on.",
      status: "Complete",
    },
    summary:
      "Engineering degree focusing on polymer science, materials engineering, and advanced manufacturing techniques.",
    tech: [
      "Polymer Science",
      "Materials Engineering",
      "Chemical Engineering",
      "Research Methods",
    ],
  },
];

/**
 * Journey beats. These do not map 1:1 onto résumé entries — the AML years are
 * two beats (Spain, then India), and the two engineering degrees are one — so
 * each beat points at the entries it came from via `entryIds`.
 */
export const beats = [
  {
    id: "origin",
    year: "2005 — 2010",
    railLabel: "2005",
    numeral: "2005",
    place: "Basque Country, Spain",
    org: "London Met · Lea-Artibai",
    role: "Engineering Studies",
    material: "polymers & metal",
    constraint: "Polymer science, then casting metallurgy and powder metallurgy.",
    objective: "Learn how things are made — and that process is what defines quality.",
    status: "Complete",
    heat: 0.4,
    entryIds: ["edu-polymers", "edu-leartik"],
  },
  {
    id: "foundry",
    year: "2011 — 2023",
    railLabel: "2011",
    numeral: "2011",
    place: "Basque Country, Spain",
    org: "AML SA",
    role: "Plant Manager / Product Designer",
    material: "steel",
    constraint: "Sand casting steel foundry. Make-to-order, no margin for scrap.",
    objective: "Run production end to end — MTO planning, CAD design, process simulation.",
    status: "Complete",
    heat: 1,
    entryIds: ["exp-aml"],
  },
  {
    id: "india",
    year: "2017",
    railLabel: "2017",
    numeral: "2017",
    place: "India",
    org: "AML SA",
    role: "International Expansion",
    material: "steel + CAD",
    constraint: "No facility, no team, no local process. Greenfield, 8000 km from home.",
    objective: "Stand up a second production plant from the ground up and train the team.",
    status: "Complete",
    heat: 0.82,
    entryIds: ["exp-aml"],
  },
  {
    id: "sweden",
    year: "2023 — 2024",
    railLabel: "2023",
    numeral: "2023",
    place: "Växjö, Sweden",
    org: "Lexicon",
    role: ".NET Full-stack Developer",
    material: "C#",
    constraint: "New country, new language, career reset at the deep end.",
    objective: "Retrain as a developer. C#, .NET, React, SQL Server, from zero.",
    status: "Complete",
    heat: 0.1,
    entryIds: ["edu-lexicon"],
  },
  {
    id: "sprinta",
    year: "2024 — 2025",
    railLabel: "2024",
    numeral: "2024",
    place: "Sweden",
    org: "Sprinta Consulting AB",
    role: "AI Developer & Consultant",
    material: "TypeScript + vectors",
    constraint: "Sole developer on CertumHub. AI modules with no prior art in-house.",
    objective: "Ship it, then modernize a 7-year-old platform without breaking it.",
    status: "Complete",
    heat: 0.05,
    entryIds: ["exp-sprinta-ai"],
  },
  {
    id: "architect",
    year: "2025 — Present",
    railLabel: "2025",
    numeral: "2025",
    place: "Sweden",
    org: "Sprinta Consulting AB",
    role: "Lead Developer & Platform Architect",
    material: "systems",
    constraint: "Sole architect across a whole portfolio, mid-pivot to product-led growth.",
    objective: "One shared stack. Podium 2.0, SAGE, Larademy, Jambiz Hub, Govensa.",
    status: "In progress",
    heat: 0,
    entryIds: ["exp-sprinta-lead"],
  },
];

/** Nodes revealed when the camera pulls back on the final beat. */
export const architecture = {
  nodes: [
    { id: "client", label: "Angular 21", x: 120, y: 250, kind: "client" },
    { id: "mobile", label: "React Native", x: 120, y: 430, kind: "client" },
    { id: "sage", label: "SAGE", x: 420, y: 340, kind: "shared" },
    { id: "fn", label: "Azure Functions", x: 720, y: 340, kind: "compute" },
    { id: "cosmos", label: "CosmosDB", x: 1010, y: 230, kind: "data" },
    { id: "vector", label: "Vector Store", x: 1010, y: 400, kind: "data" },
    { id: "ai", label: "Azure AI Foundry", x: 1010, y: 560, kind: "ai" },
  ],
  edges: [
    ["client", "sage"],
    ["mobile", "sage"],
    ["sage", "fn"],
    ["fn", "cosmos"],
    ["fn", "vector"],
    ["fn", "ai"],
    ["vector", "ai"],
  ],
};
