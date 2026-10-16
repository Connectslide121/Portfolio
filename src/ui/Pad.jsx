import React from "react";

/** The on-screen pad for touch: hold an arrow to walk, A to act. */
export default function Pad({ world }) {
  const hold = (dir) => ({
    onPointerDown: (e) => {
      e.preventDefault();
      e.currentTarget.setPointerCapture?.(e.pointerId);
      world.current?.press(dir, true);
    },
    onPointerUp: () => world.current?.press(dir, false),
    onPointerCancel: () => world.current?.press(dir, false),
    onContextMenu: (e) => e.preventDefault(),
  });
  return (
    <div className="pad" aria-hidden="true">
      <div className="dpad">
        <button type="button" className="d-up" tabIndex={-1} {...hold("up")}>
          ▲
        </button>
        <button type="button" className="d-left" tabIndex={-1} {...hold("left")}>
          ◀
        </button>
        <button type="button" className="d-right" tabIndex={-1} {...hold("right")}>
          ▶
        </button>
        <button type="button" className="d-down" tabIndex={-1} {...hold("down")}>
          ▼
        </button>
      </div>
      <button type="button" className="a-btn" tabIndex={-1} onPointerDown={(e) => {
          e.preventDefault();
          world.current?.act();
        }}>
        A
      </button>
    </div>
  );
}
