/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import "../styles/navbar.css";
import logo from "../images/logo.webp";
import ThemeToggle from "./ThemeToggle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import resume from "../images/Jon Mendizabal - CV.pdf";

export default function Navbar() {
  const [scrollY, setScrollY] = useState(0);
  const [navbarHeight, setNavbarHeight] = useState(0);
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
    } else if (
      scrollY >
      homeHeight + projectsHeight + aboutHeight - window.innerHeight / 2.5
    ) {
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
    setNavbarHeight(document.querySelector("nav").offsetHeight);
  }, []);

  return (
    <nav>
      <img
        src={logo}
        alt="logo"
        className="navbar-logo"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      />

      <ul>
        <li>
          <a className={homeClass} href="#home">
            Home
          </a>
        </li>
        <li>
          <a className={aboutClass} href="#about">
            About
          </a>
        </li>
        <li>
          <a className={projectsClass} href="#projects">
            Projects
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
          href={resume}
          target="_blank"
          rel="noreferrer"
          className="resume-button"
        >
          <FontAwesomeIcon icon={faDownload} />
          <span>Download</span> CV
        </a>
      </div>
    </nav>
  );
}
