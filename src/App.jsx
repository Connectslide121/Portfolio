import React, { useCallback, useEffect, useMemo, useState } from "react";
import Desktop from "./os/Desktop";
import Window from "./os/Window";
import Taskbar from "./os/Taskbar";
import StartMenu from "./os/StartMenu";
import Boot from "./os/Boot";
import ShutDown from "./os/ShutDown";
import Screensaver from "./os/Screensaver";
import useWindows from "./os/useWindows";
import { APPS } from "./os/apps";

const BOOTED = "jonos-booted";
const IDLE_MS = 90000;

const media = (q) => window.matchMedia(q).matches;
const reducedMotion = () => media("(prefers-reduced-motion: reduce)");

const alreadyBooted = () => {
  try {
    return window.sessionStorage.getItem(BOOTED) === "1";
  } catch {
    return false;
  }
};

/** The program a #hash link asks for, if any (e.g. #projects, #contact). */
const fromHash = () => {
  const id = window.location.hash.slice(1);
  return APPS[id] && id !== "viewer" ? id : null;
};

export default function App() {
  const wm = useWindows();
  const [phase, setPhase] = useState(() => (alreadyBooted() || reducedMotion() ? "desktop" : "boot"));
  const [startOpen, setStartOpen] = useState(false);
  const [saver, setSaver] = useState(false);
  const [dark, setDark] = useState(() => document.body.classList.contains("dark-theme"));
  const [compact, setCompact] = useState(() => media("(max-width: 720px)"));
  const touch = useMemo(() => media("(hover: none)"), []);

  const launch = useCallback(
    (id, extra = {}) => {
      const app = APPS[id];
      wm.open(extra.id || id, id, { w: app.w, h: app.h, ...extra });
      setStartOpen(false);
    },
    [wm],
  );

  const openProject = useCallback(
    (project) => launch("viewer", { id: `project:${project.title}`, props: { project } }),
    [launch],
  );

  const os = useMemo(() => ({ launch, openProject, touch }), [launch, openProject, touch]);

  // The desktop starts with About_Me.txt open — or whatever a #link asked for.
  const startDesktop = useCallback(() => {
    try {
      window.sessionStorage.setItem(BOOTED, "1");
    } catch {
      /* boots again next time, that is all */
    }
    setPhase("desktop");
    launch("about");
    const asked = fromHash();
    if (asked && asked !== "about") launch(asked);
  }, [launch]);

  useEffect(() => {
    if (phase === "desktop" && wm.windows.length === 0) startDesktop();
    // Only on the first arrival at the desktop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 720px)");
    const on = () => setCompact(mq.matches);
    mq.addEventListener?.("change", on);
    return () => mq.removeEventListener?.("change", on);
  }, []);

  // A #link pasted while the page is open opens that program too.
  useEffect(() => {
    const onHash = () => {
      const id = fromHash();
      if (id) launch(id);
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [launch]);

  // Screensaver after a while with no input.
  useEffect(() => {
    if (phase !== "desktop" || saver || reducedMotion()) return;
    let timer = window.setTimeout(() => setSaver(true), IDLE_MS);
    const reset = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setSaver(true), IDLE_MS);
    };
    const events = ["pointermove", "pointerdown", "keydown", "wheel", "touchstart"];
    events.forEach((e) => window.addEventListener(e, reset, { passive: true }));
    return () => {
      window.clearTimeout(timer);
      events.forEach((e) => window.removeEventListener(e, reset));
    };
  }, [phase, saver]);

  const toggleTheme = useCallback(() => {
    const next = !document.body.classList.contains("dark-theme");
    document.body.classList.toggle("dark-theme", next);
    try {
      window.localStorage.setItem("jm-theme", next ? "dark" : "light");
    } catch {
      /* the preference just will not persist */
    }
    setDark(next);
  }, []);

  const shutDown = useCallback(() => {
    wm.closeAll();
    setPhase("off");
  }, [wm]);

  const restart = useCallback(() => setPhase("boot"), []);
  const closeStart = useCallback(() => setStartOpen(false), []);
  const exitSaver = useCallback(() => setSaver(false), []);

  if (phase === "boot") return <Boot onDone={startDesktop} />;
  if (phase === "off") return <ShutDown onRestart={restart} />;

  return (
    <div className={`os${compact ? " is-compact" : ""}`}>
      <Desktop os={os}>
        {wm.windows.map((w) => {
          const app = APPS[w.app];
          const { Component } = app;
          const project = w.props?.project;
          return (
            <Window
              key={w.id}
              win={w}
              wm={wm}
              title={project ? `${project.title} - ${app.title}` : app.title}
              icon={app.icon}
              menu={app.menu}
              focused={w.id === wm.focusedId}
              compact={compact}
            >
              <Component os={os} onClose={() => wm.close(w.id)} {...w.props} />
            </Window>
          );
        })}
      </Desktop>

      {startOpen && (
        <StartMenu
          os={os}
          dark={dark}
          onClose={closeStart}
          onTheme={toggleTheme}
          onScreensaver={() => setSaver(true)}
          onShutDown={shutDown}
        />
      )}

      <Taskbar wm={wm} startOpen={startOpen} onStart={() => setStartOpen((o) => !o)} dark={dark} onTheme={toggleTheme} />

      {saver && <Screensaver onExit={exitSaver} />}
    </div>
  );
}
