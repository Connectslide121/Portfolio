import React from "react";

export default function SocialIcon({ link }) {
  return (
    <svg className="social-icon" viewBox={link.viewBox} aria-hidden="true">
      <path d={link.path} />
    </svg>
  );
}
