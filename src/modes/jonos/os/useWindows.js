import { useCallback, useReducer } from "react";

/**
 * The window manager. Windows live in one list; the one with the highest z
 * is focused. Positions are in desktop pixels; `max` fills the desktop.
 */

let zTop = 10;

const cascade = (count, w, h) => {
  const vw = window.innerWidth;
  const vh = window.innerHeight - 40; // taskbar
  const step = (count % 6) * 30;
  return {
    x: Math.max(8, Math.min(vw - w - 8, Math.round((vw - w) / 2) - 90 + step)),
    y: Math.max(8, Math.min(vh - h - 8, Math.round((vh - h) / 2) - 70 + step)),
  };
};

function reducer(state, action) {
  switch (action.type) {
    case "open": {
      const existing = state.find((w) => w.id === action.id);
      if (existing) {
        return state.map((w) => (w.id === action.id ? { ...w, min: false, z: ++zTop, props: action.props ?? w.props } : w));
      }
      const w = Math.min(action.w, window.innerWidth - 16);
      const h = Math.min(action.h, window.innerHeight - 56);
      const pos = action.x != null ? { x: action.x, y: action.y } : cascade(state.length, w, h);
      return [...state, { id: action.id, app: action.app, props: action.props, w, h, ...pos, z: ++zTop, min: false, max: false }];
    }
    case "close":
      return state.filter((w) => w.id !== action.id);
    case "focus":
      return state.map((w) => (w.id === action.id ? { ...w, z: ++zTop, min: false } : w));
    case "minimize":
      return state.map((w) => (w.id === action.id ? { ...w, min: true } : w));
    case "toggleMax":
      return state.map((w) => (w.id === action.id ? { ...w, max: !w.max, z: ++zTop } : w));
    case "move":
      return state.map((w) => (w.id === action.id ? { ...w, x: action.x, y: action.y } : w));
    case "resize":
      return state.map((w) => (w.id === action.id ? { ...w, w: action.w, h: action.h } : w));
    case "closeAll":
      return [];
    default:
      return state;
  }
}

export default function useWindows(initial = []) {
  const [windows, dispatch] = useReducer(reducer, initial);

  const api = {
    open: useCallback((id, app, opts = {}) => dispatch({ type: "open", id, app, w: 640, h: 480, ...opts }), []),
    close: useCallback((id) => dispatch({ type: "close", id }), []),
    focus: useCallback((id) => dispatch({ type: "focus", id }), []),
    minimize: useCallback((id) => dispatch({ type: "minimize", id }), []),
    toggleMax: useCallback((id) => dispatch({ type: "toggleMax", id }), []),
    move: useCallback((id, x, y) => dispatch({ type: "move", id, x, y }), []),
    resize: useCallback((id, w, h) => dispatch({ type: "resize", id, w, h }), []),
    closeAll: useCallback(() => dispatch({ type: "closeAll" }), []),
  };

  const visible = windows.filter((w) => !w.min);
  const focusedId = visible.length ? visible.reduce((a, b) => (b.z > a.z ? b : a)).id : null;

  return { windows, focusedId, ...api };
}
