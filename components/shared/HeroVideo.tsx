"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./shared.module.css";

/**
 * Plays over the hero poster image, which stays the LCP element. The source is
 * set only after hydration, so the video never delays first paint, and is
 * skipped entirely for reduced motion or data saver: they keep the poster.
 */
export function HeroVideo({ src }: { src: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (saveData || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    video.muted = true; // autoplay is only allowed muted; React doesn't set the attribute
    // `${src}-{720|1080}.{webm|mp4}`: AV1 is ~half the size of H.264 at the
    // same quality; older Safari can't play it and gets the MP4.
    const size = window.matchMedia("(max-width: 900px)").matches ? 720 : 1080;
    const av1 = video.canPlayType('video/webm; codecs="av01.0.08M.10, opus"') !== "";
    video.src = `${src}-${size}.${av1 ? "webm" : "mp4"}`;
    video.play().catch(() => {}); // blocked (e.g. low-power mode): the poster stays

    // Don't decode frames nobody can see.
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) video.play().catch(() => {});
      else video.pause();
    });
    observer.observe(video);
    return () => observer.disconnect();
  }, [src]);

  const toggleSound = () => {
    const video = ref.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  };

  return (
    <>
      <video
        ref={ref}
        className={`${styles["hero-video"]} ${playing ? styles.playing : ""}`}
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
        tabIndex={-1}
        onPlaying={() => setPlaying(true)}
      />
      {playing && (
        <button
          type="button"
          className={styles["hero-sound"]}
          onClick={toggleSound}
          aria-pressed={!muted}
          aria-label={muted ? "Turn sound on" : "Turn sound off"}
        >
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 9v6h4l5 4V5L8 9H4z" />
            {muted ? <path d="M17 9l5 6M22 9l-5 6" /> : <path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12" />}
          </svg>
          <span>{muted ? "Sound on" : "Sound off"}</span>
        </button>
      )}
    </>
  );
}
