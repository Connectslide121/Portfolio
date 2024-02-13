import React from "react";
import "../styles/home.css";
import home from "../images/home-image.png";

export default function Home() {
  return (
    <div id="home">
      <div className="home-text-wrapper">
        <h1>
          JON
          <br />
          MENDIZABAL
        </h1>
        <h2>FULL-STACK DEVELOPER</h2>
      </div>
      <img src={home} alt="man with on laptop" className="home-image" />
    </div>
  );
}
