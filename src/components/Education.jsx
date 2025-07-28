import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";

export default function Education() {
  return (
    <div className="about-item-wrapper">
      <h2>Education</h2>
      <div>
        <ul>
          <li>
            <div className="about-item-header">
              <h3>2023 - 2024</h3>
              <a
                href="https://www.lexicon.se/"
                target="_blank"
                rel="noreferrer"
                title="Lexicon website"
              >
                Visit site
                <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
              </a>
            </div>
            <h3>.NET Full-stack developer course at Lexicon Växjö (Sweden)</h3>
          </li>
          <li>
            <div className="about-item-header">
              <h3>2008 - 2010</h3>
              <a
                href="https://www.leartik.eus/"
                target="_blank"
                rel="noreferrer"
                title="Lea Artibai website"
              >
                Visit site
                <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
              </a>
            </div>
            <h3>
              HNC of Casting manufacturing &#38; powder metallurgy at
              Lea-Artibai (Spain)
            </h3>
          </li>
          <li>
            <div className="about-item-header">
              <h3>2005 - 2008</h3>
              <a
                href="https://www.leartik.eus/"
                target="_blank"
                rel="noreferrer"
                title="Lea Artibai website"
              >
                Visit site
                <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
              </a>
            </div>
            <h3>
              Polymers Engineering at London Metropolitan University (Spain)
            </h3>
          </li>
        </ul>
      </div>
    </div>
  );
}
