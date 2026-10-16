import React, { useEffect, useRef } from "react";
import "../styles/art.css";

/**
 * The drafting table's readout: faint crosshairs that follow the pointer and
 * its coordinates on the sheet, in millimetres from the top-left corner of
 * the page (at 96 dpi), with the zone it is in. Mouse only.
 */
const PX_PER_MM = 96 / 25.4;
const ZONES = "ABCDEFGHJK";

export default function CursorHUD() {
  const hudRef = useRef(null);
  const hRef = useRef(null);
  const vRef = useRef(null);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const hud = hudRef.current;
    let frame = 0;
    let last = null;

    const draw = () => {
      frame = 0;
      if (!last) return;
      const { clientX, clientY } = last;
      const pageY = clientY + window.scrollY;
      hRef.current.style.transform = `translateY(${clientY}px)`;
      vRef.current.style.transform = `translateX(${clientX}px)`;
      const col = Math.min(8, Math.floor((clientX / window.innerWidth) * 8) + 1);
      const row = ZONES[Math.min(ZONES.length - 1, Math.floor((clientY / window.innerHeight) * 4))];
      hud.querySelector("[data-x]").textContent = (clientX / PX_PER_MM).toFixed(1).padStart(6, "0");
      hud.querySelector("[data-y]").textContent = (pageY / PX_PER_MM).toFixed(1).padStart(6, "0");
      hud.querySelector("[data-z]").textContent = `${row}${col}`;
    };

    const onMove = (e) => {
      last = e;
      hud.classList.add("is-on");
      if (!frame) frame = requestAnimationFrame(draw);
    };
    const onLeave = () => hud.classList.remove("is-on");

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div className="hud" ref={hudRef} aria-hidden="true">
      <span className="hud-line hud-h" ref={hRef} />
      <span className="hud-line hud-v" ref={vRef} />
      <p className="hud-read">
        X <b data-x>0000.0</b> Y <b data-y>0000.0</b> MM · ZONE <b data-z>A1</b>
      </p>
    </div>
  );
}
