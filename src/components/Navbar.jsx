import React from "react";
import "../styles/navbar.css";
import logo from "../images/logo.png";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  return (
    <nav>
      <img src={logo} alt="logo" className="navbar-logo" />
      <ul>
        <li>
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <a href="#">Home</a>
        </li>
        <li>
          <a href="#projects">Projects</a>
        </li>
        <li>
          <a href="#about">About</a>
        </li>
        <li>
          <a href="#contact">Contact</a>
        </li>
      </ul>
      <div className="navbar-buttons">
        <ThemeToggle />
        <a
          href="/Jon Mendizabal - Resume.pdf"
          target="_blank"
          className="resume-button"
        >
          Download CV
        </a>
      </div>
    </nav>
  );
}
