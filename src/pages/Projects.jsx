import React, { useState } from "react";
import "../styles/projects.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGamepad,
  faExternalLinkAlt,
  faTimes
} from "@fortawesome/free-solid-svg-icons";
import { faGithub, faNpm } from "@fortawesome/free-brands-svg-icons";

import { featuredProjects, allProjects } from "../components/projectList";

// Import project media
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

// Import technology icons
import html from "../images/tools/html.webp";
import css from "../images/tools/css.webp";
import js from "../images/tools/js.webp";
import nodejs from "../images/tools/nodejs.webp";
import reactjs from "../images/tools/reactjs.webp";
import csharp from "../images/tools/csharp.webp";
import sql from "../images/tools/sql.webp";
import unity from "../images/tools/unity.webp";
import aws from "../images/tools/aws.webp";
import angular from "../images/tools/angular.webp";
import ts from "../images/tools/ts.webp";
import nosql from "../images/tools/nosql.webp";
import azure from "../images/tools/azure.webp";
import openai from "../images/tools/openai.webp";
import tailwind from "../images/tools/tailwind.webp";

export default function Projects() {
  const [showOtherProjects, setShowOtherProjects] = useState(false);

  // Technology icon mapping
  const techIcons = {
    html: { icon: html, name: "HTML" },
    css: { icon: css, name: "CSS" },
    js: { icon: js, name: "JavaScript" },
    javascript: { icon: js, name: "JavaScript" },
    ts: { icon: ts, name: "TypeScript" },
    typescript: { icon: ts, name: "TypeScript" },
    node: { icon: nodejs, name: "Node.js" },
    nodejs: { icon: nodejs, name: "Node.js" },
    react: { icon: reactjs, name: "React.js" },
    reactjs: { icon: reactjs, name: "React.js" },
    angular: { icon: angular, name: "Angular" },
    csharp: { icon: csharp, name: "C#" },
    sql: { icon: sql, name: "SQL" },
    nosql: { icon: nosql, name: "NoSQL" },
    unity: { icon: unity, name: "Unity" },
    aws: { icon: aws, name: "AWS" },
    azure: { icon: azure, name: "Azure" },
    ai: { icon: openai, name: "OpenAI" },
    tailwind: { icon: tailwind, name: "Tailwind CSS" }
  };

  const assignMedia = (project) => {
    // For video projects
    const videoProjects = {
      DAIETpedia: DAIETpedia,
      CodepenAI: CodepenAI,
      "Password input npm package": PasswordInput,
      "Plastic Slurg": PlasticSlurg,
      Listr: Listr,
      "Sokoban game": Sokoban,
      "Sliding puzzles": SlidingPuzzles,
      "Flapry Blirb": FlapryBlirb,
      "Contact book": ContactBook
    };

    // For image projects
    const imageProjects = {
      Calculator: Calculator,
      "AI image generator": imageGenerator,
      "AI Image Generator": imageGenerator,
      "Image search app": imageSearchApp,
      "Community portal": CommunityPortal,
      "Vending machine": VendingMachine,
      "Spotify clone": SpotifyClone,
      "Lawn mower rental": LawnMowerRental,
      "Patisserie Lente": PatisserieLente
    };

    if (videoProjects[project.title]) {
      return { type: "video", src: videoProjects[project.title] };
    } else if (imageProjects[project.title]) {
      return { type: "image", src: imageProjects[project.title] };
    } else {
      return { type: "image", src: none };
    }
  };

  const ProjectCard = ({ project }) => {
    const media = assignMedia(project);

    return (
      <div className="project-card">
        <div className="project-media-container">
          {media.type === "video" ? (
            <video
              className="project-media"
              autoPlay
              loop
              muted
              playsInline
              controls
            >
              <source src={media.src} type="video/mp4" />
            </video>
          ) : (
            <img
              className="project-media"
              src={media.src}
              alt={project.title}
            />
          )}
          <div className="project-type-badge">
            {project.category || "Web App"}
          </div>
        </div>

        <div className="project-content">
          <div className="project-header">
            <h4 className="project-title">{project.title}</h4>
            <div className="project-links">
              {project.repository && (
                <a
                  href={project.repository}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-link"
                  title="View on GitHub"
                >
                  <FontAwesomeIcon icon={faGithub} />
                </a>
              )}
              {project.livedemo && (
                <a
                  href={project.livedemo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-link"
                  title="View Live Demo"
                >
                  <FontAwesomeIcon icon={faExternalLinkAlt} />
                </a>
              )}
              {project.npm && (
                <a
                  href={project.npm}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-link"
                  title="View on NPM"
                >
                  <FontAwesomeIcon icon={faNpm} />
                </a>
              )}
              {project.play && (
                <a
                  href={project.play}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-link"
                  title="Play Game"
                >
                  <FontAwesomeIcon icon={faGamepad} />
                </a>
              )}
            </div>
          </div>

          <p className="project-description">
            {project.description ||
              "A modern web application built with cutting-edge technologies."}
          </p>

          {project.technologies && (
            <div className="project-tech-stack">
              {project.technologies.map((tech, index) => {
                const techInfo = techIcons[tech.toLowerCase()];
                return techInfo ? (
                  <div key={index} className="tech-icon" title={techInfo.name}>
                    <img src={techInfo.icon} alt={techInfo.name} />
                  </div>
                ) : (
                  <span key={index} className="tech-tag">
                    {tech}
                  </span>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <section id="projects">
      <div className="projects-header">
        <h2>My Projects</h2>
        <p>
          A collection of AI-powered applications and full-stack solutions that
          showcase my expertise in artificial intelligence, machine learning,
          and modern web development. From intelligent chatbots to vector
          databases and everything in between.
        </p>
      </div>

      {/* Featured Projects */}
      <div className="featured-projects">
        <h3>Featured Projects</h3>
        <div className="project-cards-wrapper">
          {featuredProjects.map((project, index) => (
            <ProjectCard key={index} project={project} />
          ))}
        </div>
      </div>

      {/* Show More Button */}
      <div className="show-more-container">
        <button
          className="show-more-btn"
          onClick={() => setShowOtherProjects(true)}
        >
          View All Projects
        </button>
      </div>

      {/* Other Projects Modal */}
      {showOtherProjects && (
        <div className="other-projects-wrapper">
          <div
            className="overlay"
            onClick={() => setShowOtherProjects(false)}
          ></div>
          <div className="other-projects-content">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "var(--space-xl)"
              }}
            >
              <h3 style={{ margin: 0, fontSize: "var(--font-size-2xl)" }}>
                All Projects
              </h3>
              <button
                className="modal-close"
                onClick={() => setShowOtherProjects(false)}
                title="Close"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>

            <div className="project-cards-wrapper">
              {allProjects.map((project, index) => (
                <ProjectCard key={index} project={project} />
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
