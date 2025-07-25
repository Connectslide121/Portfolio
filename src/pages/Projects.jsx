import React, { useState } from "react";
import "../styles/projects.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLink, faGamepad } from "@fortawesome/free-solid-svg-icons";
import { faGithub, faNpm } from "@fortawesome/free-brands-svg-icons";

import { featuredProjects, allProjects } from "../components/projectList";

import html from "../images/tools/html.webp";
import css from "../images/tools/css.webp";
import javascript from "../images/tools/js.webp";
import typescript from "../images/tools/ts.webp";
import nodejs from "../images/tools/nodejs.webp";
import reactjs from "../images/tools/reactjs.webp";
import angular from "../images/tools/angular.webp";
import csharp from "../images/tools/csharp.webp";
import sql from "../images/tools/sql.webp";
import nosql from "../images/tools/nosql.webp";
import azure from "../images/tools/azure.webp";
import aws from "../images/tools/aws.webp";
import unity from "../images/tools/unity.webp";

import DAIETpedia from "../images/projects/daietpedia.mp4";
import CodepenAI from "../images/projects/CodepenAI.mp4";
import PasswordInput from "../images/projects/password-input.mp4";
import PlasticSlurg from "../images/projects/plastic-slurg.mp4";
import Listr from "../images/projects/listr.mp4";
import Sokoban from "../images/projects/Sokoban.mp4";
import SlidingPuzzles from "../images/projects/sliding-puzzles.mp4";
import FlapryBlirb from "../images/projects/flapry-blirb.mp4";
import ContactBook from "../images/projects/contact-book.mp4";

import Calculator from "../images/projects/calculator.webp";
import imageGenerator from "../images/projects/ai-image-generator.webp";
import imageSearchApp from "../images/projects/image-search-app.webp";
import CommunityPortal from "../images/projects/community-portal.webp";
import VendingMachine from "../images/projects/vending-machine.webp";
import SpotifyClone from "../images/projects/spotify-clone.webp";
import LawnMowerRental from "../images/projects/lawn-mower-rental.webp";
import PatisserieLente from "../images/projects/patisserie-lente.webp";
import none from "../images/projects/none.jpg";

export default function Projects() {
  const [showOtherProjects, setShowOtherProjects] = useState(false);

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
      case "Listr":
        return Listr;
      case "Sokoban game":
        return Sokoban;
      case "Sliding puzzles":
        return SlidingPuzzles;
      case "Flapry Blirb":
        return FlapryBlirb;
      case "Contact book":
        return ContactBook;
      default:
        return CodepenAI;
    }
  };

  const assignImage = (title) => {
    switch (title) {
      case "Calculator":
        return Calculator;
      case "AI image generator":
        return imageGenerator;
      case "Image search app":
        return imageSearchApp;
      case "Community portal":
        return CommunityPortal;
      case "Vending machine":
        return VendingMachine;
      case "Spotify clone":
        return SpotifyClone;
      case "Lawn mower rental":
        return LawnMowerRental;
      case "Patisserie Lente":
        return PatisserieLente;
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
      case "angular":
        return angular;
      case "csharp":
        return csharp;
      case "sql":
        return sql;
      case "unity":
        return unity;
      case "js":
        return javascript;
      case "ts":
        return typescript;
      case "html":
        return html;
      case "css":
        return css;
      case "aws":
        return aws;
      case "azure":
        return azure;
      case "nosql":
        return nosql;
      default:
        return none;
    }
  };

  const assignIcon = (button) => {
    switch (button) {
      case "Documentation":
        return faNpm;
      case "Live demo":
        return faLink;
      case "Play game":
        return faGamepad;
      default:
        return faGithub;
    }
  };

  const openOtherProjects = () => {
    setShowOtherProjects(true);
    document.body.classList.add("other-projects-open");
  };

  const closeOtherProjects = () => {
    setShowOtherProjects(false);
    document.body.classList.remove("other-projects-open");
  };

  return (
    <section id="projects">
      <h2>FEATURED PROJECTS</h2>
      <div className="project-cards-wrapper">
        {featuredProjects.map((project, index) => (
          <div key={index} className="project-card">
            {project.media === "video" ? (
              <video
                className="project-media"
                muted
                controls
                playsInline
              >
                <source src={assignVideo(project.title)} type="video/mp4" />
              </video>
            ) : (
              <img
                className="project-media"
                src={assignImage(project.title)}
                alt={project.title}
              />
            )}
            <div className="project-description">
              <div className="project-header">
                <div className="project-title">
                  <h2>{project.title}</h2>
                </div>
                <div className="project-technologies">
                  {project.technologies.map((technology, index) => (
                    <img
                      key={index}
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
                  {project.details.map((detail, index) => (
                    <li key={index}>
                      <p>{detail}</p>
                    </li>
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
                  <span>Source code</span>
                </a>
                {project.livedemo && (
                  <a
                    href={project.livedemo}
                    title="Visit site"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <FontAwesomeIcon icon={assignIcon(project.button)} />
                    <span>{project.button}</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      <button className="other-projects-button" onClick={openOtherProjects}>
        - Other projects -
      </button>
      {showOtherProjects && (
        <div className="other-projects-wrapper">
          <div className="overlay" onClick={closeOtherProjects}></div>
          <div className="other-projects-content">
            <div className="project-cards-wrapper">
              {allProjects.map((project, index) => (
                <div key={index} className="project-card">
                  {project.media === "video" ? (
                    <video
                      className="project-media"
                      muted
                      controls
                      playsInline
                    >
                      <source src={assignVideo(project.title)} type="video/mp4" />
                    </video>
                  ) : (
                    <img
                      className="project-media"
                      src={assignImage(project.title)}
                      alt={project.title}
                    />
                  )}
                  <div className="project-description">
                    <div className="project-header">
                      <div className="project-title">
                        <h2>{project.title}</h2>
                      </div>
                      <div className="project-technologies">
                        {project.technologies.map((technology, index) => (
                          <img
                            key={index}
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
                        {project.details.map((detail, index) => (
                          <li key={index}>{detail}</li>
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
                        <span>Source code</span>
                      </a>
                      {project.livedemo && (
                        <a
                          href={project.livedemo}
                          title="Visit site"
                          target="_blank"
                          rel="noreferrer"
                        >
                          <FontAwesomeIcon icon={assignIcon(project.button)} />
                          <span>{project.button}</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button
            className="other-projects-button"
            onClick={closeOtherProjects}
          >
            - Close -
          </button>
        </div>
      )}
    </section>
  );
}
