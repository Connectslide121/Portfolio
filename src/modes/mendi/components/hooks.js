import { useEffect, useState } from "react";

export const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Which section is under the reading line (a third of the way down the
 * screen). IntersectionObserver rather than a scroll handler, so nothing runs
 * while the page is still.
 */
export function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0]);

  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean);
    if (!els.length || typeof IntersectionObserver === "undefined") return undefined;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.isIntersecting && setActive(e.target.id));
      },
      { rootMargin: "-33% 0px -66% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [ids]);

  return active;
}

/**
 * Lets `[data-reveal]` blocks rise into place once, as they first come into
 * view. They only move and fade, so nothing around them shifts. Without an
 * observer, or with reduced motion, everything is simply shown.
 */
export function useReveal() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll("[data-reveal]"));
    if (typeof IntersectionObserver === "undefined" || reducedMotion()) {
      els.forEach((el) => el.classList.add("is-in"));
      return undefined;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: "0px 0px -6% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/** True once the page has left the top, for the nav to put its backing on. */
export function useScrolled(after = 24) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > after);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [after]);
  return scrolled;
}

/**
 * Hands the hero its scroll position as --sy (in px, clamped to its own
 * height), once per frame. Each layer of the landscape multiplies it by its
 * own depth, so the far ranges fall behind the near ones.
 */
export function useParallax(ref) {
  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion()) return undefined;
    let frame = 0;
    const update = () => {
      frame = 0;
      el.style.setProperty("--sy", Math.min(Math.max(window.scrollY, 0), el.offsetHeight).toFixed(1));
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.cancelAnimationFrame(frame);
    };
  }, [ref]);
}

/** The time in Växjö, to the minute. */
export function useLocalTime(timeZone = "Europe/Stockholm") {
  const format = () => new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone }).format(new Date());
  const [time, setTime] = useState(format);

  useEffect(() => {
    const id = window.setInterval(() => setTime(format()), 15000);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeZone]);

  return time;
}

/** Keeps the page behind a dialog from scrolling while it is open. */
export function usePageLock(locked) {
  useEffect(() => {
    document.documentElement.classList.toggle("is-locked", locked);
    return () => document.documentElement.classList.remove("is-locked");
  }, [locked]);
}
