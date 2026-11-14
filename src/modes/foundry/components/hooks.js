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

/** True while the page is in the dark theme, following the toggle. */
export function useDarkTheme() {
  const read = () => document.body.classList.contains("dark-theme");
  const [dark, setDark] = useState(read);
  useEffect(() => {
    const mo = new MutationObserver(() => setDark(read()));
    mo.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    return () => mo.disconnect();
  }, []);
  return dark;
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
