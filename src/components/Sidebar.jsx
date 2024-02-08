import React from "react";
import "../styles/sidebar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLinkedin,
  faGithub,
  faNpm,
  faItchIo
} from "@fortawesome/free-brands-svg-icons";

export default function Sidebar() {
  return (
    <aside>
      <ul className="sidebar-social-media-links">
        <li>
          <a
            href="https://www.linkedin.com/in/jon-mendizabal"
            target="_blank"
            rel="noreferrer"
            title="linkedin"
          >
            <FontAwesomeIcon icon={faLinkedin} />
          </a>
        </li>
        <li>
          <a
            href="https://github.com/Connectslide121"
            target="_blank"
            rel="noreferrer"
            title="github"
          >
            <FontAwesomeIcon icon={faGithub} />
          </a>
        </li>
        <li>
          <a
            href="https://www.npmjs.com/settings/jonmendi/packages"
            target="_blank"
            rel="noreferrer"
            title="npm"
          >
            <FontAwesomeIcon icon={faNpm} />
          </a>
        </li>
        <li>
          <a
            href="https://connect-slide-121.itch.io/"
            target="_blank"
            rel="noreferrer"
            title="itch.io"
          >
            <FontAwesomeIcon icon={faItchIo} />
          </a>
        </li>
      </ul>
    </aside>
  );
}
