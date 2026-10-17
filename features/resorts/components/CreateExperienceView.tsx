"use client";

import { useState } from "react";
import { Reveal } from "@/components/shared/Reveal";
import { THINGS_TO_DO_DATA } from "../content/thingsToDoData";
import { ExperienceEnquiryModal } from "./ExperienceEnquiryModal";
import { HeroSquareTilesBackground } from "./HeroSquareTilesBackground";
import { ExpandingPanelsShowcase } from "./ExpandingPanelsShowcase";
import { CREATE_SHOWCASE_CATEGORIES } from "../content/showcaseData";
import StickyCta from "@/components/shared/StickyCta";

export function CreateExperienceView() {
  const { create } = THINGS_TO_DO_DATA;
  const [wellness, movement, createCat, gather] = create.categories;

  const createSlides = [
    {
      title: wellness.title,
      image: wellness.image,
      alt: wellness.imageAlt,
      tagline: wellness.tagline,
    },
    {
      title: movement.title,
      image: movement.image,
      alt: movement.imageAlt,
      tagline: movement.tagline,
    },
    {
      title: createCat.title,
      image: createCat.image,
      alt: createCat.imageAlt,
      tagline: createCat.tagline,
    },
    {
      title: gather.title,
      image: gather.image,
      alt: gather.imageAlt,
      tagline: gather.tagline,
    },
  ];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("General");

  const handleOpenEnquiry = (categoryTitle?: string) => {
    setSelectedCategory(categoryTitle || "General");
    setIsModalOpen(true);
  };

  return (
    <>
      <style>{`
        /* Editorial Luxury Tokens & Typography */
        .create-page {
          background: var(--surface);
          color: var(--on-surface);
          overflow-x: clip;
        }

        /* Hero Section */
        .create-hero {
          position: relative;
          min-height: 85vh;
          display: flex;
          align-items: flex-end;
          padding: clamp(80px, 12vh, 140px) 0 clamp(48px, 8vh, 80px);
          overflow: hidden;
        }

        .create-hero-media {
          position: absolute;
          inset: 0;
          z-index: 1;
        }

        .create-hero-overlay {
          position: absolute;
          inset: 0;
          z-index: 2;
          background: linear-gradient(
            to bottom,
            rgba(15, 13, 10, 0.4) 0%,
            rgba(15, 13, 10, 0.55) 45%,
            rgba(15, 13, 10, 0.9) 100%
          );
        }

        [data-theme="light"] .create-hero-overlay {
          background: linear-gradient(
            to bottom,
            rgba(15, 13, 10, 0.35) 0%,
            rgba(15, 13, 10, 0.58) 45%,
            rgba(15, 13, 10, 0.92) 100%
          );
        }

        .create-hero-content {
          position: relative;
          z-index: 3;
          max-width: 820px;
          color: #ffffff;
        }

        .create-breadcrumb {
          font-family: var(--font-sans, sans-serif);
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 20px;
        }

        .create-hero-eyebrow {
          display: inline-block;
          font-family: var(--font-sans, sans-serif);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--gold);
          margin-bottom: 16px;
        }

        .create-hero-title {
          font-family: var(--font-display, serif);
          font-size: clamp(42px, 6vw, 76px);
          font-weight: 300;
          line-height: 1.08;
          letter-spacing: 0.015em;
          color: #ffffff;
          margin-bottom: 20px;
        }

        .create-hero-desc {
          font-family: var(--font-display, serif);
          font-size: clamp(19px, 2.2vw, 26px);
          font-style: italic;
          font-weight: 400;
          line-height: 1.4;
          color: rgba(255, 255, 255, 0.88);
          max-width: 680px;
          margin-bottom: 20px;
        }

        .create-hero-notice {
          font-family: var(--font-sans, sans-serif);
          font-size: 12px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--gold);
          margin-bottom: 32px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .create-scroll-indicator {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          color: rgba(255, 255, 255, 0.7);
          text-decoration: none;
          font-family: var(--font-sans, sans-serif);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          transition: color 0.25s ease, transform 0.25s ease;
          padding: 8px 0;
        }

        .create-scroll-indicator:hover,
        .create-scroll-indicator:focus-visible {
          color: var(--gold);
          transform: translateY(3px);
          outline: none;
        }

        .create-scroll-arrow {
          font-size: 15px;
          line-height: 1;
          color: var(--gold);
          animation: floatArrow 2.4s ease-in-out infinite;
        }

        @keyframes floatArrow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(5px); }
        }

        @media (max-width: 640px) {
          .create-hero {
            min-height: 75vh;
            padding-bottom: 40px;
          }
        }
      `}</style>

      <div className="create-page">
        {/* SECTION 1: Editorial Hero with Continuous Small Square Boxes Animation */}
        <section className="create-hero" aria-label="Create Your Experience Hero">
          <div className="create-hero-media">
            <HeroSquareTilesBackground
              slides={createSlides}
              overlayClassName="create-hero-overlay"
            />
          </div>

          <div className="container">
            <Reveal className="create-hero-content">
              <div className="create-breadcrumb">
                Tavaro / Resorts / Things to Do / Create
              </div>
              <span className="create-hero-eyebrow">{create.eyebrow}</span>
              <h1 className="create-hero-title">{create.heading}</h1>
              <p className="create-hero-desc">{create.description}</p>
              <div className="create-hero-notice">{create.notice}</div>

              {/* Restrained scroll indicator */}
              <a
                href="#create-showcase"
                className="create-scroll-indicator"
                aria-label="Scroll to discover on-request experiences"
              >
                <span>Scroll to discover</span>
                <span className="create-scroll-arrow" aria-hidden="true">
                  ↓
                </span>
              </a>
            </Reveal>
          </div>
        </section>

        {/* SECTION 2: Expanding Panels Showcase (Hover, Scroll, and Click) */}
        <div id="create-showcase">
          <ExpandingPanelsShowcase
            mode="create"
            pageTitle={create.title}
            categories={CREATE_SHOWCASE_CATEGORIES}
            onEnquireCategory={handleOpenEnquiry}
            closing={{
              title: "Create Your Experience (On Request)",
              tagline:
                "Arrange something special with our team.",
              primaryBtnText: "Enquire About an Experience",
              onPrimaryBtnClick: () => handleOpenEnquiry("General"),
              secondaryBtnText: "Explore at Your Own Pace",
              secondaryBtnHref: "/resorts/things-to-do/explore",
            }}
          />
        </div>

        {/* Modal Enquiry Form */}
        <ExperienceEnquiryModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          initialCategory={selectedCategory}
        />

        <StickyCta
          text="Looking to arrange a bespoke on-request experience?"
          ctaLabel="Enquire on Request"
          ctaHref="#create-showcase"
          onCtaClick={() => handleOpenEnquiry("General")}
        />
      </div>
    </>
  );
}
