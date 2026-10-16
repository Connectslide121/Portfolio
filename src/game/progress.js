import { useCallback, useEffect, useRef, useState } from "react";

/**
 * What this visitor has seen and earned, kept in their own browser. Purely
 * for fun: nothing breaks if storage is blocked, the progress just resets.
 */
const KEY = "jm-quest";

export const ACHIEVEMENTS = [
  { id: "first-steps", name: "First steps", how: "Take a walk." },
  { id: "hot-metal", name: "Hot metal", how: "Step inside the foundry." },
  { id: "passport", name: "Passport", how: "Cross the river into India." },
  { id: "valkommen", name: "Välkommen", how: "Cross the sea into Sweden." },
  { id: "scholar", name: "Scholar", how: "Visit all three schools." },
  { id: "guildmate", name: "Guildmate", how: "Hear a story at Sprinta." },
  { id: "high-score", name: "High score", how: "Play the Arcade." },
  { id: "packed", name: "Packed bag", how: "Open the bag." },
  { id: "postman", name: "Special delivery", how: "Visit the Post Office." },
  { id: "night-owl", name: "Night owl", how: "Explore at night." },
  { id: "reader", name: "Avid reader", how: "Read every signpost." },
  { id: "completionist", name: "Completionist", how: "Visit every building." },
];

const read = () => {
  try {
    return JSON.parse(window.localStorage.getItem(KEY)) || {};
  } catch {
    return {};
  }
};

export const XP_PER_LEVEL = 300;

export default function useProgress() {
  const [state, setState] = useState(() => ({ visited: [], unlocked: [], xp: 0, ...read() }));
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    try {
      window.localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* progress just will not persist */
    }
  }, [state]);

  const toast = useCallback((t) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((all) => [...all, { ...t, id }]);
    window.setTimeout(() => setToasts((all) => all.filter((x) => x.id !== id)), 3600);
  }, []);

  // Side effects (toasts) stay out of the state updaters; the ref says
  // what has already been earned.
  const now = useRef(state);
  now.current = state;

  const unlock = useCallback(
    (id) => {
      if (now.current.unlocked.includes(id)) return;
      const a = ACHIEVEMENTS.find((x) => x.id === id);
      now.current = { ...now.current, unlocked: [...now.current.unlocked, id] };
      setState((s) => (s.unlocked.includes(id) ? s : { ...s, unlocked: [...s.unlocked, id], xp: s.xp + 50 }));
      if (a) toast({ kind: "achievement", title: a.name, text: a.how });
    },
    [toast],
  );

  /** First visit to a place: XP, and maybe an achievement or two. */
  const visit = useCallback(
    (id, xp = 100) => {
      if (now.current.visited.includes(id)) return;
      now.current = { ...now.current, visited: [...now.current.visited, id] };
      setState((s) => (s.visited.includes(id) ? s : { ...s, visited: [...s.visited, id], xp: s.xp + xp }));
      toast({ kind: "xp", title: `+${xp} XP`, text: "New place discovered" });
    },
    [toast],
  );

  const reset = useCallback(() => setState({ visited: [], unlocked: [], xp: 0 }), []);

  const level = 1 + Math.floor(state.xp / XP_PER_LEVEL);
  const into = state.xp % XP_PER_LEVEL;

  return { ...state, level, into, visit, unlock, toast, toasts, reset };
}
