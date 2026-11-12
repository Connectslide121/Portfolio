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
 * Hands the hero what its landscape moves by, once per frame and only while
 * something is changing:
 *   --sy         its scroll position, in px, clamped to its own height
 *   --mx, --my   where the pointer is over it, -1 to 1 from the centre
 * Each layer takes its own share of both, so the far ranges fall behind the
 * near ones. The pointer is eased towards (the scene glides, it does not
 * jump) and only read where there is a mouse to follow.
 */
export function useParallax(ref) {
  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion()) return undefined;
    const follows = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const at = { x: 0, y: 0 };
    const to = { x: 0, y: 0 };
    let frame = 0;
    let scrolled = -1;

    const tick = () => {
      frame = 0;
      const y = Math.min(Math.max(window.scrollY, 0), el.offsetHeight);
      if (y !== scrolled) {
        scrolled = y;
        el.style.setProperty("--sy", y.toFixed(1));
      }
      const dx = to.x - at.x;
      const dy = to.y - at.y;
      if (Math.abs(dx) > 0.0005 || Math.abs(dy) > 0.0005) {
        at.x += dx * 0.06;
        at.y += dy * 0.06;
        el.style.setProperty("--mx", at.x.toFixed(4));
        el.style.setProperty("--my", at.y.toFixed(4));
        frame = window.requestAnimationFrame(tick);
      }
    };
    const wake = () => {
      if (!frame) frame = window.requestAnimationFrame(tick);
    };
    const onMove = (e) => {
      to.x = (e.clientX / window.innerWidth) * 2 - 1;
      to.y = (e.clientY / window.innerHeight) * 2 - 1;
      wake();
    };
    const onLeave = () => {
      to.x = 0;
      to.y = 0;
      wake();
    };

    wake();
    window.addEventListener("scroll", wake, { passive: true });
    if (follows) {
      el.addEventListener("pointermove", onMove);
      el.addEventListener("pointerleave", onLeave);
    }
    return () => {
      window.removeEventListener("scroll", wake);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
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
