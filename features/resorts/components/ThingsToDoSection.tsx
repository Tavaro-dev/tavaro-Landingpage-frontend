"use client";

import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/shared/Reveal";
import { OfferHead } from "@/components/shared/OfferHead";
import { THINGS_TO_DO_DATA } from "../content/thingsToDoData";
import { ThingsToDoButton } from "./ThingsToDoButton";

export function ThingsToDoSection() {
  const { explore, create } = THINGS_TO_DO_DATA;

  return (
    <section className="offer-block on-dark things-to-do-section" id="things-to-do">
      <style>{`
        .things-to-do-section {
          padding: clamp(64px, 8vw, 112px) 0;
          background: var(--surface);
          color: var(--on-surface);
          border-top: 1px solid var(--surface-line);
          position: relative;
        }

        .ttd-header {
          margin-bottom: clamp(36px, 5vw, 56px);
        }

        .ttd-editorial-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: clamp(24px, 3.5vw, 40px);
        }

        .ttd-editorial-card {
          background: var(--surface-2);
          border: 1px solid var(--surface-line);
          border-radius: var(--radius, 2px);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          transition: border-color 0.3s ease, background 0.3s ease, transform 0.3s ease;
        }

        [data-theme="light"] .ttd-editorial-card {
          background: #ffffff;
          border-color: rgba(156, 124, 62, 0.35);
        }

        .ttd-editorial-card:hover {
          border-color: var(--gold);
          transform: translateY(-4px);
        }

        [data-theme="light"] .ttd-editorial-card:hover {
          border-color: var(--gold-dark);
          box-shadow: 0 16px 36px rgba(28, 24, 20, 0.08);
        }

        .ttd-editorial-media {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 10;
          overflow: hidden;
          background: var(--surface-2);
        }

        .ttd-editorial-img {
          object-fit: cover;
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .ttd-editorial-card:hover .ttd-editorial-img {
          transform: scale(1.04);
        }

        .ttd-editorial-body {
          padding: clamp(24px, 3.5vw, 36px);
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .ttd-editorial-tag {
          font-family: var(--font-sans, sans-serif);
          font-size: 10.5px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--gold);
          font-weight: 700;
          margin-bottom: 8px;
        }

        .ttd-editorial-title {
          font-family: var(--font-display, serif);
          font-size: clamp(24px, 2.5vw, 32px);
          font-weight: 400;
          line-height: 1.25;
          letter-spacing: 0.02em;
          color: var(--on-surface);
          margin: 0 0 12px;
        }

        .ttd-editorial-desc {
          font-size: 14.5px;
          line-height: 1.6;
          color: var(--on-surface-muted);
          margin: 0 0 20px;
          flex: 1;
        }

        .ttd-editorial-preview {
          font-family: var(--font-sans, sans-serif);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.08em;
          color: var(--gold);
          padding: 8px 12px;
          background: rgba(201, 164, 90, 0.1);
          border-left: 2px solid var(--gold);
          border-radius: var(--radius, 2px);
          margin-bottom: 24px;
          display: inline-block;
        }

        [data-theme="light"] .ttd-editorial-preview {
          background: var(--cream-2);
          color: var(--gold-dark);
          border-left-color: var(--gold-dark);
        }

        .ttd-editorial-action {
          margin-top: auto;
          padding-top: 20px;
          border-top: 1px solid var(--surface-line);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        @media (max-width: 860px) {
          .ttd-editorial-grid {
            grid-template-columns: 1fr;
            gap: 28px;
          }
          .ttd-editorial-media {
            aspect-ratio: 16 / 9;
          }
        }
      `}</style>

      <div className="container">
        <Reveal className="ttd-header">
          <OfferHead
            num="06 — Discovery & Activities"
            heading="Things to Do at Tavaro"
          />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: "16px", marginTop: "12px" }}>
            <p style={{ color: "var(--on-surface-muted)", maxWidth: "600px", margin: 0, fontSize: "15px", lineHeight: "1.6" }}>
              Whether wandering through quiet mango trails at your own pace or arranging a curated
              experience with our team, discover two distinct ways to experience Tavaro.
            </p>
            <ThingsToDoButton className="btn" style={{ padding: "8px 18px", fontSize: "11.5px" }}>
              Choose Experience Mode
            </ThingsToDoButton>
          </div>
        </Reveal>

        <div className="ttd-editorial-grid">
          {/* Option 1: Explore at Your Own Pace */}
          <Reveal className="ttd-editorial-card">
            <div className="ttd-editorial-media">
              <Image
                src={explore.modalImage}
                alt={explore.modalImageAlt}
                fill
                sizes="(max-width: 860px) 100vw, 50vw"
                className="ttd-editorial-img"
              />
            </div>
            <div className="ttd-editorial-body">
              <span className="ttd-editorial-tag">{explore.badge}</span>
              <h3 className="ttd-editorial-title">{explore.title}</h3>
              <p className="ttd-editorial-desc">{explore.cardDescription}</p>
              <div className="ttd-editorial-preview">{explore.categoryPreview}</div>
              <div className="ttd-editorial-action">
                <Link href={explore.route} className="btn solid">
                  {explore.ctaLabel} <span className="btn-arrow">→</span>
                </Link>
              </div>
            </div>
          </Reveal>

          {/* Option 2: Create Your Experience */}
          <Reveal className="ttd-editorial-card">
            <div className="ttd-editorial-media">
              <Image
                src={create.modalImage}
                alt={create.modalImageAlt}
                fill
                sizes="(max-width: 860px) 100vw, 50vw"
                className="ttd-editorial-img"
              />
            </div>
            <div className="ttd-editorial-body">
              <span className="ttd-editorial-tag">{create.badge}</span>
              <h3 className="ttd-editorial-title">{create.title}</h3>
              <p className="ttd-editorial-desc">{create.cardDescription}</p>
              <div className="ttd-editorial-preview">{create.categoryPreview}</div>
              <div className="ttd-editorial-action">
                <Link href={create.route} className="btn solid">
                  {create.ctaLabel} <span className="btn-arrow">→</span>
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
