import React, { useEffect, useRef } from "react";
import { Icon } from "./PixelArt";

const MIN_W = 300;
const MIN_H = 200;

/**
 * Window chrome: a title bar you can drag (double-click to maximise), the
 * three caption buttons, a resize grip, and a sunken client area for the
 * app. On a phone every window is maximised and stays put.
 */
export default function Window({ win, title, icon, focused, compact, wm, children, menu, status }) {
  const ref = useRef(null);
  const titleId = `${win.id}-title`;
  const max = win.max || compact;

  // Put focus inside a window when it opens, so keyboard users land in it.
  useEffect(() => {
    ref.current?.focus({ preventScroll: true });
  }, []);

  const startDrag = (e) => {
    if (max || e.button !== 0 || e.target.closest("button")) return;
    e.preventDefault();
    wm.focus(win.id);
    const sx = e.clientX - win.x;
    const sy = e.clientY - win.y;
    const onMove = (ev) => {
      const x = Math.min(window.innerWidth - 80, Math.max(80 - win.w, ev.clientX - sx));
      const y = Math.min(window.innerHeight - 70, Math.max(0, ev.clientY - sy));
      wm.move(win.id, x, y);
    };
    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      document.body.classList.remove("is-dragging");
    };
    document.body.classList.add("is-dragging");
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  const startResize = (e) => {
    if (max) return;
    e.preventDefault();
    e.stopPropagation();
    const sx = e.clientX;
    const sy = e.clientY;
    const { w, h } = win;
    const onMove = (ev) => {
      wm.resize(win.id, Math.max(MIN_W, w + ev.clientX - sx), Math.max(MIN_H, h + ev.clientY - sy));
    };
    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      document.body.classList.remove("is-dragging");
    };
    document.body.classList.add("is-dragging");
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  const style = max
    ? { zIndex: win.z }
    : { zIndex: win.z, left: win.x, top: win.y, width: win.w, height: win.h };

  return (
    <section
      ref={ref}
      className={`window${focused ? " is-focused" : ""}${max ? " is-max" : ""}`}
      style={style}
      role="dialog"
      aria-labelledby={titleId}
      tabIndex={-1}
      hidden={win.min}
      onPointerDown={() => !focused && wm.focus(win.id)}
      onKeyDown={(e) => {
        // Escape closes the window — but never from inside a text field,
        // where it would throw away what someone was typing.
        if (e.key === "Escape" && !e.defaultPrevented && !e.target.closest("input, textarea")) {
          e.preventDefault();
          wm.close(win.id);
        }
      }}
    >
      <header className="title-bar" onPointerDown={startDrag} onDoubleClick={() => !compact && wm.toggleMax(win.id)}>
        <Icon name={icon} scale={1} className="title-icon" />
        <h2 id={titleId} className="title-text">
          {title}
        </h2>
        <div className="caption-btns">
          <button type="button" className="caption-btn" aria-label="Minimise" onClick={() => wm.minimize(win.id)}>
            <span className="glyph-min" />
          </button>
          {!compact && (
            <button
              type="button"
              className="caption-btn"
              aria-label={win.max ? "Restore" : "Maximise"}
              onClick={() => wm.toggleMax(win.id)}
            >
              <span className={win.max ? "glyph-restore" : "glyph-max"} />
            </button>
          )}
          <button type="button" className="caption-btn caption-close" aria-label="Close" onClick={() => wm.close(win.id)}>
            <span className="glyph-close" />
          </button>
        </div>
      </header>
      {menu && (
        <div className="menu-bar" aria-hidden="true">
          {menu.map((m) => (
            <span key={m}>
              <u>{m[0]}</u>
              {m.slice(1)}
            </span>
          ))}
        </div>
      )}
      <div className="window-body">{children}</div>
      {status && (
        <footer className="status-bar">
          {status.map((s, i) => (
            <span key={i}>{s}</span>
          ))}
        </footer>
      )}
      {!max && <span className="resize-grip" onPointerDown={startResize} aria-hidden="true" />}
    </section>
  );
}
