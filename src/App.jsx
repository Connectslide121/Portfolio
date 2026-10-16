import React, { useCallback, useEffect, useRef, useState } from "react";
import World from "./game/World";
import useProgress from "./game/progress";
import { BUILDINGS, SIGNS, approachOf, region } from "./game/map";
import { entryScript, indiaScript, chapterScript, signScript, startScript, sprintaScript, HINTS } from "./game/content";
import Hud from "./ui/Hud";
import Pad from "./ui/Pad";
import Dialogue from "./ui/Dialogue";
import QuestLog from "./ui/QuestLog";
import Bag from "./ui/Bag";
import Arcade from "./ui/Arcade";
import PostOffice from "./ui/PostOffice";
import MapMenu from "./ui/MapMenu";
import Trophies from "./ui/Trophies";
import Toasts from "./ui/Toasts";
import CV from "./ui/CV";

const PLACE = { spain: "Basque Country, Spain", river: "The river", india: "Coimbatore, India", sea: "The sea", sweden: "Växjö, Sweden" };
const SCHOOLS = ["uni", "lea", "lexicon"];

export default function App() {
  const world = useRef(null);
  const progress = useProgress();
  const { visit, unlock } = progress;
  const [view, setView] = useState(() => (window.location.hash === "#cv" ? "cv" : "game"));
  const [dialogue, setDialogue] = useState(null);
  const [panel, setPanel] = useState(null);
  const [place, setPlace] = useState(PLACE.spain);
  const [dark, setDark] = useState(() => document.body.classList.contains("dark-theme"));
  const [, setSigns] = useState(() => new Set());

  // A first-time player is greeted by the signpost at the start.
  useEffect(() => {
    if (view !== "game" || progress.visited.length) return;
    const id = window.setTimeout(() => setDialogue((d) => d || startScript()), 700);
    return () => window.clearTimeout(id);
    // Only on arrival.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // A HUD button clicked with the mouse lets go of focus, so the next Space
  // or Enter talks instead of pressing the button again once its menu
  // closes. Keyboard presses (detail 0) keep focus where the player put it.
  useEffect(() => {
    const onClick = (e) => {
      const button = e.target.closest?.(".hud button");
      if (button && e.detail > 0) button.blur();
    };
    // Capture: before React opens the menu and the menu notes who had focus.
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  // Achievements that follow from what has been visited.
  useEffect(() => {
    const v = progress.visited;
    if (SCHOOLS.every((s) => v.includes(s))) unlock("scholar");
    if (BUILDINGS.every((b) => v.includes(b.id))) unlock("completionist");
  }, [progress.visited, unlock]);

  useEffect(() => {
    if (dark && view === "game") unlock("night-owl");
  }, [dark, view, unlock]);

  const open = useCallback(
    (thing) => {
      if (thing.type === "villager") {
        setDialogue([{ speaker: "Villager", text: HINTS[Math.floor(Math.random() * HINTS.length)] }]);
        return;
      }
      if (thing.type === "sign") {
        const t = thing.sign.target;
        setSigns((s) => {
          const next = new Set(s).add(thing.sign.id);
          if (next.size === SIGNS.length) unlock("reader");
          return next;
        });
        visit(`sign-${thing.sign.id}`, 25);
        setDialogue(t.kind === "start" ? startScript() : t.kind === "chapter" ? chapterScript(t.id) : signScript(t.text));
        return;
      }
      const b = thing.building;
      visit(b.id);
      const t = b.target;
      if (b.id === "foundry") unlock("hot-metal");
      if (t.kind === "entry") setDialogue(entryScript(t.id));
      else if (t.kind === "beat") setDialogue(indiaScript());
      else if (t.kind === "sprinta") {
        unlock("guildmate");
        setDialogue(sprintaScript());
      } else if (t.kind === "bag") {
        unlock("packed");
        setPanel("bag");
      } else if (t.kind === "arcade") setPanel("arcade");
      else if (t.kind === "post") {
        unlock("postman");
        setPanel("post");
      }
    },
    [visit, unlock],
  );

  const onStep = useCallback(
    (x) => {
      unlock("first-steps");
      const r = region(x);
      setPlace(PLACE[r]);
      if (r === "india") unlock("passport");
      if (r === "sweden") unlock("valkommen");
    },
    [unlock],
  );

  const travel = useCallback((b) => {
    const [x, y] = approachOf({ type: "door", building: b });
    world.current?.teleport(x, y, b.door[1] < y ? "up" : "down");
    setPanel(null);
    setPlace(PLACE[region(x)]);
  }, []);

  const toggleTheme = useCallback(() => {
    const next = !document.body.classList.contains("dark-theme");
    document.body.classList.toggle("dark-theme", next);
    try {
      window.localStorage.setItem("jm-theme", next ? "dark" : "light");
    } catch {
      /* fine */
    }
    setDark(next);
  }, []);

  // Menu keys.
  useEffect(() => {
    const onKey = (e) => {
      if (view !== "game" || dialogue || e.target.closest?.("input, textarea")) return;
      const k = e.key.toLowerCase();
      const map = { q: "quests", i: "bag", m: "map", t: "trophies" };
      if (map[k]) {
        e.preventDefault();
        setPanel((p) => (p === map[k] ? null : map[k]));
        if (map[k] === "bag") unlock("packed");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [view, dialogue, unlock]);

  const showCv = () => {
    setView("cv");
    window.history.replaceState(null, "", "#cv");
    window.scrollTo(0, 0);
  };
  const showGame = () => {
    setView("game");
    window.history.replaceState(null, "", window.location.pathname);
  };

  if (view === "cv") return <CV onPlay={showGame} />;

  const close = () => setPanel(null);

  return (
    <div className="game">
      <World ref={world} paused={Boolean(dialogue || panel)} onInteract={open} onStep={onStep} dark={dark} />
      <Hud progress={progress} place={place} onOpen={(p) => {
          if (p === "bag") unlock("packed");
          setPanel(p);
        }} dark={dark} onTheme={toggleTheme} onCv={showCv} />
      <Pad world={world} />
      {dialogue && <Dialogue script={dialogue} onClose={() => setDialogue(null)} />}
      {panel === "quests" && <QuestLog visited={progress.visited} onClose={close} onTravel={travel} />}
      {panel === "bag" && <Bag onClose={close} />}
      {panel === "arcade" && <Arcade onClose={close} onPlay={() => unlock("high-score")} />}
      {panel === "post" && <PostOffice onClose={close} />}
      {panel === "map" && <MapMenu visited={progress.visited} here={world.current?.position()} onClose={close} onTravel={travel} />}
      {panel === "trophies" && (
        <Trophies
          unlocked={progress.unlocked}
          xp={progress.xp}
          onClose={close}
          onReset={() => {
            progress.reset();
            setSigns(new Set());
            world.current?.teleport(3, 14, "right");
            close();
          }}
        />
      )}
      <Toasts toasts={progress.toasts} />
    </div>
  );
}
