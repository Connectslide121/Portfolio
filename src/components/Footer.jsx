import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

export default function Footer() {
  return (
    <div className="footer">
      <h4>
        2024 - Made with <FontAwesomeIcon icon={faHeart} /> by Jon Mendizabal
      </h4>
    </div>
  );
}
