import React from "react";
import SectionFlag from "../components/SectionFlag";
import Crossword from "../art/Crossword";

export default function Puzzle() {
  return (
    <section id="puzzle" className="page puzzle">
      <SectionFlag id="puzzle" title="The Chronicle Crossword" aside="Every answer is on the CV" />
      <Crossword />
    </section>
  );
}
