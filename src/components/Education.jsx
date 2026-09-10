import React from "react";
import { education } from "../data/journey";
import TimelineCard from "./TimelineCard";
import useTimelineHeat from "./useTimelineHeat";

export default function Education() {
  const wrapperRef = useTimelineHeat();

  return (
    <div className="about-item-wrapper" ref={wrapperRef}>
      <div className="timeline heat-timeline">
        {education.map((entry) => (
          <TimelineCard key={entry.id} entry={entry} />
        ))}
      </div>
    </div>
  );
}
