import React, { useEffect, useState } from "react";
import "../styles/navbar.css";
import logo from "../images/logo.webp";
import ThemeToggle from "./ThemeToggle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";

export default function Navbar() {
  const [scrollY, setScrollY] = useState(0);
  const [homeHeight, setHomeHeight] = useState(0);
  const [projectsHeight, setProjectsHeight] = useState(0);
  const [aboutHeight, setAboutHeight] = useState(0);
  const [homeClass, setHomeClass] = useState("active-nav-link");
  const [projectsClass, setProjectsClass] = useState("");
  const [aboutClass, setAboutClass] = useState("");
  const [contactClass, setContactClass] = useState("");

  window.onscroll = () => {
    setScrollY(window.scrollY);

    if (scrollY < homeHeight - window.innerHeight / 2.5) {
      setHomeClass("active-nav-link");
      setProjectsClass("");
      setAboutClass("");
      setContactClass("");
    } else if (
      scrollY <
      homeHeight + projectsHeight - window.innerHeight / 2.5
    ) {
      setHomeClass("");
      setProjectsClass("active-nav-link");
      setAboutClass("");
      setContactClass("");
    } else if (
      scrollY <
      homeHeight + projectsHeight + aboutHeight - window.innerHeight / 2.5
    ) {
      setHomeClass("");
      setProjectsClass("");
      setAboutClass("active-nav-link");
      setContactClass("");
    } else {
      setHomeClass("");
      setProjectsClass("");
      setAboutClass("");
      setContactClass("active-nav-link");
    }
  };

  useEffect(() => {
    setHomeHeight(document.getElementById("home").offsetHeight);
    setProjectsHeight(document.getElementById("projects").offsetHeight);
    setAboutHeight(document.getElementById("about").offsetHeight);
  }, []);

  return (
    <nav>
      <img src={logo} alt="logo" className="navbar-logo" />
      <ul>
        <li>
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <a className={homeClass} href="#">
            Home
          </a>
        </li>
        <li>
          <a className={projectsClass} href="#projects">
            Projects
          </a>
        </li>
        <li>
          <a className={aboutClass} href="#about">
            About
          </a>
        </li>
        <li>
          <a className={contactClass} href="#contact">
            Contact
          </a>
        </li>
      </ul>
      <div className="navbar-buttons">
        <ThemeToggle />
        <a
          href="/Jon Mendizabal - Resume.pdf"
          target="_blank"
          className="resume-button"
        >
          <FontAwesomeIcon icon={faDownload} />
          Download CV
        </a>
      </div>
    </nav>
  );
}
