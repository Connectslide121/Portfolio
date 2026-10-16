import React from "react";

export default function Toasts({ toasts }) {
  return (
    <div className="toasts" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className="toast">
          <span className="medal" aria-hidden="true">
            ★
          </span>
          <div>
            <p className="toast-title">{t.title}</p>
            <p className="toast-text">{t.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
