"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "./Icon";
import { ThemeToggle } from "./ThemeToggle";
import { CartButton } from "./CartButton";
import { NAV_ITEMS } from "@/lib/nav";

export default function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const showCart = pathname === "/resorts/accommodations";
  const [scrolled, setScrolled] = useState(false);
  const [pastPillarStrip, setPastPillarStrip] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navVisible = isHome ? pastPillarStrip : true;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!isHome) return;
    const strip = document.querySelector(".hero .pillar-strip") ?? document.querySelector(".hero");
    if (!strip) return;
    const onScroll = () => {
      const threshold = strip.getBoundingClientRect().bottom + window.scrollY;
      setPastPillarStrip(window.scrollY >= threshold - 80);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [isHome]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
  }, [mobileOpen]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen]);

  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      <header
        className={[
          "site-header",
          isHome && "home",
          scrolled && "scrolled",
          navVisible && "nav-visible",
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
            <Link href="/about" className={pathname === "/about" ? "active" : ""}>
              About
            </Link>
          </div>
          <Link href="/contact" className="nav-cta">
            Enquire
          </Link>
          {showCart && <CartButton />}
          <ThemeToggle />
        </nav>
        <button
          className={`nav-toggle${mobileOpen ? " open" : ""}`}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav"
          onClick={() => setMobileOpen((v) => !v)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </header>
      <div id="mobile-nav" className={`mobile-nav${mobileOpen ? " open" : ""}`} aria-hidden={!mobileOpen}>
        <Link href="/" onClick={closeMobile}>
          Home
        </Link>
        {NAV_ITEMS.map((item) => (
          <Link key={item.href} href={item.href} onClick={closeMobile}>
            {item.label}
          </Link>
        ))}
        <Link href="/about" onClick={closeMobile}>
          About
        </Link>
        <div className="mobile-sub">
          <Link href="/contact" onClick={closeMobile}>
            Contact
          </Link>
          <Link href="/contact" onClick={closeMobile}>
            Enquire
          </Link>
          {showCart && <CartButton />}
          <ThemeToggle />
        </div>
      </div>
    </>
  );
}
