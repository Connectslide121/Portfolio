import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUpRightFromSquare,
  faCalendarAlt,
  faGraduationCap,
  faMapMarkerAlt
} from "@fortawesome/free-solid-svg-icons";

export default function Education() {
  return (
    <div className="about-item-wrapper">
      <div className="section-header">
        <h2>Education</h2>
        <p>My academic journey and continuous learning path</p>
      </div>
      <div className="education-grid">
        <div className="education-card">
          <div className="education-icon">
            <FontAwesomeIcon icon={faGraduationCap} />
          </div>
          <div className="education-content">
            <div className="education-header">
              <div className="education-meta">
                <div className="education-date">
                  <FontAwesomeIcon icon={faCalendarAlt} />
                  <span>2023 - 2024</span>
                </div>
                <div className="education-location">
                  <FontAwesomeIcon icon={faMapMarkerAlt} />
                  <span>Sweden</span>
                </div>
              </div>
              <a
                href="https://www.lexicon.se/"
                target="_blank"
                rel="noreferrer"
                title="Lexicon website"
                className="visit-link"
              >
                Visit site
                <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
              </a>
            </div>
            <div className="education-details">
              <h3>.NET Full-stack Developer Course</h3>
              <h4>Lexicon Växjö</h4>
              <p>
                Comprehensive full-stack development program focusing on modern
                .NET technologies, web development, and software engineering
                best practices.
              </p>
              <div className="tech-stack">
                <span className="tech-tag">C#</span>
                <span className="tech-tag">.NET Core</span>
                <span className="tech-tag">ASP.NET</span>
                <span className="tech-tag">Entity Framework</span>
                <span className="tech-tag">React</span>
                <span className="tech-tag">SQL Server</span>
              </div>
            </div>
          </div>
        </div>

        <div className="education-card">
          <div className="education-icon">
            <FontAwesomeIcon icon={faGraduationCap} />
          </div>
          <div className="education-content">
            <div className="education-header">
              <div className="education-meta">
                <div className="education-date">
                  <FontAwesomeIcon icon={faCalendarAlt} />
                  <span>2008 - 2010</span>
                </div>
                <div className="education-location">
                  <FontAwesomeIcon icon={faMapMarkerAlt} />
                  <span>Spain</span>
                </div>
              </div>
              <a
                href="https://www.leartik.eus/"
                target="_blank"
                rel="noreferrer"
                title="Lea Artibai website"
                className="visit-link"
              >
                Visit site
                <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
              </a>
            </div>
            <div className="education-details">
              <h3>HNC Casting Manufacturing & Powder Metallurgy</h3>
              <h4>Lea-Artibai</h4>
              <p>
                Specialized technical education in advanced manufacturing
                processes, metallurgy, and industrial production systems.
              </p>
              <div className="tech-stack">
                <span className="tech-tag">Manufacturing</span>
                <span className="tech-tag">Metallurgy</span>
                <span className="tech-tag">Quality Control</span>
                <span className="tech-tag">Process Design</span>
              </div>
            </div>
          </div>
        </div>

        <div className="education-card">
          <div className="education-icon">
            <FontAwesomeIcon icon={faGraduationCap} />
          </div>
          <div className="education-content">
            <div className="education-header">
              <div className="education-meta">
                <div className="education-date">
                  <FontAwesomeIcon icon={faCalendarAlt} />
                  <span>2005 - 2008</span>
                </div>
                <div className="education-location">
                  <FontAwesomeIcon icon={faMapMarkerAlt} />
                  <span>Spain</span>
                </div>
              </div>
              <a
                href="https://www.leartik.eus/"
                target="_blank"
                rel="noreferrer"
                title="Lea Artibai website"
                className="visit-link"
              >
                Visit site
                <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
              </a>
            </div>
            <div className="education-details">
              <h3>Polymers Engineering</h3>
              <h4>London Metropolitan University (Spain Campus)</h4>
              <p>
                Engineering degree focusing on polymer science, materials
                engineering, and advanced manufacturing techniques.
              </p>
              <div className="tech-stack">
                <span className="tech-tag">Polymer Science</span>
                <span className="tech-tag">Materials Engineering</span>
                <span className="tech-tag">Chemical Engineering</span>
                <span className="tech-tag">Research Methods</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
