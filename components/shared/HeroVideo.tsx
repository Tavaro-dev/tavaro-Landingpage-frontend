"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import styles from "./shared.module.css";

/** Sound level when on (0–1, linear): 0.06 is about 24 dB under the clip, which is mastered loud. */
const VOLUME = 0.005;
type Audio = { ctx: AudioContext; gain: GainNode };

/**
 * Plays over the hero poster image, which stays the LCP element. The source is
 * set only after hydration, so the video never delays first paint, and is
 * skipped entirely for reduced motion or data saver: they keep the poster.
 */
export function HeroVideo({ src }: { src: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [slot, setSlot] = useState<HTMLElement | null>(null);
  // Loudness runs through a Web Audio gain: iOS ignores video.volume, and a gain can glide.
  const audio = useRef<Audio | null>(null);
  const soundOn = useRef(false);
  const visible = useRef(1);

  /** Glide toward the level for the current state: off, or VOLUME scaled by how much of the hero shows. */
  const glide = (seconds: number) => {
    const a = audio.current;
    const level = soundOn.current ? VOLUME * visible.current : 0;
    if (!a) {
      // No Web Audio graph (yet): only while sound is on, step the element volume
      // (each 5% of scroll is one small step). Off is handled by muting, and the
      // element volume must stay at 1 for a graph built later, which hears it post-volume.
      if (ref.current && soundOn.current) ref.current.volume = level;
      return;
    }
    a.gain.gain.cancelScheduledValues(a.ctx.currentTime);
    a.gain.gain.setTargetAtTime(level, a.ctx.currentTime, seconds);
  };

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    setSlot(document.getElementById("hero-sound-slot"));
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (saveData || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    video.muted = true; // autoplay is only allowed muted; React doesn't set the attribute
    // `${src}-{720|1080}.{webm|mp4}`: AV1 is ~half the size of H.264 at the
    // same quality. Apple's WebKit (Safari, and every iOS browser) answers
    // "probably" for AV1 WebM yet never loads it, so it always gets the MP4.
    const size = window.matchMedia("(max-width: 900px)").matches ? 720 : 1080;
    const mp4 = `${src}-${size}.mp4`;
    const apple = navigator.vendor.startsWith("Apple");
    const av1 = !apple && video.canPlayType('video/webm; codecs="av01.0.08M.10, opus"') === "probably";
    video.src = av1 ? `${src}-${size}.webm` : mp4;
    // A browser that claims AV1 but fails to decode it still gets the video.
    video.onerror = () => {
      if (video.src.endsWith(".mp4")) return;
      video.src = mp4;
      video.play().catch(() => {});
    };
    video.play().catch(() => {}); // blocked (e.g. low-power mode): the poster stays

    // Sound fades with the hero as it scrolls away; once it is fully off screen
    // (and silent), stop decoding frames nobody can see.
    let pauseTimer = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible.current = entry.intersectionRatio;
        glide(0.15);
        window.clearTimeout(pauseTimer);
        if (entry.isIntersecting) video.play().catch(() => {});
        else pauseTimer = window.setTimeout(() => video.pause(), 800);
      },
      { threshold: Array.from({ length: 21 }, (_, i) => i / 20) },
    );
    observer.observe(video);
    return () => {
      observer.disconnect();
      window.clearTimeout(pauseTimer);
    };
  }, [src]);

  const toggleSound = () => {
    const video = ref.current;
    if (!video) return;
    soundOn.current = !soundOn.current;
    setMuted(!soundOn.current);
    const Ctx = window.AudioContext ?? (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) {
      // No Web Audio: plain mute toggle at the reduced volume.
      video.volume = VOLUME;
      video.muted = !soundOn.current;
      return;
    }
    if (!audio.current) {
      const ctx = new Ctx();
      const gain = ctx.createGain();
      gain.gain.value = 0;
      ctx.createMediaElementSource(video).connect(gain).connect(ctx.destination);
      audio.current = { ctx, gain };
    }
    audio.current.ctx.resume().catch(() => {});
    video.volume = 1;
    video.muted = false; // the gain sets the loudness from here on
    glide(soundOn.current ? 0.35 : 0.15);
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
      {playing && slot && createPortal(
        <button
          type="button"
          className={`${styles["hero-sound"]} ${muted ? styles["hero-sound-muted"] : ""}`}
          onClick={toggleSound}
          aria-pressed={!muted}
          aria-label={muted ? "Turn sound on" : "Turn sound off"}
          title={muted ? "Sound on" : "Sound off"}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 9v6h4l5 4V5L8 9H4z" />
            {muted ? <path d="M17 9.5l4.5 5M21.5 9.5l-4.5 5" /> : <path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12" />}
          </svg>
        </button>,
        slot,
      )}
    </>
  );
}
