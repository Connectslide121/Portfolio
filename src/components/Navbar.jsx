import React from "react";
import "../styles/navbar.css";

export default function Navbar() {
  return (
    <nav>
      <img src="" alt="logo" />
      <ul className="navbar-section-links">
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
    </nav>
  );
}
