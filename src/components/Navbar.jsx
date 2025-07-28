/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import "../styles/navbar.css";
import logo from "../images/logo.webp";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const [scrollY, setScrollY] = useState(0);
  const [homeHeight, setHomeHeight] = useState(0);
  const [projectsHeight, setProjectsHeight] = useState(0);
  const [aboutHeight, setAboutHeight] = useState(0);
  const [homeClass, setHomeClass] = useState("active-nav-link");
  const [projectsClass, setProjectsClass] = useState("");
  const [aboutClass, setAboutClass] = useState("");
  const [contactClass, setContactClass] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const NAVBAR_HEIGHT = 80; // Fixed navbar height

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const elementPosition = element.offsetTop;
      const offsetPosition =
        sectionId === "home" ? 0 : elementPosition - NAVBAR_HEIGHT;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  window.onscroll = () => {
    setScrollY(window.scrollY);

    if (scrollY < homeHeight - window.innerHeight / 2.5) {
      setHomeClass("active-nav-link");
      setAboutClass("");
      setProjectsClass("");
      setContactClass("");
    } else if (scrollY < homeHeight + aboutHeight - window.innerHeight / 2.5) {
      setHomeClass("");
      setAboutClass("active-nav-link");
      setProjectsClass("");
      setContactClass("");
    } else if (
      scrollY <
      homeHeight + aboutHeight + projectsHeight - window.innerHeight / 2.5
    ) {
      setHomeClass("");
      setAboutClass("");
      setProjectsClass("active-nav-link");
      setContactClass("");
    } else if (
      scrollY >
      homeHeight + projectsHeight + aboutHeight - window.innerHeight / 2.5
    ) {
      setHomeClass("");
      setAboutClass("");
      setProjectsClass("");
      setContactClass("active-nav-link");
    }
  };

  useEffect(() => {
    setHomeHeight(document.getElementById("home").offsetHeight);
    setProjectsHeight(document.getElementById("projects").offsetHeight);
    setAboutHeight(document.getElementById("about").offsetHeight);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const handleNavClick = (sectionId) => {
    scrollToSection(sectionId);
    closeMobileMenu();
  };

  return (
    <>
      <nav>
        <button
          className="navbar-brand"
          onClick={() => handleNavClick("home")}
          style={{ background: "none", border: "none", cursor: "pointer" }}
        >
          <img src={logo} alt="Jon Mendizabal Logo" className="navbar-logo" />
        </button>

        <ul className="nav-links">
          <li>
            <button
              className={`nav-link-btn ${homeClass}`}
              onClick={() => handleNavClick("home")}
            >
              Home
            </button>
          </li>
          <li>
            <button
              className={`nav-link-btn ${aboutClass}`}
              onClick={() => handleNavClick("about")}
            >
              About
            </button>
          </li>
          <li>
            <button
              className={`nav-link-btn ${projectsClass}`}
              onClick={() => handleNavClick("projects")}
            >
              Projects
            </button>
          </li>
          <li>
            <button
              className={`nav-link-btn ${contactClass}`}
              onClick={() => handleNavClick("contact")}
            >
              Contact
            </button>
          </li>
        </ul>

        <div className="nav-controls">
          <ThemeToggle />
          <div className="mobile-menu-toggle" onClick={toggleMobileMenu}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className={`mobile-nav ${mobileMenuOpen ? "open" : ""}`}>
        <ul className="mobile-nav-links">
          <li>
            <button
              className={`nav-link-btn ${homeClass}`}
              onClick={() => handleNavClick("home")}
            >
              Home
            </button>
          </li>
          <li>
            <button
              className={`nav-link-btn ${aboutClass}`}
              onClick={() => handleNavClick("about")}
            >
              About
            </button>
          </li>
          <li>
            <button
              className={`nav-link-btn ${projectsClass}`}
              onClick={() => handleNavClick("projects")}
            >
              Projects
            </button>
          </li>
          <li>
            <button
              className={`nav-link-btn ${contactClass}`}
              onClick={() => handleNavClick("contact")}
            >
              Contact
            </button>
          </li>
        </ul>
      </div>
    </>
  );
}
