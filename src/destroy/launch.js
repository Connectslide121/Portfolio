// Whether this device can play destruction mode: it needs a mouse to aim,
// and it is all motion, so never under reduced motion.

export const canPlay = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(pointer: fine)").matches &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
