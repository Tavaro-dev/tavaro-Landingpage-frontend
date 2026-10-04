"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function StickyCta({
  text,
  ctaLabel,
  ctaHref,
}: {
  text: string;
  ctaLabel: string;
  ctaHref: string;
}) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.9);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Reserve space below the footer on mobile so the fixed bar never
  // permanently covers the footer's bottom copyright/legal row.
  useEffect(() => {
    document.body.classList.add("has-sticky-cta");
    return () => document.body.classList.remove("has-sticky-cta");
  }, []);

  return (
    <div className={`sticky-cta${show ? " show" : ""}`}>
      <span>{text}</span>
      <Link href={ctaHref} className="btn solid">
        {ctaLabel}
      </Link>
    </div>
  );
}
