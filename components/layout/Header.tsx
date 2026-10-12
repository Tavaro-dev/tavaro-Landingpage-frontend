"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { CartButton } from "@/features/booking/components/CartButton";
import { NAV_ITEMS } from "@/lib/nav";

export default function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const showCart = pathname === "/resorts/accommodations";
  const [scrolled, setScrolled] = useState(false);
  const [pastPillarStrip, setPastPillarStrip] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navVisible = isHome ? pastPillarStrip : true;
  const noHero =
    pathname === "/resorts/accommodations" ||
    pathname.startsWith("/checkout") ||
    pathname === "/resorts/location" ||
    pathname === "/resorts/photos" ||
    pathname.endsWith("/book");

  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const topSentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinel = topSentinelRef.current;
    if (!sentinel) return;

    if (typeof IntersectionObserver === "undefined") {
      const onScroll = () => setScrolled(window.scrollY > 40);
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
      return () => window.removeEventListener("scroll", onScroll);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setScrolled(!entry.isIntersecting);
      },
      { threshold: 0 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

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

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
      requestAnimationFrame(() => closeBtnRef.current?.focus());
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileOpen(false);
        triggerRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen]);

  const closeMobile = () => {
    setMobileOpen(false);
    triggerRef.current?.focus();
  };

  return (
    <>
      <div
        ref={topSentinelRef}
        aria-hidden="true"
        className="header-scroll-sentinel"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "40px",
          pointerEvents: "none",
          visibility: "hidden",
        }}
      />
      <header
        className={[
          "site-header",
          isHome && "home",
          scrolled && "scrolled",
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
          <span className="logo-word">TAVARO</span>
        </Link>
        <nav className="main-nav">
          <div className="nav-links">
            {NAV_ITEMS.map((item) => (
              <Link key={item.href} href={item.href} className={pathname === item.href ? "active" : ""}>
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
          ref={triggerRef}
          className={`nav-toggle${mobileOpen ? " open" : ""}`}
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
      <div id="mobile-nav" className={`mobile-nav${mobileOpen ? " open" : ""}`} aria-hidden={!mobileOpen}>
        <button type="button" ref={closeBtnRef} className="mobile-close-btn" aria-label="Close menu" onClick={closeMobile}>
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
        <div className="mobile-sub">
          <div className="mobile-sub-buttons">
            <Link href="/about" className={`nav-cta${pathname === "/about" ? " active" : ""}`} onClick={closeMobile}>
              About
            </Link>
            <Link href="/contact" className="nav-cta outline" onClick={closeMobile}>
              Enquire
            </Link>
          </div>
          <div className="mobile-sub-icons">
            {showCart && <CartButton />}
            <ThemeToggle />
          </div>
        </div>
      </div>
    </>
  );
}
