import React from "react";
import "../styles/projects.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLink } from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { projects } from "../components/projectList";
import DAIETpedia from "../images/projects/daietpedia.mp4";
import CodepenAI from "../images/projects/CodepenAI.mp4";
import PasswordInput from "../images/projects/password-input.mp4";
import PlasticSlurg from "../images/projects/PlasticSlurg.mp4";
import nodejs from "../images/tools/skill14.png";
import reactjs from "../images/tools/skill4.png";
import csharp from "../images/tools/skill5.png";
import sql from "../images/tools/skill6.png";
import dapper from "../images/tools/skill12.png";
import entityfw from "../images/tools/skill13.png";
import unity from "../images/tools/skill7.png";

export default function Projects() {
  const assignVideo = (title) => {
    switch (title) {
      case "DAIETpedia":
        return DAIETpedia;
      case "CodepenAI":
        return CodepenAI;
      case "Password input npm package":
        return PasswordInput;
      case "Plastic Slurg":
        return PlasticSlurg;
      default:
        return CodepenAI;
    }
  };

  const assignTechnologies = (technologies) => {
    switch (technologies) {
      case "node":
        return nodejs;
      case "react":
        return reactjs;
      case "csharp":
        return csharp;
      case "sql":
        return sql;
      case "dapper":
        return dapper;
      case "entityfw":
        return entityfw;
      case "unity":
        return unity;
      default:
        return reactjs;
    }
  };

  return (
    <div id="projects">
      <h2>FEATURED PROJECTS</h2>
      <div className="project-cards-wrapper">
        {projects.map((project, index) => (
          <div key={index} className="project-card">
            <video
              className="project-media"
              src={assignVideo(project.title)}
              autoPlay
              muted
              controls
            ></video>
            <div className="project-description">
              <div className="project-header">
                <div className="project-title">
                  <h2>{project.title}</h2>
                  <h4>{project.date}</h4>
                </div>
                <div className="project-technologies">
                  {project.technologies.map((technology) => (
                    <img
                      src={assignTechnologies(technology)}
                      alt={technology}
                      title={technology}
                    ></img>
                  ))}
                </div>
              </div>
              <p>{project.description}</p>
              {project.details && (
                <ul className="project-details-list">
                  {project.details.map((detail) => (
                    <li>{detail}</li>
                  ))}
                </ul>
              )}
              <div className="project-buttons">
                <a
                  href={project.repository}
                  title="Repository"
                  target="_blank"
                  rel="noreferrer"
                >
                  <FontAwesomeIcon icon={faGithub} />
                  <span>SOURCE CODE</span>
                </a>
                <a
                  href={project.livedemo}
                  title="Visit site"
                  target="_blank"
                  rel="noreferrer"
                >
                  <FontAwesomeIcon icon={faLink} />
                  {project.title === "Password input npm package" ? (
                    <span>NPM PAGE</span>
                  ) : (
                    <span>LIVE DEMO</span>
                  )}
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
