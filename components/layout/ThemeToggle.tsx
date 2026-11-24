"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { ROOT_DOMAIN } from "@/lib/subdomains";
import styles from "./layout.module.css";

const emptySubscribe = () => () => {};

export function ThemeToggle({ className }: { className?: string }) {
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const { resolvedTheme, setTheme } = useTheme();

  if (!mounted) {
    // Return a placeholder with the same dimensions to avoid layout shift
    return <button type="button" className={`${styles["theme-toggle"]} ${className ?? ""}`.trim()} aria-hidden="true" />;
  }

  const toggle = () => {
    const next = resolvedTheme === "dark" ? "light" : "dark";
    setTheme(next);
    // Each subdomain keeps its own copy of the choice; this cookie carries it to the others (app/layout.tsx).
    if (ROOT_DOMAIN) {
      document.cookie = `theme=${next}; domain=${ROOT_DOMAIN.split(":")[0]}; path=/; max-age=31536000; samesite=lax`;
    }
  };

  return (
    <button
      type="button"
      className={`${styles["theme-toggle"]} ${className ?? ""}`.trim()}
      onClick={toggle}
      aria-label={resolvedTheme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      {resolvedTheme === "dark" ? (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.4" />
          <path
            d="M12 1.5v3M12 19.5v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M1.5 12h3M19.5 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5Z"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  );
}
