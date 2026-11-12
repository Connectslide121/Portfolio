import React from "react";
import Postcard from "../art/Postcard";
import { heatTone, smoothPath } from "../art/terrain";
import SectionHead from "../components/SectionHead";
import { blurbRest } from "../components/copy";
import { beats, chapters } from "../../../data/journey";

// How high each stop sits on the trail. Not a measurement: the shape of the
// thing. A climb, a summit abroad, the drop of starting over, a higher climb.
const HEIGHT = { origin: 0.3, foundry: 0.62, india: 0.82, sweden: 0.22, sprinta: 0.58, architect: 0.95 };

const VW = 1200;
const VH = 200; // the chart is 200px tall on screen too, so 1 unit = 1px upwards
const stops = beats.filter((b) => HEIGHT[b.id] != null);
const lift = (b) => 26 + HEIGHT[b.id] * 150;
const points = stops.map((b, i) => [((i + 0.5) / stops.length) * VW, VH - lift(b)]);
const trail = smoothPath([[0, VH - 34], ...points, [VW, points[points.length - 1][1] - 8]]);

export default function Story() {
  return (
    <section id="story" className="section story">
      <div className="wrap">
        <SectionHead
          num="01"
          label="The route"
          title={
            <>
              Steel, a reset, then <em>software</em>.
            </>
          }
        >
          <p>{blurbRest}</p>
        </SectionHead>

        <ol className="chapters">
          {chapters.map((c, i) => (
            <li key={c.id} className="chapter" data-reveal style={{ "--tone": heatTone(c.heat), "--i": i }}>
              <Postcard id={c.id} />
              <p className="chapter-span">
                <span>Chapter {i + 1}</span>
                <span>{c.span}</span>
              </p>
              <h3>{c.title}</h3>
              <p className="chapter-detail">{c.detail}</p>
            </li>
          ))}
        </ol>

        <div className="route" data-reveal>
          <div className="route-head">
            <h3>The trail so far</h3>
            <p>Six stops. Each one opens its entry below.</p>
          </div>
          <svg className="route-chart" viewBox={`0 0 ${VW} ${VH}`} preserveAspectRatio="none" aria-hidden="true">
            <defs>
              <linearGradient id="mendi-trail" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" className="trail-warm" />
                <stop offset="0.5" className="trail-hot" />
                <stop offset="0.62" className="trail-mid" />
                <stop offset="1" className="trail-cold" />
              </linearGradient>
              <linearGradient id="mendi-trail-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopOpacity="0.2" />
                <stop offset="1" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path className="route-area" d={`${trail}L${VW},${VH}L0,${VH}Z`} />
            <path className="route-line" d={trail} />
          </svg>
          <ol className="route-stops">
            {stops.map((b, n) => (
              <li key={b.id} style={{ "--tone": heatTone(b.heat), "--lift": `${lift(b)}px`, "--n": n }}>
                <a href={`#${b.entryIds[0]}`}>
                  <i className="route-dot" aria-hidden="true" />
                  <span className="route-year">{b.railLabel}</span>
                  <span className="route-tag">{b.tag}</span>
                  <span className="route-place">{b.place}</span>
                </a>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
