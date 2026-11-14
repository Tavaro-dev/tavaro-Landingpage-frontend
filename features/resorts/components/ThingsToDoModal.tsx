"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/ui/Modal";
import { THINGS_TO_DO_DATA } from "../content/thingsToDoData";
import styles from "./ThingsToDoModal.module.css";

interface ThingsToDoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ThingsToDoModal({ isOpen, onClose }: ThingsToDoModalProps) {
  const router = useRouter();
  const handleSelectOption = (route: string) => {
    onClose();
    router.push(route);
  };

  const { explore, create } = THINGS_TO_DO_DATA;

  return (
    <Modal open={isOpen} onClose={onClose} labelledBy="ttd-modal-heading" bare>
      <div className={styles["ttd-modal-backdrop"]} onClick={onClose}>
        <div className={styles["ttd-modal-container"]} onClick={(e) => e.stopPropagation()}>
          <div className={styles["ttd-modal-top"]}>
            <div className={styles["ttd-modal-header-text"]}>
              <p className={styles["ttd-modal-eyebrow"]}>THE TAVARO EXPERIENCE</p>
              <h2 id="ttd-modal-heading" className={styles["ttd-modal-heading"]}>
                How would you like to spend your time?
              </h2>
            </div>
            <button
              type="button"
              className={styles["ttd-modal-close-btn"]}
              onClick={onClose}
              aria-label="Close modal"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <div className={styles["ttd-editorial-panels"]}>
            {/* Panel 1 — Explore at Your Own Pace */}
            <Link
              href={explore.route}
              className={styles["ttd-panel"]}
              onClick={(e) => {
                e.preventDefault();
                handleSelectOption(explore.route);
              }}
              aria-label={`${explore.title}: ${explore.cardDescription}`}
            >
              <Image
                src={explore.modalImage}
                alt={explore.modalImageAlt}
                fill
                sizes="(max-width: 860px) 100vw, 600px"
                loading="eager"
                className={styles["ttd-panel-img"]}
              />
              <div className={styles["ttd-panel-scrim"]} />
              <div className={styles["ttd-panel-content"]}>
                <span className={styles["ttd-panel-number"]}>01 — EXPLORE AT YOUR OWN PACE</span>
                <h3 className={styles["ttd-panel-title"]}>{explore.title}</h3>
                <p className={styles["ttd-panel-desc"]}>{explore.cardDescription}</p>
                <div className={styles["ttd-panel-pillars"]}>{explore.categoryPreview}</div>
                <div className={styles["ttd-panel-cta"]}>
                  <span>{explore.ctaLabel}</span>
                  <span className={styles["ttd-panel-arrow"]} aria-hidden="true">→</span>
                </div>
              </div>
            </Link>

            {/* Panel 2 — Create Your Experience */}
            <Link
              href={create.route}
              className={styles["ttd-panel"]}
              onClick={(e) => {
                e.preventDefault();
                handleSelectOption(create.route);
              }}
              aria-label={`${create.title}: ${create.cardDescription}`}
            >
              <Image
                src={create.modalImage}
                alt={create.modalImageAlt}
                fill
                sizes="(max-width: 860px) 100vw, 600px"
                loading="eager"
                className={styles["ttd-panel-img"]}
              />
              <div className={styles["ttd-panel-scrim"]} />
              <div className={styles["ttd-panel-content"]}>
                <span className={styles["ttd-panel-number"]}>02 — CREATE YOUR EXPERIENCE</span>
                <h3 className={styles["ttd-panel-title"]}>{create.title}</h3>
                <p className={styles["ttd-panel-desc"]}>{create.cardDescription}</p>
                <div className={styles["ttd-panel-pillars"]}>{create.categoryPreview}</div>
                <div className={styles["ttd-panel-cta"]}>
                  <span>{create.ctaLabel}</span>
                  <span className={styles["ttd-panel-arrow"]} aria-hidden="true">→</span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </Modal>
  );
}
