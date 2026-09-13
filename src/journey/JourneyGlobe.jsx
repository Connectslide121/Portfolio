import React, { useEffect, useRef } from "react";
import { BEATS } from "./config";
import { point, view, project, strand, graticule, arc, shortestLon } from "./globe";

/**
 * The globe behind the map.
 *
 * A secondary layer, deliberately: the places are the story and this is the
 * footnote that says where on earth they were. It spins so that whichever
 * beat you are on faces the viewer, and it is driven from the CONTINUOUS
 * camera position rather than from the beat index — so it turns with the
 * travel instead of snapping when the travel ends, and it scrubs backwards
 * for free.
 *
 * WHY NOT THREE.JS. A globe is the one thing in the journey with a genuine
 * claim on 3D, and it is also the one that least needs a 3D engine: it is a
 * single object with no model, no texture and no lighting, and an
 * orthographic projection of a sphere is four lines of trigonometry (see
 * globe.js). Drawn as SVG it also inherits --j-accent and --j-stream, so it
 * rides the same molten -> cold ramp as everything else without being told
 * about it. A WebGL globe would have cost more than the entire existing
 * journey bundle and would have had to be recoloured by hand.
 *
 * The updater is hung on the root node as __setGlobePosition, matching how
 * Particles publishes __setParticleActive — the render loop should not have
 * to know any of the maths above.
 */

const R = 196;

// Degrees south of the current place to view from. sin(36 degrees) is about
// 0.59, so the place lands ~0.59R above the centre of the disc.
const LIFT = 36;

// Where the camera looks for each beat. The recap is not a place, so it holds
// the last one rather than swinging to null; the landing beat borrows today's
// location so the globe opens pointed somewhere real.
const VIEWPOINTS = (() => {
  const out = BEATS.map((b) => b.coords || null);
  for (let i = 0; i < out.length; i++) {
    if (!out[i]) out[i] = out[i - 1] || { lat: 0, lon: 0 };
  }
  return out;
})();

// The dots. Keyed by coordinate so the four Swedish beats are ONE place that
// lights up when you first arrive there, not four stacked on the same pixel.
// The landing beat is excluded: it borrows Växjö's coordinates for the view,
// and letting that light Sweden before the story has left Spain would tell
// the wrong story on the way past.
const PLACES = (() => {
  const seen = new Map();
  BEATS.forEach((b, i) => {
    if (!b.coords || i === 0) return;
    const key = `${b.coords.lat},${b.coords.lon}`;
    if (!seen.has(key)) {
      seen.set(key, { at: i, pt: point(b.coords.lat, b.coords.lon), place: b.place });
    }
  });
  return [...seen.values()];
})();

// The route, as one list of samples each carrying the beat position it sits
// at, so the arc can be drawn progressively straight from the camera. Legs
// between beats that share a location produce no samples at all (see arc()).
// Two parallel arrays rather than one array of pairs: the points go to
// strand() as-is, and the positions are only ever scanned.
const [ROUTE_PTS, ROUTE_T] = (() => {
  const pts = [];
  const ts = [];
  for (let k = 0; k < PLACES.length - 1; k++) {
    const a = PLACES[k];
    const b = PLACES[k + 1];
    const seg = arc(a.pt, b.pt);
    seg.forEach((pt, s) => {
      pts.push(pt);
      ts.push(a.at + ((b.at - a.at) * s) / (seg.length - 1));
    });
  }
  return [pts, ts];
})();

const LINES = graticule();
const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);

