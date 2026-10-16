import React from "react";

export default function Toasts({ toasts }) {
  return (
    <div className="toasts" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className={`toast window toast-${t.kind}`}>
          <span className="toast-icon" aria-hidden="true">
            {t.kind === "achievement" ? "🏆" : "✦"}
          </span>
          <div>
            <p className="toast-title">{t.kind === "achievement" ? `Achievement: ${t.title}` : t.title}</p>
            <p className="toast-text">{t.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
