import React, { useState } from "react";
import "../styles/about.css";
import board from "../images/about-board.png";
import tools from "../images/about-tools.png";
import education from "../images/about-education.png";
import experience from "../images/about-experience.png";
import Tools from "./About/Tools";
import Education from "./About/Education";
import Experience from "./About/Experience";

export default function About() {
  const [display, setDisplay] = useState("tools");
  const [toolsClasses, setToolsClasses] = useState(
    "about-image about-link active-link"
  );
  const [educationClasses, setEducationClasses] = useState(
    "about-image about-link"
  );
  const [experienceClasses, setExperienceClasses] = useState(
    "about-image about-link"
  );

  const handleToolsClick = () => {
    setDisplay("tools");
    setToolsClasses("about-image about-link active-link");
    setEducationClasses("about-image about-link");
    setExperienceClasses("about-image about-link");
  };

  const handleEducationClick = () => {
    setDisplay("education");
    setToolsClasses("about-image about-link");
    setEducationClasses("about-image about-link active-link");
    setExperienceClasses("about-image about-link");
  };

  const handleExperienceClick = () => {
    setDisplay("experience");
    setToolsClasses("about-image about-link");
    setEducationClasses("about-image about-link");
    setExperienceClasses("about-image about-link active-link");
  };

  return (
    <div id="about">
      <div className="about-image-wrapper">
        <img
          src={board}
          alt="about me links"
          className="about-image about-board-image"
        />
        <div className="about-links-wrapper">
          <img
            src={tools}
            title="tech-stack"
            alt="tech-stack link"
            className={toolsClasses}
            onClick={handleToolsClick}
          />
          <img
            src={education}
            title="education"
            alt="education link"
            className={educationClasses}
            onClick={handleEducationClick}
          />
          <img
            src={experience}
            title="experience"
            alt="experience link"
            className={experienceClasses}
            onClick={handleExperienceClick}
          />
        </div>
      </div>
      <div className="about-text-wrapper">
        {display === "tools" && <Tools />}
        {display === "education" && <Education />}
        {display === "experience" && <Experience />}
      </div>
    </div>
  );
}
