import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";

export default function Experience() {
  return (
    <div className="about-item-wrapper">
      <h2>EXPERIENCE</h2>
      <div>
        <ul>
          <li>
            <div className="about-item-header">
              <h3>2024</h3>
              <a
                href="https://sprinta.se/"
                target="_blank"
                rel="noreferrer"
                title="Sprinta website"
              >
                Visit site
                <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
              </a>
            </div>
            <h3> System developer at Sprinta (Sweden)</h3>
            <p>
              - Developed an AI powered "internal tools" application for the
              company using Angular, Azure Functions and CosmosDB. The
              application is used to manage the company's consultants data and
              generate CVs easily.
              <br />
              <br />- Currently developing{" "}
              <a
                href="https://www.certumhub.com"
                target="_blank"
                rel="noreferrer"
                className="experience-link"
              >
                www.certumhub.com
              </a>
              , an AI powered web application to help companies apply for
              different certificates (ISO, WCAG...).
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
            <h3> Plant Manager/Product designer at AML SA (Spain)</h3>
            <p>
              Managed production at a sand casting steel foundry. Daily &#38;
              weekly MTO production planning, pattern designing, 3D drawing and
              process simulation have been part of my main responsibilities.
            </p>
          </li>
          <li>
            <div className="about-item-header">
              <h3>2017</h3>
              <a
                href="https://arihanttechnocastindia.com/"
                target="_blank"
                rel="noreferrer"
                title="ATPL website"
              >
                Visit site
                <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
              </a>
            </div>
            <h3> Plant Manager/Product designer at ATPL PL (India)</h3>
            <p>
              Started up the production line in a newly opened foundry, designed
              workflow, taught employees and led the production team.
            </p>
          </li>
        </ul>
      </div>
    </div>
  );
}
