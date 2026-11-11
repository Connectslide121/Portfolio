import React, { useEffect, useRef } from "react";
import { mediaFor } from "../../../data/projectMedia";

/**
 * A project clip that does not touch the network until it is nearly on
 * screen, and pauses again when it leaves. The files are megabytes each;
 * autoplaying all of them on load would pull them all at once.
 */
function LazyVideo({ src, title, controls }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (typeof IntersectionObserver === "undefined") {
      el.preload = "auto";
      el.play().catch(() => {});
      return undefined;
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
      { rootMargin: "40% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [src]);

  return <video ref={ref} src={src} aria-label={`${title}, screen recording`} loop muted playsInline controls={controls} preload="none" />;
}

export default function ProjectMedia({ title, controls = false }) {
  const media = mediaFor(title);
  return media.type === "video" ? (
    <LazyVideo src={media.src} title={title} controls={controls} />
  ) : (
    <img src={media.src} alt={`${title}, screenshot`} loading="lazy" />
  );
}
