import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";

export default function Experience() {
  return (
    <div className="about-item-wrapper">
      <h2>Experience</h2>
      <div>
        <ul>
          <li>
            <div className="about-item-header">
              <h3>2024 - Present</h3>
              <a
                href="https://www.certumhub.com"
                target="_blank"
                rel="noreferrer"
                title="CertumHub website"
              >
                Visit site
                <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
              </a>
            </div>
            <h3>
              Sprinta Consulting AB, Sweden - AI Developer &amp; Platform
              Architect
            </h3>
            <p>
              • Sole developer of CertumHub, an AI-powered platform for
              e-learning and sustainability assessments with multilingual
              support and advanced AI capabilities.
              <br />• Architected and built complex AI modules including a
              course builder, ISO26000 verification module, auditor workflows,
              and intelligent AI chat assistants using Angular, Azure Functions,
              CosmosDB, and OpenAI GPT models.
              <br />• Designed and implemented a vector database-powered AI
              content system for real-time context-aware interactions using
              embedding models and RAG architecture.
              <br />• Developed custom AI solutions integrating OpenAI APIs,
              vector databases, and machine learning models for intelligent
              content generation and user assistance.
              <br />• Took ownership of customer support and conducted product
              demos for new clients, showcasing AI-powered features.
            </p>
          </li>
          <li>
            <div className="about-item-header">
              <h3>2011 - 2023</h3>
              <a
                href="https://www.amlsa.com/?lang=eng"
                target="_blank"
                rel="noreferrer"
                title="AML website"
              >
                Visit site
                <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
              </a>
            </div>
            <h3>
              AML SA, Spain &amp; India - Plant Manager / Product designer
            </h3>
            <p>
              • Managed production at AML SA’s sand casting steel foundry in
              Spain, including daily and weekly MTO planning, CAD pattern
              design, and process simulation.
              <br />• In 2017, sent to India by AML to start up a new production
              facility (ATPL PL), where I established the production line,
              trained employees, and led operations until handover.
              <br />• Played a key role in workflow design, team leadership, and
              cross-cultural coordination between headquarters in Spain and the
              Indian subsidiary.
            </p>
          </li>
        </ul>
      </div>
    </div>
  );
}
