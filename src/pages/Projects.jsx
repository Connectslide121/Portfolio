import React from "react";
import "../styles/projects.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLink } from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { projects } from "../components/projectList";
import DAIETpedia from "../images/projects/daietpedia.mp4";
import CodepenAI from "../images/projects/CodepenAI.mp4";
import PasswordInput from "../images/projects/password-input.mp4";

export default function Projects() {
  const assignVideo = (title) => {
    switch (title) {
      case "DAIETpedia":
        return DAIETpedia;
      case "CodepenAI":
        return CodepenAI;
      case "Password input npm package":
        return PasswordInput;
      default:
        return CodepenAI;
    }
  };

  return (
    <div id="projects">
      <h2>PROJECTS</h2>
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
              <h2>{project.title}</h2>
              <p>{project.description} </p>
              <div className="project-links">
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
                  <i class="fa-solid fa-link"></i>
                  <FontAwesomeIcon icon={faLink} />
                  <span>LIVE DEMO</span>
                </a>
              </div>
              <h4>{project.date}</h4>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
