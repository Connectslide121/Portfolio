import React from "react";
import "../styles/navbar.css";
import logo from "../images/logo.png";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  return (
    <div className="navbar-wrapper">
      <nav>
        <img src={logo} alt="logo" className="navbar-logo" />
        <ul>
          <li>
            <a href="#home">Home</a>
          </li>
          <li>
            <a href="#about">About</a>
          </li>
          <li>
            <a href="#projects">Projects</a>
          </li>
          <li>
            <a href="#contact">Contact</a>
          </li>
        </ul>
        <div className="navbar-buttons">
          <ThemeToggle />
          <a href="/Jon Mendizabal - Resume.pdf" download>
            Resume
          </a>
        </div>
      </nav>
    </div>
  );
}
