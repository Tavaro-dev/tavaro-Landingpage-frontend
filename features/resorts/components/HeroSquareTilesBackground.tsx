"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";

export interface HeroSlideItem {
  image: string;
  alt: string;
  title: string;
  tagline?: string;
}

interface HeroSquareTilesBackgroundProps {
  slides: HeroSlideItem[];
  overlayClassName?: string;
  intervalMs?: number;
  showIndicators?: boolean;
}

export function HeroSquareTilesBackground({
  slides,
  overlayClassName = "",
  intervalMs = 4600,
  showIndicators = true,
}: HeroSquareTilesBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // References to keep animation loop in sync without stale closures
  const loadedImagesRef = useRef<Map<string, HTMLImageElement>>(new Map());
  const currentIndexRef = useRef(currentIndex);
  const nextIndexRef = useRef<number | null>(null);
  const isTransitioningRef = useRef(false);

  useEffect(() => {
    currentIndexRef.current = currentIndex;
    nextIndexRef.current = nextIndex;
    isTransitioningRef.current = isTransitioning;
  }, [currentIndex, nextIndex, isTransitioning]);

  const animFrameIdRef = useRef<number | null>(null);
  const timerIdRef = useRef<NodeJS.Timeout | null>(null);

  // Helper: calculate cover aspect ratio
  const getCoverRect = (
    imgW: number,
    imgH: number,
    canvasW: number,
    canvasH: number
  ) => {
    const imgAspect = imgW / imgH;
    const canvasAspect = canvasW / canvasH;
    let drawW = canvasW;
    let drawH = canvasH;
    let offsetX = 0;
    let offsetY = 0;

    if (imgAspect > canvasAspect) {
      drawW = canvasH * imgAspect;
      offsetX = (canvasW - drawW) / 2;
    } else {
      drawH = canvasW / imgAspect;
      offsetY = (canvasH - drawH) / 2;
    }

    return { offsetX, offsetY, drawW, drawH };
  };

  // Helper: draw single static image on canvas
  const drawStaticImage = useCallback((img: HTMLImageElement) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    const { offsetX, offsetY, drawW, drawH } = getCoverRect(
      img.naturalWidth || img.width,
      img.naturalHeight || img.height,
      w,
      h
    );

    ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
  }, []);

  // Preload all slide images
  useEffect(() => {
    slides.forEach((slide) => {
      if (!loadedImagesRef.current.has(slide.image)) {
        const img = new window.Image();
        img.src = slide.image;
        img.onload = () => {
          loadedImagesRef.current.set(slide.image, img);
          // Redraw static canvas if current image just loaded
          if (slide.image === slides[currentIndexRef.current]?.image) {
            drawStaticImage(img);
          }
        };
      }
    });
  }, [slides, drawStaticImage]);

  // Responsive canvas sizing
  useEffect(() => {
    const updateCanvasSize = () => {
      const container = containerRef.current;
      const canvas = canvasRef.current;
      if (!container || !canvas) return;

      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const targetW = Math.round(rect.width * dpr);
      const targetH = Math.round(rect.height * dpr);

      if (canvas.width !== targetW || canvas.height !== targetH) {
        canvas.width = targetW;
        canvas.height = targetH;

        const currentImg = loadedImagesRef.current.get(
          slides[currentIndexRef.current]?.image
        );
        if (currentImg && !isTransitioningRef.current) {
          drawStaticImage(currentImg);
        }
      }
    };

    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);
    return () => window.removeEventListener("resize", updateCanvasSize);
  }, [slides, drawStaticImage]);

  // The Small Square Boxes Transition Animation Engine
  const startBoxesTransition = useCallback(
    (targetIndex: number) => {
      if (
        isTransitioningRef.current ||
        targetIndex === currentIndexRef.current ||
        !slides[targetIndex]
      ) {
        return;
      }

      const currentImg = loadedImagesRef.current.get(
        slides[currentIndexRef.current]?.image
      );
      const nextImg = loadedImagesRef.current.get(slides[targetIndex]?.image);

      if (!currentImg || !nextImg) {
        // Fallback if images not yet decoded
        setCurrentIndex(targetIndex);
        return;
      }

      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      setIsTransitioning(true);
      setNextIndex(targetIndex);

      const canvasW = canvas.width;
      const canvasH = canvas.height;

      // Small square boxes sizing: ~48-56px on desktop (scaled by DPR)
      const isMobile = window.innerWidth < 768;
      const baseBoxSize = (isMobile ? 36 : 52) * (window.devicePixelRatio || 1);
      const numCols = Math.max(8, Math.round(canvasW / baseBoxSize));
      const numRows = Math.max(6, Math.round(canvasH / baseBoxSize));
      const boxW = canvasW / numCols;
      const boxH = canvasH / numRows;

      // Cover mathematics for both images
      const currRect = getCoverRect(
        currentImg.naturalWidth,
        currentImg.naturalHeight,
        canvasW,
        canvasH
      );
      const nextRect = getCoverRect(
        nextImg.naturalWidth,
        nextImg.naturalHeight,
        canvasW,
        canvasH
      );

      // Pre-calculate per-tile stagger delays
      // Organic wave: diagonal cascade from top-left to bottom-right with pseudorandom variance
      const totalAnimationDuration = 1400; // ms
      const singleBoxDuration = 480; // ms
      const maxStaggerDelay = totalAnimationDuration - singleBoxDuration; // ~920ms

      const delays: number[][] = [];
      for (let r = 0; r < numRows; r++) {
        delays[r] = [];
        for (let c = 0; c < numCols; c++) {
          const normDiagonal = (c / numCols) * 0.65 + (r / numRows) * 0.35;
          // Deterministic organic jitter based on coordinates
          const jitter =
            ((Math.sin(c * 12.9898 + r * 78.233) * 43758.5453) % 1 + 1) % 1;
          const delay = (normDiagonal * 0.8 + jitter * 0.2) * maxStaggerDelay;
          delays[r][c] = delay;
        }
      }

      const startTime = performance.now();

      const renderFrame = (now: number) => {
        const elapsed = now - startTime;
        const totalProgress = Math.min(1, elapsed / totalAnimationDuration);

        // 1. Draw base current image
        ctx.clearRect(0, 0, canvasW, canvasH);
        ctx.drawImage(
          currentImg,
          currRect.offsetX,
          currRect.offsetY,
          currRect.drawW,
          currRect.drawH
        );

        // 2. Render the small square boxes of the next image
        for (let r = 0; r < numRows; r++) {
          for (let c = 0; c < numCols; c++) {
            const boxDelay = delays[r][c];
            const boxElapsed = elapsed - boxDelay;

            if (boxElapsed <= 0) {
              // Box hasn't started transitioning yet
              continue;
            }

            const p = Math.min(1, Math.max(0, boxElapsed / singleBoxDuration));

            // Smooth cubic ease out
            const ease = 1 - Math.pow(1 - p, 3);

            const destX = c * boxW;
            const destY = r * boxH;

            // Small square scale effect: grows smoothly from center
            const curW = boxW * ease;
            const curH = boxH * ease;
            const curX = destX + (boxW - curW) / 2;
            const curY = destY + (boxH - curH) / 2;

            ctx.save();

            // Clip strictly to the current scaled square box boundary
            ctx.beginPath();
            ctx.rect(curX, curY, curW, curH);
            ctx.clip();

            // Opacity ramp for soft luxury feel
            ctx.globalAlpha = Math.min(1, p * 1.35);

            // Draw slice of next image matching the exact position
            ctx.drawImage(
              nextImg,
              nextRect.offsetX,
              nextRect.offsetY,
              nextRect.drawW,
              nextRect.drawH
            );

            // Elegant hairline champagne border while box is assembling
            if (p > 0.05 && p < 0.95) {
              ctx.strokeStyle = `rgba(197, 160, 89, ${(1 - p) * 0.55})`;
              ctx.lineWidth = 1;
              ctx.strokeRect(curX, curY, curW, curH);
            }

            ctx.restore();
          }
        }

        if (totalProgress < 1) {
          animFrameIdRef.current = requestAnimationFrame(renderFrame);
        } else {
          // Completed transition: finalize next image as current
          ctx.clearRect(0, 0, canvasW, canvasH);
          ctx.drawImage(
            nextImg,
            nextRect.offsetX,
            nextRect.offsetY,
            nextRect.drawW,
            nextRect.drawH
          );

          setCurrentIndex(targetIndex);
          setNextIndex(null);
          setIsTransitioning(false);
        }
      };

      animFrameIdRef.current = requestAnimationFrame(renderFrame);
    },
    [slides]
  );

  // Auto-advance continuously across subsection images
  const triggerNext = useCallback(() => {
    if (isTransitioningRef.current || slides.length <= 1) return;
    const next = (currentIndexRef.current + 1) % slides.length;
    startBoxesTransition(next);
  }, [slides.length, startBoxesTransition]);

  // Set interval timer
  useEffect(() => {
    if (slides.length <= 1) return;

    // Respect reduced motion: slow down or don't animate aggressively
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const timer = setInterval(() => {
      // Pause if tab is in background
      if (document.hidden) return;
      triggerNext();
    }, prefersReducedMotion ? intervalMs * 2 : intervalMs);

    timerIdRef.current = timer;

    return () => {
      clearInterval(timer);
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [slides.length, intervalMs, triggerNext]);

  return (
    <div
      ref={containerRef}
      className="hero-square-tiles-container"
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        width: "100%",
        height: "100%",
      }}
      aria-label={`Hero background displaying ${slides[currentIndex]?.title}`}
    >
      <style>{`
        .hero-square-tiles-canvas {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          display: block;
          z-index: 1;
        }

        .hero-static-fallback {
          position: absolute;
          inset: 0;
          z-index: 0;
          opacity: 0.98;
          transition: opacity 0.8s ease;
        }

        .hero-subsection-indicators {
          position: absolute;
          bottom: 24px;
          right: clamp(20px, 4vw, 48px);
          z-index: 5;
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(15, 13, 10, 0.55);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 999px;
          padding: 6px 12px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
        }

        .hero-indicator-btn {
          background: transparent;
          border: none;
          cursor: pointer;
          font-family: var(--font-sans, sans-serif);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.6);
          padding: 4px 10px;
          border-radius: 999px;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .hero-indicator-btn:hover {
          color: #ffffff;
        }

        .hero-indicator-btn.active {
          color: #ffffff;
          background: rgba(197, 160, 89, 0.28);
          border: 1px solid rgba(197, 160, 89, 0.6);
        }

        .hero-indicator-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.4);
          transition: all 0.3s ease;
        }

        .hero-indicator-btn.active .hero-indicator-dot {
          background: var(--gold, #c5a059);
          transform: scale(1.4);
          box-shadow: 0 0 8px rgba(197, 160, 89, 0.8);
        }

        @media (max-width: 640px) {
          .hero-subsection-indicators {
            bottom: 16px;
            right: 16px;
            padding: 4px 8px;
            gap: 4px;
          }

          .hero-indicator-btn {
            font-size: 9.5px;
            padding: 3px 7px;
          }
        }
      `}</style>

      {/* Fallback Next.js Image for immediate SSR rendering */}
      <div className="hero-static-fallback">
        <Image
          src={slides[currentIndex]?.image || slides[0].image}
          alt={slides[currentIndex]?.alt || slides[0].alt}
          fill
          priority
          sizes="100vw"
          style={{ objectFit: "cover", objectPosition: "center 40%" }}
        />
      </div>

      {/* Dynamic Small Square Boxes Animation Canvas */}
      <canvas ref={canvasRef} className="hero-square-tiles-canvas" />

      {/* Visual Overlay gradient from page */}
      {overlayClassName && <div className={overlayClassName} />}

      {/* Subtle Subsection Navigation Pills */}
      {showIndicators && slides.length > 1 && (
        <nav
          className="hero-subsection-indicators"
          aria-label="Subsections showcase switcher"
        >
          {slides.map((slide, idx) => {
            const isActive = idx === (nextIndex !== null ? nextIndex : currentIndex);
            return (
              <button
                key={slide.title}
                type="button"
                className={`hero-indicator-btn ${isActive ? "active" : ""}`}
                onClick={() => startBoxesTransition(idx)}
                aria-label={`Show ${slide.title} background`}
                aria-current={isActive ? "true" : undefined}
              >
                <span className="hero-indicator-dot" />
                <span>{slide.title}</span>
              </button>
            );
          })}
        </nav>
      )}
    </div>
  );
}
