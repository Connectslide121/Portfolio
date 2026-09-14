import React, { useEffect, useRef } from "react";
import { BEATS } from "./config";
import {
  point,
  view,
  project,
  strand,
  strandAll,
  runs,
  graticule,
  arc,
  shortestLon,
} from "./globe";
import { LAND } from "./landData";

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

/**
 * Only the fallback pace, for when there is no pour to read a phase from.
 * The real cycle is whatever --pour-cycle says in journey.css; this never has
 * to match it, because when the pour exists its own clock is the one used.
 */
const PREVIEW_CYCLE = 11000;

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
const COASTS = runs(LAND);
const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);

export default function JourneyGlobe({ preview = false }) {
  const rootRef = useRef(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const lineEls = el.querySelectorAll("[data-gl-line]");
    const landEl = el.querySelector("[data-gl-land]");
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
      // Every coastline in one attribute write.
      if (landEl) landEl.setAttribute("d", strandAll(COASTS, v, R));

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

  /**
   * The landing beat turning the world, once per pour.
   *
   * The opening image pours steel through Spain and India into a mould in
   * Sweden (D70); this walks the globe through the same three places on the
   * same clock, so the two are telling one story rather than two.
   *
   * It LOOPS with the pour. The first version ran one sweep and parked, to
   * keep a permanent rAF off the default landing beat (D54) — but the pour
   * behind it keeps going, so from the second cycle on the globe sat still
   * while the metal ran, which reads as broken rather than as thrifty. The
   * loop only lives while the intro is the beat on screen, and rAF does not
   * fire for a hidden tab, so the cost is bounded by someone actually looking
   * at it.
   *
   * The wrap is seamless because beat 0 and beat 5 are the same coordinates:
   * the landing beat borrows today's, so ending a cycle over Sweden and
   * starting the next one there is the same view.
   */
  useEffect(() => {
    if (!preview) return;
    const el = rootRef.current;
    if (!el?.__setGlobePosition) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const t0 = performance.now();

    /**
     * The pour's own clock, read straight off its CSS animation.
     *
     * Keeping a second timer here and trusting the two to stay together was
     * the bug: they start at different moments (the animation when the SVG
     * first paints, this when the effect runs) and they restart at different
     * moments too — leave the landing beat and come back and the timer starts
     * over while the animation, which never stopped, is wherever it is. There
     * is no drift to fix if there is only one clock, so this reads the phase
     * of the pipe-fill animation rather than counting alongside it.
     *
     * Returns null when there is nothing to read: the art is display:none
     * below 900px, where a display:none element's animations do not progress.
     */
    const pourPhase = () => {
      const charge = document.querySelector(".j-pour-charge");
      const anim = charge?.getAnimations?.()[0];
      const time = anim?.currentTime;
      if (time == null) return null;
      const span = anim.effect?.getComputedTiming?.().duration;
      if (!span) return null;
      return (((time % span) + span) % span) / span;
    };

    // Waypoints as [fraction of the pour's cycle, beat position], matching
    // the keyframe percentages in .j-pour: the head of the pour reaches Spain
    // at 26%, India at 38%, and the mould is full at 80%.
    const LEGS = [
      [0.1, 0],
      [0.26, 2],
      [0.38, 3],
      [0.8, 5],
    ];

    const tick = (now) => {
      // The pour's phase if it is running, and only otherwise a clock of our
      // own — which is the narrow-screen case, where the art is not rendered
      // at all and there is nothing to be in sync with.
      const t = pourPhase() ?? (((now - t0) / PREVIEW_CYCLE) % 1);
      const [lastAt, lastP] = LEGS[LEGS.length - 1];
      if (t >= lastAt) {
        // Arrived, and holding over Sweden until the ladle tips again —
        // the same beat the pour's stations hold their light for.
        el.__setGlobePosition(lastP);
        raf = requestAnimationFrame(tick);
        return;
      }
      let p = 0;
      for (let i = 0; i < LEGS.length - 1; i++) {
        const [t0f, p0] = LEGS[i];
        const [t1f, p1] = LEGS[i + 1];
        if (t >= t0f && t < t1f) {
          const f = (t - t0f) / (t1f - t0f);
          // Eased, so each leg arrives rather than stops dead.
          p = p0 + (p1 - p0) * (f < 0.5 ? 2 * f * f : 1 - (-2 * f + 2) ** 2 / 2);
          break;
        }
      }
      el.__setGlobePosition(p);
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [preview]);

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
      <circle className="j-globe-face" r={R} fill="url(#jGlobeFace)" />
      <circle
        className="j-globe-limb"
        r={R}
        fill="none"
        stroke="var(--j-accent)"
        strokeWidth="1.6"
        opacity="0.5"
      />

      <g
        className="j-globe-grid"
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

      {/* Coastlines. STROKED, never filled: a ring crossing the horizon has
          to be closed along the LIMB to fill correctly, which is the fiddly
          half of a spherical clip, and closing it across the chord instead
          cuts a visible straight edge through the disc.

          One thin pass, not two. A wide soft underlay was tried underneath
          this to suggest the mass of the land, and it turned out to be the
          entire frame cost of the globe — a 5-unit stroke over ~870 points
          roughly doubled the dropped frames in a transition, while the same
          path at 1.25 units is within noise of drawing no land at all. The
          shapes are legible from the coast alone. */}
      <g
        className="j-globe-land"
        fill="none"
        stroke="var(--j-stream)"
        strokeWidth="1.25"
        strokeLinecap="round"
        opacity="0.8"
      >
        <path data-gl-land="" />
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
