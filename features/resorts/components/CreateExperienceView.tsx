"use client";

import { useState } from "react";
import { Reveal } from "@/components/shared/Reveal";
import { THINGS_TO_DO_DATA } from "../content/thingsToDoData";
import { ExperienceEnquiryModal } from "./ExperienceEnquiryModal";
import { HeroSquareTilesBackground } from "./HeroSquareTilesBackground";
import { ExpandingPanelsShowcase } from "./ExpandingPanelsShowcase";
import { CREATE_SHOWCASE_CATEGORIES } from "../content/showcaseData";
import StickyCta from "@/components/shared/StickyCta";
import "./CreateExperienceView.css";

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
