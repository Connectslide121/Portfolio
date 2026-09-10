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
    orgId: "sprinta",
    dateLabel: "2025 - Present",
    location: "Sweden",
    org: "Sprinta Consulting AB",
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
    orgId: "sprinta",
    dateLabel: "2024 - 2025",
    location: "Sweden",
    org: "Sprinta Consulting AB",
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
    orgId: "aml",
    dateLabel: "2011 - 2023",
    location: "Spain & India",
    org: "AML SA",
    title: "Plant Manager / Product Designer",
    material: "steel",
    heat: 1,
    quest: {
      name: "Twelve Years In The Foundry",
      constraint:
        "Sand casting steel foundry, make-to-order, no margin for scrap — and later a second plant in India to bring up to the same standard.",
      objective:
        "Run production end to end — MTO planning, CAD design, process simulation — and the teams on both sites.",
      status: "Complete",
    },
    summary:
      "Managed production across Spain and India, leading AML’s international expansion and its cross-cultural operations.",
    bullets: [
      {
        text: "Managed sand casting steel foundry production including MTO planning, CAD design, and process simulation",
      },
      {
        text: "Led AML’s expansion into India in 2017, establishing operations at *Arihant Technocast Private Limited* — transferring production processes and bringing the plant up to standard",
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
    orgId: "lexicon",
    dateLabel: "2023 - 2024",
    location: "Sweden",
    org: "Lexicon Växjö",
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
    orgId: "lea-artibai",
    dateLabel: "2008 - 2010",
    location: "Spain",
    org: "Lea-Artibai",
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
    orgId: "london-met",
    dateLabel: "2005 - 2008",
    location: "Spain",
    org: "London Metropolitan University (Spain Campus)",
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
    orgs: ["london-met", "lea-artibai"],
    year: "2005 — 2010",
    railLabel: "2005",
    numeral: "2005",
    place: "Spain",
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
    orgs: ["aml"],
    year: "2011 — 2023",
    railLabel: "2011",
    numeral: "2011",
    place: "Spain",
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
    orgs: ["aml", "atpl"],
    year: "2017",
    railLabel: "2017",
    numeral: "2017",
    place: "Coimbatore, India",
    org: "AML SA → Arihant Technocast",
    role: "International Expansion",
    material: "steel + CAD",
    constraint:
      "An existing plant 8000 km from home, with no shared process and no trained team.",
    objective: "Get Arihant Technocast running to AML’s standard — transfer the process, train the team.",
    status: "Complete",
    heat: 0.82,
    entryIds: ["exp-aml"],
  },
  {
    id: "sweden",
    orgs: ["lexicon"],
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
    orgs: ["sprinta"],
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
    orgs: ["sprinta"],
    year: "2025 — Present",
    railLabel: "2025",
    numeral: "2025",
    place: "Sweden",
    org: "Sprinta Consulting AB",
    role: "Lead Developer & Platform Architect",
    material: "systems",
    constraint: "Sole architect across a whole portfolio, mid-pivot to product-led growth.",
    objective: "One shared stack behind Podium 2.0, Larademy, Jambiz Hub and Govensa.",
    status: "In progress",
    heat: 0,
    entryIds: ["exp-sprinta-lead"],
  },
  // Closing beat: the camera lifts to show the whole journey laid out, with
  // the things you can actually go and open sitting above it.
  {
    id: "recap",
    orgs: ["github"],
    year: "2005 — today",
    railLabel: "Recap",
    place: "github.com/Connectslide121",
    org: "Side projects, games & packages",
    role: "My Work",
    material: "whatever fits the problem",
    note: "Things built to learn with, outside the day job — web apps, a couple of games, and a published npm package. Every tile links to its code and, where there is one, a live demo.",
    kind: "projects",
    status: "Ongoing",
    heat: 0,
    entryIds: [],
  },
];

/**
 * The closing gallery, in display order. Titles resolve against
 * src/components/projectList.js and src/data/projectMedia.js, so a project
 * only needs listing here to appear.
 */
export const galleryProjects = [
  "CodepenAI",
  "DAIETpedia",
  "Contact book",
  "Plastic Slurg",
  "Sokoban game",
  "Password input npm package",
];

/**
 * One-line framings for the journey's closing beat. Keyed by the title in
 * src/components/projectList.js so the two cannot drift; the long-form
 * descriptions stay there for Résumé mode.
 */
export const projectBlurbs = {
  CodepenAI: "AI code editor — build and edit web apps by prompt, or write it yourself.",
  "Contact book": "Angular CRUD on CosmosDB + Azure Functions, end to end.",
  "Password input npm package":
    "Published npm component with configurable password-strength rules.",
  "Plastic Slurg": "A Metal Slug-style 2D shooter platformer, made in Unity.",
  DAIETpedia: "Recipe site where an AI builds a menu around your ingredients and diet.",
  Listr: "Shared list app on React with a C# API and SQL behind it.",
  "Sokoban game": "The classic crate-pushing puzzle, rebuilt from scratch.",
  "AI image generator": "Prompt-to-image generation against an external model API.",
};

/**
 * Revealed when the camera pulls back on the final beat.
 *
 * Deliberately the tech STACK, not the internal architecture: a recruiter
 * reading this is usually not an engineer, so it uses the names they will
 * recognise on a job spec. Internal tooling (SAGE) is left to the CV, where
 * there is room to say what it is.
 */
export const stack = [
  {
    id: "frontend",
    label: "Frontend",
    tint: "client",
    items: ["Angular", "React", "React Native", "Mithril.js", "TypeScript"],
  },
  {
    id: "backend",
    label: "Backend",
    tint: "compute",
    items: ["C# / .NET", "Azure Functions", "Node.js"],
  },
  {
    id: "data",
    label: "Data",
    tint: "data",
    items: ["SQL", "CosmosDB", "MongoDB", "Vector databases"],
  },
  {
    id: "ai",
    label: "AI",
    tint: "ai",
    items: ["OpenAI", "Azure AI", "RAG", "Embeddings"],
  },
];
