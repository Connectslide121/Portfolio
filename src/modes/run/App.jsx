import React, { useCallback, useMemo, useRef, useState } from "react";
import Game from "./run/Game";
import { STAGES, stageInfo, zoneAt } from "./run/level";
import { featuredProjects, allProjects } from "../../components/projectList";
import Hud from "./ui/Hud";
import Title from "./ui/Title";
import StageCard from "./ui/StageCard";
import Collection from "./ui/Collection";
import StageSelect from "./ui/StageSelect";
import EndScreen from "./ui/EndScreen";
import Controls from "./ui/Controls";
import Toasts from "./ui/Toasts";
import CV from "./ui/CV";

const TOTAL_SKILLS = STAGES.filter((s) => !s.quiet).reduce((n, s) => n + stageInfo(s).tech.length, 0);
const TOTAL_COINS = featuredProjects.length + allProjects.length;

const yearAt = (x) => {
  const st = [...STAGES].reverse().find((s) => x >= s.from);
  if (!st) return "2005";
  if (zoneAt(Math.floor(x)) === "software" && x > STAGES[STAGES.length - 1].to) return "Today";
  return stageInfo(st).when.split(/\s*[-—]\s*/)[0];
};

export default function App() {
  const game = useRef(null);
  const [view, setView] = useState(() => (window.location.hash === "#cv" ? "cv" : "game"));
  const [started, setStarted] = useState(false);
  const [panel, setPanel] = useState(null); // { kind, stage? }
  const [hearts, setHearts] = useState(3);
  const [skills, setSkills] = useState([]);
  const [coins, setCoins] = useState([]);
  const [bugs, setBugs] = useState(0);
  const [reached, setReached] = useState([]);
  const [progress, setProgress] = useState({ p: 0, year: "2005" });
  const [toasts, setToasts] = useState([]);
  const [dark, setDark] = useState(() => document.body.classList.contains("dark-theme"));
  const startedAt = useRef(0);
  const [time, setTime] = useState("");

  const toast = useCallback((text, kind = "info") => {
    const id = Math.random().toString(36).slice(2);
    setToasts((t) => [...t.slice(-3), { id, text, kind }]);
    window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2600);
  }, []);

  const events = useMemo(
    () => ({
      onFlag: (stage) => {
        setReached((r) => (r.includes(stage.id) ? r : [...r, stage.id]));
        setPanel({ kind: "stage", stage });
      },
      onSkill: (b) => {
        setSkills((s) => [...s, { skill: b.skill, stage: b.stage }]);
        toast(`? ${b.skill}`, "skill");
      },
      onCoin: (p) => {
        setCoins((c) => (c.includes(p.title) ? c : [...c, p.title]));
        toast(`● ${p.title}${p.featured ? " ★" : ""}`, "coin");
      },
      onBug: () => {
        setBugs((n) => n + 1);
        toast("Bug fixed! ✓", "bug");
      },
      onHurt: (why, h) => {
        setHearts(h);
        toast(why === "lava" ? "Ouch — molten steel! Back to the flag." : why === "pit" ? "Mind the gap! Back to the flag." : "A bug bit you!", "hurt");
      },
      onHearts: setHearts,
      onGoal: () => {
        const s = Math.round((performance.now() - startedAt.current) / 1000);
        setTime(`${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`);
        setPanel({ kind: "end" });
      },
      onProgress: (p, x) => setProgress({ p, year: yearAt(x) }),
    }),
    [toast],
  );

  const toggleTheme = () => {
    const next = !document.body.classList.contains("dark-theme");
    document.body.classList.toggle("dark-theme", next);
    try {
      window.localStorage.setItem("jm-theme", next ? "dark" : "light");
    } catch {
      /* fine */
    }
    setDark(next);
  };

  const start = useCallback(() => {
    setStarted(true);
    startedAt.current = performance.now();
  }, []);

  const again = () => {
    game.current?.restart();
    setSkills([]);
    setCoins([]);
    setBugs(0);
    setReached([]);
    setHearts(3);
    setPanel(null);
    startedAt.current = performance.now();
  };

  if (view === "cv") {
    return (
      <CV
        onPlay={() => {
          setView("game");
          window.history.replaceState(null, "", window.location.pathname + window.location.search);
        }}
      />
    );
  }

  const showCv = () => {
    setView("cv");
    window.history.replaceState(null, "", "#cv");
    window.scrollTo(0, 0);
  };
  const close = () => setPanel(null);

  return (
    <div className="run">
      <Game ref={game} paused={!started || Boolean(panel)} night={dark} events={events} />
      {started && (
        <Hud
          hearts={hearts}
          skills={skills.length}
          totalSkills={TOTAL_SKILLS}
          coins={coins.length}
          totalCoins={TOTAL_COINS}
          bugs={bugs}
          progress={progress.p}
          year={progress.year}
          onOpen={(kind) => setPanel({ kind })}
          dark={dark}
          onTheme={toggleTheme}
          onCv={showCv}
        />
      )}
      {started && <Controls game={game} />}
      {!started && <Title onStart={start} onCv={showCv} />}
      {panel?.kind === "stage" && <StageCard stage={panel.stage} onClose={close} />}
      {panel?.kind === "collection" && <Collection skills={skills} coins={coins} onClose={close} />}
      {panel?.kind === "stages" && (
        <StageSelect
          reached={reached}
          onClose={close}
          onTravel={(i) => {
            game.current?.travel(i);
            close();
          }}
        />
      )}
      {panel?.kind === "end" && (
        <EndScreen
          stats={{ skills: skills.length, totalSkills: TOTAL_SKILLS, coins: coins.length, totalCoins: TOTAL_COINS, bugs }}
          time={time}
          onClose={close}
          onAgain={again}
          onCollection={() => setPanel({ kind: "collection" })}
        />
      )}
      <Toasts toasts={toasts} />
    </div>
  );
}
