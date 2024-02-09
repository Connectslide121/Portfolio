import React from "react";
import "../styles/home.css";
import home from "../images/home.png";
import controller from "../images/controller.png";

export default function Home() {
  return (
    <div id="home">
      <div className="home-card">
        <div className="home-image-wrapper">
          <img src={home} alt="UI" className="home-image" />
        </div>
        <img src={controller} alt="" className="controller" />
      </div>
      <h1>
        JON
        <br />
        MENDIZABAL
      </h1>
      <h2>FULL-STACK DEVELOPER</h2>
    </div>
  );
}
