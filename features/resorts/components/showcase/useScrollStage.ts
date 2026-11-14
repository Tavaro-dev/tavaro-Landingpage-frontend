import { useEffect, useRef, useState, type RefObject } from "react";

function headerHeight() {
  const h = document.querySelector(".site-header")?.getBoundingClientRect().height;
  return h && h > 0 ? h : 72;
}

/** Where the track pins under the header, and how far it scrolls while pinned. */
function trackGeometry(track: HTMLElement) {
  const headerH = headerHeight();
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const start = track.getBoundingClientRect().top + scrollTop - headerH;
  const distance = track.offsetHeight - (window.innerHeight - headerH);
  return { scrollTop, start, distance };
}

/**
 * Scroll-driven stage index for a pinned track: the pinned distance is split
 * into `count` equal bands. `select(i)` smooth-scrolls to the middle of band i.
 */
export function useScrollStage(trackRef: RefObject<HTMLElement | null>, count: number) {
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  const programmatic = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    const onScroll = () => {
      // A smooth scroll from select() passes through other bands; ignore it.
      if (programmatic.current || !trackRef.current) return;
      const { scrollTop, start, distance } = trackGeometry(trackRef.current);
      if (distance <= 0) return;
      const progress = Math.max(0, Math.min(1, (scrollTop - start) / distance));
      const next = Math.min(count - 1, Math.floor(progress * count));
      if (next !== activeRef.current) setActive(next);
    };

    // User wheel or touch interrupts a programmatic scroll immediately.
    const onUserScroll = () => {
      programmatic.current = false;
      if (timer.current) clearTimeout(timer.current);
    };

    window.addEventListener("scroll", onScroll, { passive: true, capture: true });
    document.addEventListener("scroll", onScroll, { passive: true, capture: true });
    window.addEventListener("resize", onScroll, { passive: true });
    window.addEventListener("wheel", onUserScroll, { passive: true });
    window.addEventListener("touchmove", onUserScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll, { capture: true });
      document.removeEventListener("scroll", onScroll, { capture: true });
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("wheel", onUserScroll);
      window.removeEventListener("touchmove", onUserScroll);
    };
  }, [trackRef, count]);

  const select = (index: number) => {
    setActive(index);
    if (!trackRef.current) return;
    const { start, distance } = trackGeometry(trackRef.current);
    if (distance <= 0) return;

    programmatic.current = true;
    if (timer.current) clearTimeout(timer.current);
    window.scrollTo({ top: start + (index + 0.5) * (distance / count), behavior: "smooth" });
    timer.current = setTimeout(() => {
      programmatic.current = false;
    }, 650);
  };

  return [active, select] as const;
}
