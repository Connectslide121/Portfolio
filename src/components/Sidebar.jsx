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
      <ul>
        <li>
          <a
            href="https://www.linkedin.com/in/jon-mendizabal"
            target="_blank"
            rel="noreferrer"
            title="linkedin"
          >
            <p>
              <FontAwesomeIcon icon={faLinkedin} />
            </p>
          </a>
        </li>
        <li>
          <a
            href="https://github.com/Connectslide121"
            target="_blank"
            rel="noreferrer"
            title="github"
          >
            <p>
              <FontAwesomeIcon icon={faGithub} />
            </p>
          </a>
        </li>
        <li>
          <a
            href="https://www.npmjs.com/settings/jonmendi/packages"
            target="_blank"
            rel="noreferrer"
            title="npm"
          >
            <p>
              <FontAwesomeIcon icon={faNpm} />
            </p>
          </a>
        </li>
        <li>
          <a
            href="https://connect-slide-121.itch.io/"
            target="_blank"
            rel="noreferrer"
            title="itch.io"
          >
            <p>
              <FontAwesomeIcon icon={faItchIo} />
            </p>
          </a>
        </li>
      </ul>
    </aside>
  );
}
