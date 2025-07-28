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

  return (
    <>
      <nav>
        <a href="#home" className="navbar-brand" onClick={closeMobileMenu}>
          <img src={logo} alt="Jon Mendizabal Logo" className="navbar-logo" />
        </a>

        <ul className="nav-links">
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
            <a className={homeClass} href="#home" onClick={closeMobileMenu}>
              Home
            </a>
          </li>
          <li>
            <a className={aboutClass} href="#about" onClick={closeMobileMenu}>
              About
            </a>
          </li>
          <li>
            <a
              className={projectsClass}
              href="#projects"
              onClick={closeMobileMenu}
            >
              Projects
            </a>
          </li>
          <li>
            <a
              className={contactClass}
              href="#contact"
              onClick={closeMobileMenu}
            >
              Contact
            </a>
          </li>
        </ul>
      </div>
    </>
  );
}
