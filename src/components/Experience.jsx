import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUpRightFromSquare,
  faCalendarAlt,
  faMapMarkerAlt,
} from "@fortawesome/free-solid-svg-icons";

export default function Experience() {
  return (
    <div className="about-item-wrapper">
      <div className="timeline">
        <div className="timeline-item">
          <div className="timeline-marker current"></div>
          <div className="timeline-content">
            <div className="experience-card">
              <div className="experience-header">
                <div className="experience-meta">
                  <div className="experience-date">
                    <FontAwesomeIcon icon={faCalendarAlt} />
                    <span>2025 - Present</span>
                  </div>
                  <div className="experience-location">
                    <FontAwesomeIcon icon={faMapMarkerAlt} />
                    <span>Sweden</span>
                  </div>
                </div>
                <a
                  href="https://sprinta.se"
                  target="_blank"
                  rel="noreferrer"
                  title="Sprinta website"
                  className="visit-link"
                >
                  Visit site
                  <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                </a>
              </div>
              <div className="experience-title">
                <h3>Lead Developer &amp; Platform Architect</h3>
                <h4>Sprinta Consulting AB</h4>
              </div>
              <div className="experience-description">
                <p className="experience-summary">
                  Lead developer and sole architect across a portfolio of
                  AI-powered products for the Jambiz Group, defining a shared
                  modern stack — Angular 21, .NET 8 Azure Functions, and
                  CosmosDB — and rapidly building MVPs as the company pivots to
                  product-led growth.
                </p>
                <ul className="experience-bullets">
                  <li>
                    Leading the modernization of{" "}
                    <a
                      href="https://www.podiumsystem.com"
                      target="_blank"
                      rel="noreferrer"
                      className="product-link"
                    >
                      Podium Suite
                    </a>{" "}
                    (Podium 2.0), rebuilding a 7-year-old legacy
                    tourism/transport platform on Angular 21 and Azure Functions
                    with feature parity and multi-tenant support
                  </li>
                  <li>
                    Built{" "}
                    <a
                      href="https://gentle-desert-0612fb603.7.azurestaticapps.net/"
                      target="_blank"
                      rel="noreferrer"
                      className="product-link"
                    >
                      Larademy
                    </a>
                    , an AI eLearning platform with a multi-agent
                    course-generation pipeline and vector-based RAG grounding
                  </li>
                  <li>
                    Built{" "}
                    <a
                      href="https://www.jambizhub.se"
                      target="_blank"
                      rel="noreferrer"
                      className="product-link"
                    >
                      Jambiz Hub
                    </a>
                    , a CRM/Procurement/Recruit platform featuring AI-driven CV
                    parsing, embeddings, and cosine-similarity scoring
                  </li>
                  <li>
                    Designed <strong>SAGE</strong>, a reusable Nx monorepo of
                    shared platform packages consumed across the product
                    portfolio
                  </li>
                  <li>
                    Took over and now lead development of{" "}
                    <a
                      href="https://www.govensa.se/"
                      target="_blank"
                      rel="noreferrer"
                      className="product-link"
                    >
                      Govensa
                    </a>
                    , an AI contract-accountability platform for the Swedish
                    public sector that extracts contract obligations for human
                    review and tracks them through an immutable, audit-ready
                    trail
                  </li>
                  <li>
                    Built{" "}
                    <strong>two React Native / Expo staff mobile apps</strong> —
                    one for the new Podium 2.0 and one for the legacy Podium
                    system, each talking to its own backend
                  </li>
                </ul>
                <div className="tech-stack">
                  <span className="tech-tag">Angular 21</span>
                  <span className="tech-tag">.NET 8</span>
                  <span className="tech-tag">Azure Functions</span>
                  <span className="tech-tag">CosmosDB</span>
                  <span className="tech-tag">React Native</span>
                  <span className="tech-tag">Vector Databases</span>
                  <span className="tech-tag">Azure AI</span>
                  <span className="tech-tag">RAG</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="timeline-item">
          <div className="timeline-marker"></div>
          <div className="timeline-content">
            <div className="experience-card">
              <div className="experience-header">
                <div className="experience-meta">
                  <div className="experience-date">
                    <FontAwesomeIcon icon={faCalendarAlt} />
                    <span>2024 - 2025</span>
                  </div>
                  <div className="experience-location">
                    <FontAwesomeIcon icon={faMapMarkerAlt} />
                    <span>Sweden</span>
                  </div>
                </div>
                <a
                  href="https://sprinta.se"
                  target="_blank"
                  rel="noreferrer"
                  title="Sprinta website"
                  className="visit-link"
                >
                  Visit site
                  <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                </a>
              </div>
              <div className="experience-title">
                <h3>AI Developer &amp; Consultant</h3>
                <h4>Sprinta Consulting AB</h4>
              </div>
              <div className="experience-description">
                <p className="experience-summary">
                  Sole developer of{" "}
                  <a
                    href="https://www.certumhub.com"
                    target="_blank"
                    rel="noreferrer"
                    className="product-link"
                  >
                    CertumHub
                  </a>
                  , an AI-powered platform for e-learning and sustainability
                  assessments with multilingual support, and later brought in as
                  a consultant to modernize the legacy{" "}
                  <a
                    href="https://www.podiumsystem.com"
                    target="_blank"
                    rel="noreferrer"
                    className="product-link"
                  >
                    Podium Stromma Suite
                  </a>{" "}
                  with a full UI facelift.
                </p>
                <ul className="experience-bullets">
                  <li>
                    Architected complex AI modules including course builder, ISO
                    26000 verification, and chat assistants
                  </li>
                  <li>
                    Implemented a vector database-powered AI content system
                    using embedding models and RAG architecture
                  </li>
                  <li>
                    Developed custom AI solutions integrating OpenAI APIs, Azure
                    Functions, CosmosDB, and ML models
                  </li>
                  <li>
                    Delivered a rapid UI facelift of the 7-year-old Podium
                    Stromma Suite, leading to a lead developer role on the
                    platform
                  </li>
                </ul>
                <div className="tech-stack">
                  <span className="tech-tag">Angular</span>
                  <span className="tech-tag">Azure Functions</span>
                  <span className="tech-tag">CosmosDB</span>
                  <span className="tech-tag">OpenAI API</span>
                  <span className="tech-tag">Vector Databases</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="timeline-item">
          <div className="timeline-marker"></div>
          <div className="timeline-content">
            <div className="experience-card">
              <div className="experience-header">
                <div className="experience-meta">
                  <div className="experience-date">
                    <FontAwesomeIcon icon={faCalendarAlt} />
                    <span>2011 - 2023</span>
                  </div>
                  <div className="experience-location">
                    <FontAwesomeIcon icon={faMapMarkerAlt} />
                    <span>Spain & India</span>
                  </div>
                </div>
                <a
                  href="https://www.amlsa.com/?lang=eng"
                  target="_blank"
                  rel="noreferrer"
                  title="AML website"
                  className="visit-link"
                >
                  Visit site
                  <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                </a>
              </div>
              <div className="experience-title">
                <h3>Plant Manager / Product Designer</h3>
                <h4>AML SA</h4>
              </div>
              <div className="experience-description">
                <p className="experience-summary">
                  Successfully established and managed production facilities
                  across Spain and India, leading international expansion and
                  cross-cultural operations.
                </p>
                <ul className="experience-bullets">
                  <li>
                    Managed sand casting steel foundry production including MTO
                    planning, CAD design, and process simulation
                  </li>
                  <li>
                    Led international expansion to India in 2017, establishing
                    new production facility from ground up
                  </li>
                  <li>
                    Trained international teams and coordinated cross-cultural
                    operations between countries
                  </li>
                  <li>
                    Designed workflows and led team leadership initiatives
                    across multiple locations
                  </li>
                </ul>
                <div className="tech-stack">
                  <span className="tech-tag">CAD Design</span>
                  <span className="tech-tag">Process Simulation</span>
                  <span className="tech-tag">MTO Planning</span>
                  <span className="tech-tag">Team Leadership</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