export default function JourneyGlobe() {
  const rootRef = useRef(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const lineEls = el.querySelectorAll("[data-gl-line]");
    const routeEl = el.querySelector("[data-gl-route]");
    const dotEls = el.querySelectorAll("[data-gl-dot]");
    const haloEls = el.querySelectorAll("[data-gl-halo]");
    let last = null;

    el.__setGlobePosition = (p) => {
      // The render loop also runs on pointer lean, which does not move the
      // camera along the beats at all, so a position that has not changed
      // must cost nothing at all here.
      //
      // Only that. An earlier version raised this threshold to land the globe
      // on every other frame, on the theory that a slowly turning decoration
      // does not need 60fps. It measured WORSE: the work is repaint, not
      // maths (the update itself is ~0.2ms), so skipping frames did not
      // remove the cost, it just doubled it on the frames that did run and
      // turned a smooth load into visible hitching. The fix was `contain:
      // paint` on the element instead — see .j-globe in journey.css.
      if (last !== null && Math.abs(p - last) < 5e-4) return;
      last = p;

      const i0 = Math.max(0, Math.min(BEATS.length - 1, Math.floor(p)));
      const i1 = Math.max(0, Math.min(BEATS.length - 1, i0 + 1));
      const f = p - i0;
      const a = VIEWPOINTS[i0];
      const b = VIEWPOINTS[i1];

      // Shortest way round, so Spain -> India never spins the long way past
      // the Pacific.
      const lon0 = a.lon + (shortestLon(a.lon, b.lon) - a.lon) * f;
      // LIFTED, not centred. Looking straight at the beat's own latitude puts
      // it at the middle of the disc, which is exactly the part of the globe
      // the map sits on top of — the one place on screen where the dot cannot
      // be seen. Viewing from LIFT degrees south of it instead puts the
      // current place at about 0.6R up the disc, in the cap that shows.
      const lat = a.lat + (b.lat - a.lat) * f;
      const lat0 = Math.max(-32, Math.min(42, lat - LIFT));
      const v = view(lat0, lon0);

      lineEls.forEach((line, i) => line.setAttribute("d", strand(LINES[i], v, R)));

      if (routeEl) {
        // Ordered by position, so the travelled part is a prefix — a scan
        // for its length beats allocating two arrays a frame to find it.
        let n = 0;
        while (n < ROUTE_T.length && ROUTE_T[n] <= p) n++;
        routeEl.setAttribute("d", n > 1 ? strand(ROUTE_PTS, v, R, n) : "");
      }

      dotEls.forEach((dot, i) => {
        const place = PLACES[i];
        const q = project(place.pt, v, R);
        if (!q) {
          dot.setAttribute("opacity", "0");
          return;
        }
        const lit = clamp01(p - (place.at - 0.8));
        // z fades a dot as it approaches the limb, so places do not wink out
        // at full brightness when they go round the back.
        const edge = Math.min(1, q.z * 2.2);
        dot.setAttribute("cx", q.x.toFixed(1));
        dot.setAttribute("cy", q.y.toFixed(1));
        dot.setAttribute("r", (2 + lit * 3.4).toFixed(2));
        dot.setAttribute("opacity", (edge * (0.22 + lit * 0.78)).toFixed(3));

        const halo = haloEls[i];
        if (halo) {
          halo.setAttribute("cx", q.x.toFixed(1));
          halo.setAttribute("cy", q.y.toFixed(1));
          halo.setAttribute("r", (7 + lit * 13).toFixed(2));
          halo.setAttribute("opacity", (edge * lit * 0.28).toFixed(3));
        }
      });
    };

    return () => {
      delete el.__setGlobePosition;
    };
  }, []);

  return (
    <svg
      className="j-globe"
      ref={rootRef}
      viewBox={`${-R - 18} ${-R - 18} ${(R + 18) * 2} ${(R + 18) * 2}`}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="jGlobeFace" cx="38%" cy="30%" r="78%">
          <stop offset="0%" stopColor="var(--j-mid)" stopOpacity="0.85" />
          <stop offset="100%" stopColor="var(--j-ground)" stopOpacity="0.95" />
        </radialGradient>
      </defs>

      {/* the body, then the limb that gives it an edge to end on */}
      <circle r={R} fill="url(#jGlobeFace)" />
      <circle
        r={R}
        fill="none"
        stroke="var(--j-accent)"
        strokeWidth="1.6"
        opacity="0.5"
      />

      <g
        fill="none"
        stroke="var(--j-stream)"
        strokeWidth="1"
        opacity="0.3"
        strokeLinecap="round"
      >
        {LINES.map((_, i) => (
          <path key={i} data-gl-line="" />
        ))}
      </g>

      {/* the road, drawn on as it is travelled */}
      <path
        data-gl-route=""
        fill="none"
        stroke="var(--j-accent)"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.9"
      />

      {/* Halo then dot, as two flat circles rather than one filtered one: a
          blur filter per place would be the only filter on this element and
          the most expensive thing in it, for a glow two circles describe. */}
      <g fill="var(--j-accent)">
        {PLACES.map((place) => (
          <circle key={`h${place.at}`} data-gl-halo="" r="7" opacity="0" />
        ))}
        {PLACES.map((place) => (
          <circle key={place.at} data-gl-dot="" r="2" opacity="0" />
        ))}
      </g>
    </svg>
  );
}
