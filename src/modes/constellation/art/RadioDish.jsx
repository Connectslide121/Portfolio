import React from "react";

/** A radio dish on its mount, sending rings of signal up and to the right. */
export default function RadioDish() {
  return (
    <svg className="dish" viewBox="0 0 320 260" aria-hidden="true">
      {[0, 1, 2, 3].map((i) => (
        <path key={i} className="wave" style={{ "--i": i }} d="M200 60 a60 60 0 0 1 60 60" />
      ))}
      <g className="dish-body">
        <path d="M70 150 Q 110 40 220 70 L 170 160 Z" className="dish-face" />
        <line x1="145" y1="115" x2="205" y2="78" className="dish-feed" />
        <circle cx="205" cy="78" r="5" className="dish-tip" />
      </g>
      <path d="M150 150 L130 230 M150 150 L175 230 M110 230 H200" className="dish-mount" />
      <line x1="0" y1="232" x2="320" y2="232" className="dish-ground" />
    </svg>
  );
}
