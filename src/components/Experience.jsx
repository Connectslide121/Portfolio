import React from "react";
import { experience } from "../data/journey";
import TimelineCard from "./TimelineCard";
import useTimelineHeat from "./useTimelineHeat";

export default function Experience() {
  const wrapperRef = useTimelineHeat();

  return (
    <div className="about-item-wrapper" ref={wrapperRef}>
      <div className="timeline heat-timeline">
        {experience.map((entry, i) => (
          <TimelineCard key={entry.id} entry={entry} current={i === 0} />
        ))}
      </div>
    </div>
  );
}
