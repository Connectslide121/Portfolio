/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import "../styles/navbar.css";
import logo from "../images/logo.webp";
import ThemeToggle from "./ThemeToggle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";

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
          <a
            className={homeClass}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            Home
          </a>
        </li>
        <li>
          <a
            className={projectsClass}
            onClick={() =>
              window.scrollTo({
                top: navbarHeight + homeHeight,
                behavior: "smooth"
              })
            }
          >
            Projects
          </a>
        </li>
        <li>
          <a
            className={aboutClass}
            onClick={() =>
              window.scrollTo({
                top: navbarHeight + homeHeight + projectsHeight,
                behavior: "smooth"
              })
            }
          >
            About
          </a>
        </li>
        <li>
          <a
            className={contactClass}
            onClick={() =>
              window.scrollTo({
                top: navbarHeight + homeHeight + projectsHeight + aboutHeight,
                behavior: "smooth"
              })
            }
          >
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
