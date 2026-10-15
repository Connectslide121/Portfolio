import React, { useEffect } from "react";

export default function ShutDown({ onRestart }) {
  useEffect(() => {
    const onKey = () => onRestart();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onRestart]);

  return (
    <div className="shutdown" onClick={onRestart} role="status">
      <p>It's now safe to turn off your computer.</p>
      <small>(or click anywhere to start it again)</small>
    </div>
  );
}
