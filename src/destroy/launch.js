// Shared between the hero's button and the corner badge: whether this
// device can play at all, and the event either one fires to start a game.

export const DZ_START = "jm-destroy-start";

export const canPlay = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(pointer: fine)").matches &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const requestStart = () => window.dispatchEvent(new CustomEvent(DZ_START));
