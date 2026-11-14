import React, { useEffect, useRef, useState } from "react";
import { reducedMotion, useDarkTheme } from "../components/hooks";
import stillDark from "../../../images/foundry/billet-dark.webp";
import stillLight from "../../../images/foundry/billet-light.webp";

// Where the live billet runs: room for it beside the text (the sticky
// layout starts at the same width in forge.css), motion allowed, no data
// saving asked for and a WebGL context to draw in. Everywhere else the still
// is the hero.
const LIVE_FROM = "(min-width: 900px)";

function canRunLive() {
  if (!window.matchMedia(LIVE_FROM).matches || reducedMotion()) return false;
  if (navigator.connection?.saveData) return false;
  try {
    const probe = document.createElement("canvas");
    return Boolean(probe.getContext("webgl2") || probe.getContext("webgl"));
  } catch {
    return false;
  }
}

/**
 * The billet: always the still first (it is the same picture as the live
 * scene's first frame, in a box of fixed size), then the canvas fades in
 * over it once three.js has drawn a frame. Nothing around it moves.
 */
export default function Billet({ target, readout }) {
  const dark = useDarkTheme();
  const canvas = useRef(null);
  const live = useRef(null);
  const [isLive, setLive] = useState(false);

  useEffect(() => {
    if (!canRunLive()) return undefined;
    let cancelled = false;
    import("./live").then(({ startForge }) => {
      if (cancelled || !canvas.current) return;
      live.current = startForge({
        canvas: canvas.current,
        target,
        dark: document.body.classList.contains("dark-theme"),
        onFirstFrame: () => setLive(true),
      });
    });
    return () => {
      cancelled = true;
      live.current?.stop();
      live.current = null;
    };
  }, [target]);

  useEffect(() => {
    live.current?.setDark(dark);
  }, [dark]);

  return (
    <figure className={`billet${isLive ? " is-live" : ""}`}>
      <img className="billet-still" src={dark ? stillDark : stillLight} width="960" height="960" alt="A glowing steel billet made of small blocks, sparks rising off it." />
      <canvas ref={canvas} className="billet-canvas" aria-hidden="true" />
      {readout}
    </figure>
  );
}
