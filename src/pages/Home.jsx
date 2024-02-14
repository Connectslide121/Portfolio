import React from "react";
import "../styles/home.css";
import home from "../images/home-image.webp";

export default function Home() {
  return (
    <section id="home">
      <div className="home-text-wrapper">
        <h1>
          JON
          <br />
          MENDIZABAL
        </h1>
        <h2>FULL-STACK DEVELOPER</h2>
      </div>
      <img src={home} alt="programmer at desk" className="home-image" />
    </section>
  );
}
