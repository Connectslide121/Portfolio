import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUpRightFromSquare,
  faCalendarAlt,
  faMapMarkerAlt
} from "@fortawesome/free-solid-svg-icons";

export default function Experience() {
  return (
    <div className="about-item-wrapper">
      <div className="section-header">
        <h2>Experience</h2>
        <p>My professional journey in technology and product development</p>
      </div>
      <div className="timeline">
        <div className="timeline-item">
          <div className="timeline-marker current"></div>
          <div className="timeline-content">
            <div className="experience-card">
              <div className="experience-header">
                <div className="experience-meta">
                  <div className="experience-date">
                    <FontAwesomeIcon icon={faCalendarAlt} />
                    <span>2024 - Present</span>
                  </div>
                  <div className="experience-location">
                    <FontAwesomeIcon icon={faMapMarkerAlt} />
                    <span>Sweden</span>
                  </div>
                </div>
                <a
                  href="https://www.certumhub.com"
                  target="_blank"
                  rel="noreferrer"
                  title="CertumHub website"
                  className="visit-link"
                >
                  Visit site
                  <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                </a>
              </div>
              <div className="experience-title">
                <h3>AI Developer &amp; Platform Architect</h3>
                <h4>Sprinta Consulting AB</h4>
              </div>
              <div className="experience-description">
                <p className="experience-summary">
                  Sole developer of CertumHub, an AI-powered platform for
                  e-learning and sustainability assessments with multilingual
                  support and advanced AI capabilities.
                </p>
                <ul className="experience-bullets">
                  <li>
                    Architected complex AI modules including course builder,
                    ISO26000 verification, and chat assistants
                  </li>
                  <li>
                    Implemented vector database-powered AI content system using
                    embedding models and RAG architecture
                  </li>
                  <li>
                    Developed custom AI solutions integrating OpenAI APIs, Azure
                    Functions, CosmosDB, and ML models
                  </li>
                  <li>
                    Led customer support and conducted product demos for new
                    clients
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
