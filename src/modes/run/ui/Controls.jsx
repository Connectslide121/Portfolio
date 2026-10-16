import React from "react";

/** Touch buttons: hold ◀ ▶ to run, A to jump. */
export default function Controls({ game }) {
  const hold = (key) => ({
    onPointerDown: (e) => {
      e.preventDefault();
      e.currentTarget.setPointerCapture?.(e.pointerId);
      game.current?.press(key, true);
    },
    onPointerUp: () => game.current?.press(key, false),
    onPointerCancel: () => game.current?.press(key, false),
    onContextMenu: (e) => e.preventDefault(),
  });
  return (
    <div className="controls" aria-hidden="true">
      <div className="ctl-dir">
        <button type="button" tabIndex={-1} {...hold("left")}>
          ◀
        </button>
        <button type="button" tabIndex={-1} {...hold("right")}>
          ▶
        </button>
      </div>
      <button type="button" className="ctl-jump" tabIndex={-1} {...hold("jump")}>
        A
      </button>
    </div>
  );
}
