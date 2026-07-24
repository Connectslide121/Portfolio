import React, { useState } from "react";
import "../styles/about.css";
import Tools from "../components/Tools";
import Education from "../components/Education";
import Experience from "../components/Experience";

export default function About() {
  const [activeTab, setActiveTab] = useState("experience");

  return (
    <section id="about">
      <Tools />
      <div className="about-info-wrapper">
        <div
          className="about-tabs"
          role="tablist"
          aria-label="Experience and education"
        >
          <button
            type="button"
            role="tab"
            id="tab-experience"
            aria-selected={activeTab === "experience"}
            aria-controls="panel-experience"
            className={`about-tab ${activeTab === "experience" ? "active" : ""}`}
            onClick={() => setActiveTab("experience")}
          >
            Experience
          </button>
          <button
            type="button"
            role="tab"
            id="tab-education"
            aria-selected={activeTab === "education"}
            aria-controls="panel-education"
            className={`about-tab ${activeTab === "education" ? "active" : ""}`}
            onClick={() => setActiveTab("education")}
          >
            Education
          </button>
        </div>
        <div className="about-tab-panels">
          {activeTab === "experience" ? (
            <div
              role="tabpanel"
              id="panel-experience"
              aria-labelledby="tab-experience"
            >
              <Experience />
            </div>
          ) : (
            <div
              role="tabpanel"
              id="panel-education"
              aria-labelledby="tab-education"
            >
              <Education />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
