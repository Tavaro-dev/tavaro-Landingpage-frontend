"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import { Modal } from "@/components/ui/Modal";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { CartButton } from "@/features/booking/components/CartButton";
import { NAV_ITEMS } from "@/lib/nav";
import { DEMO_SERVICES } from "@/lib/env";
import styles from "./layout.module.css";

export default function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const showCart = DEMO_SERVICES && pathname === "/resorts/accommodations";
  const [pastPillarStrip, setPastPillarStrip] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navVisible = isHome ? pastPillarStrip : true;
  const noHero =
    pathname === "/resorts/accommodations" ||
    pathname.startsWith("/checkout") ||
    pathname === "/resorts/location" ||
    pathname.endsWith("/book");

  // The scrolled look is driven by <html data-scrolled>, set by the inline
  // script in app/layout.tsx so it is right before React hydrates.

  useEffect(() => {
    if (!isHome) return;

    if (typeof IntersectionObserver === "undefined") {
      const strip = document.querySelector(".hero .pillar-strip") ?? document.querySelector(".hero");
      if (!strip) return;
      const onScroll = () => {
        const threshold = strip.getBoundingClientRect().bottom + window.scrollY;
        setPastPillarStrip(window.scrollY >= threshold - 80);
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
      return () => window.removeEventListener("scroll", onScroll);
    }

    let heroObserver: IntersectionObserver | null = null;
    let mutationObserver: MutationObserver | null = null;
    let isCleanedUp = false;

    const observeTarget = (target: Element) => {
      heroObserver?.disconnect();
      heroObserver = new IntersectionObserver(
        ([entry]) => {
          const isPast = !entry.isIntersecting && entry.boundingClientRect.bottom <= 80;
          setPastPillarStrip(isPast);
        },
        { rootMargin: "-80px 0px 0px 0px" }
      );
      heroObserver.observe(target);
    };

    const target = document.querySelector(".hero .pillar-strip") ?? document.querySelector(".hero");
    if (target) {
      observeTarget(target);
    } else {
      mutationObserver = new MutationObserver(() => {
        if (isCleanedUp) return;
        const el = document.querySelector(".hero .pillar-strip") ?? document.querySelector(".hero");
        if (el) {
          mutationObserver?.disconnect();
          observeTarget(el);
        }
      });
      mutationObserver.observe(document.body, { childList: true, subtree: true });
    }

    return () => {
      isCleanedUp = true;
      heroObserver?.disconnect();
      mutationObserver?.disconnect();
    };
  }, [isHome, pathname]);

  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      <header
        className={[
          "site-header",
          isHome && "home",
          navVisible && "nav-visible",
          noHero && "no-hero"
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <Link href="/" className="logo">
          <span>
            <Icon name="logo" />
          </span>
          <span className={styles["logo-word"]}>TAVARO</span>
        </Link>
        <nav className={styles["main-nav"]}>
          <div className="nav-links">
            {NAV_ITEMS.map((item) => (
              <Link key={item.href} href={item.href} className={pathname === item.href || pathname.startsWith(`${item.href}/`) ? "active" : ""}>
                {item.label}
              </Link>
            ))}
          </div>
          <Link href="/about" className={`nav-cta${pathname === "/about" ? " active" : ""}`}>
            About
          </Link>
          <Link href="/contact" className="nav-cta outline">
            Enquire
          </Link>
          {showCart && <CartButton />}
          <ThemeToggle />
        </nav>
        <button
          type="button"
          className={`${styles["nav-toggle"]}${mobileOpen ? " open" : ""}`}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav"
          onClick={() => setMobileOpen((v) => !v)}
          suppressHydrationWarning
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </header>
      <Modal open={mobileOpen} onClose={closeMobile} label="Menu" bare exitMs={400}>
        <div id="mobile-nav" className={`${styles["mobile-nav"]}${mobileOpen ? " open" : ""}`}>
          <button type="button" className={styles["mobile-close-btn"]} aria-label="Close menu" onClick={closeMobile}>
            <Icon name="x" />
          </button>
          <Link href="/" onClick={closeMobile}>
            Home
          </Link>
          {NAV_ITEMS.map((item) => (
            <Link key={item.href} href={item.href} onClick={closeMobile}>
              {item.label}
            </Link>
          ))}
          <div className={styles["mobile-sub"]}>
            <div className={styles["mobile-sub-buttons"]}>
              <Link href="/about" className={`nav-cta${pathname === "/about" ? " active" : ""}`} onClick={closeMobile}>
                About
              </Link>
              <Link href="/contact" className="nav-cta outline" onClick={closeMobile}>
                Enquire
              </Link>
            </div>
            <div className={styles["mobile-sub-icons"]}>
              {showCart && <CartButton />}
              <ThemeToggle />
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
