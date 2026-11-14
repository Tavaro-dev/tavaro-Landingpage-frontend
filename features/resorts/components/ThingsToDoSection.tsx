"use client";

import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/shared/Reveal";
import { OfferHead } from "@/components/shared/OfferHead";
import { THINGS_TO_DO_DATA } from "../content/thingsToDoData";
import { ThingsToDoButton } from "./ThingsToDoButton";
import "./ThingsToDoSection.css";

export function ThingsToDoSection() {
  const { explore, create } = THINGS_TO_DO_DATA;

  return (
    <section className="offer-block on-dark things-to-do-section" id="things-to-do">

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
