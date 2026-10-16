import React, { useEffect, useRef } from "react";
import { mediaFor } from "../../../data/projectMedia";

/**
 * A project clip that does not touch the network until it is nearly on
 * screen, and pauses again when it leaves. The files are tens of megabytes
 * each; autoplaying all of them on load would pull them all at once.
 */
function LazyVideo({ src, title, className, controls }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      el.preload = "auto";
      el.play().catch(() => {});
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.preload = "auto";
          el.play().catch(() => {});
        } else {
          el.pause();
        }
      },
      { rootMargin: "50% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [src]);

  return (
    <video
      ref={ref}
      className={className}
      src={src}
      aria-label={title}
      loop
      muted
      playsInline
      controls={controls}
      preload="none"
    />
  );
}

export default function ProjectMedia({ title, className = "", controls = false }) {
  const media = mediaFor(title);
  return media.type === "video" ? (
    <LazyVideo src={media.src} title={title} className={className} controls={controls} />
  ) : (
    <img className={className} src={media.src} alt={title} loading="lazy" />
  );
}
