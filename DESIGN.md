# Tavaro Frontend Design System

This document outlines the visual identity, tokens, and CSS conventions for the Tavaro frontend repository. It serves as the single source of truth for design constraints to ensure that all future component implementations and UI fixes adhere strictly to the client's approved brand guidelines.

## 1. Brand Identity and Design Principles

The Tavaro brand embodies "a hospitality and lifestyle group creating places and experiences around a more meaningful way of living." The visual identity relies on:
- High contrast, elegant colorways (primarily Dark Theme with Light variations).
- Expansive, airy typography using a structured typographic hierarchy.
- Smooth, deliberate micro-interactions (`var(--ease) = cubic-bezier(0.22, 0.61, 0.36, 1)`).
- Full-bleed rich imagery overlaid with readable, branded typography.

## 2. Color Palette & Semantic Color Tokens

Colors are defined natively in `app/globals.css` and injected into Tailwind CSS via the `@theme inline` configuration.

### Base Palette
*   **Black:** `#0a0908` (`--black`) / **Near Black:** `#131210` (`--near-black`) / **Panel:** `#1a1815` (`--panel`)
*   **Cream:** `#f7f2e7` (`--cream`) / **Cream 2:** `#efe7d4` (`--cream-2`)
*   **Paper:** `#f6f2ea` (`--paper`) / **Paper 2:** `#eee6d6` (`--paper-2`)
*   **Ink:** `#1c1712` (`--ink`) / **Ink Soft:** `#3a332a` (`--ink-soft`)
*   **Gold (Primary Accent):** `#c9a45a` (`--gold`)
*   **Gold Light:** `#e6cf9e` (`--gold-light`) / **Gold Dark:** `#9c7c3e` (`--gold-dark`)

### Semantic Theme Tokens (Dark Mode Default)
*   `--surface`: Background color (Dark: `--black`, Light: `--cream`)
*   `--on-surface`: Primary text color (Dark: `--cream`, Light: `--ink`)
*   `--on-surface-muted`: Secondary text (Dark: `--muted-on-dark`, Light: `--muted-on-light`)
*   `--surface-line`: Border/divider color (`--line-dark` vs `rgba(156, 124, 62, 0.75)`)

## 3. Typography & Font Hierarchy

Fonts are loaded locally via `next/font/local` in `app/layout.tsx`.
*   **Display Font (`--font-hypatia`):** Hypatia Sans Pro (SemiBold). Used primarily for headers (`h1`-`h4`), logo, and prominent hero text.
*   **Sans Font (`--font-archivo`):** Archivo Expanded (Regular, SemiBold). Used for body text, buttons, and navigation.

### Type Scale Classes (`app/globals.css`)
*   `.display-1`: `clamp(42px, 7vw, 96px)`
*   `.display-2`: `clamp(34px, 4.6vw, 64px)`
*   `.display-3`: `clamp(26px, 3vw, 40px)`
*   `.eyebrow`: 11px Archivo Expanded, bold, `0.32em` tracking, uppercase with an inline gold line.
*   `.lede`: `clamp(16px, 1.6vw, 20px)` for prominent body copy.

## 4. Spacing, Sizing, and Layout Conventions

*   **Container Width:** Max width of `1360px` (`--container`).
*   **Padding X:** Responsive horizontal padding `clamp(24px, 5vw, 80px)` (`--pad`).
*   **Section Y Padding:** Regular sections use `clamp(40px, 5vw, 72px) 0` padding (`.section`). Tight sections use `clamp(32px, 4vw, 56px) 0` (`.section.tight`).

## 5. Responsive Breakpoints

*   Desktop is the primary design canvas.
*   The established breakpoint for forced mobile behaviors (e.g., hover states on buttons) is `@media (max-width: 768px)` inside `globals.css`.
*   Tailwind's default breakpoints (`sm:`, `md:`, `lg:`, `xl:`) are used for component-level grid/flex wrapping.

## 6. Buttons, Links, and Calls to Action

*   **Primary Button (`.btn`)**: Uppercase, `12px`, `0.22em` tracking, transparent background with a 1px solid gold border. 
*   **Hover State**: Fill transitions to solid gold from the left, text turns black.
*   **Solid Button (`.btn.solid`)**: Solid gold background by default, inverts on hover.
*   **Navigation CTA (`.nav-cta`)**: Fixed size (`124px x 40px`), solid background or outline (`.nav-cta.outline`).

## 7. Navigation, Header, and Footer

*   **Header (`.site-header`)**: Fixed at top, `z-index: 1000`. Starts transparent, and upon scrolling (`.scrolled`) gains a dark blurred background (`rgba(10, 9, 8, 0.86)` with `backdrop-filter: blur(14px)`).
*   **Mobile Navigation (`.mobile-nav`)**: Fixed full-screen overlay (`z-index: 1050`), uses large Display Font for primary links.

---

## Existing Design Inconsistencies (Audit Findings)

Based on the visual audit conducted on 2026-10-10, the following responsive and UI defects are recorded. *Do not implement fixes for these until explicitly instructed.*

1. **Issue 1: Horizontal overflow in mobile pillar navigation.**
   - *Problem:* At `375px`, the bottom-anchored "Pillar" navigation (Resorts, Residences, etc.) overflows the screen bounds horizontally, causing text clipping and page overflow. 
   - *Affected Component:* Homepage (`/`) and related pillar navigation bars.
   - *Proposed Direction:* Allow horizontal scrolling within the navigation container (`overflow-x-auto`) to keep the page layout within the viewport bounds.

2. **Issue 2: Inconsistent mobile hero CTA button widths and spacing.**
   - *Problem:* Mobile hero buttons stack unevenly with mismatched widths and tight vertical spacing.
   - *Affected Component:* Hero Sections (e.g., Homepage).
   - *Proposed Direction:* Apply full width (`w-full`) to both buttons on mobile breakpoints with consistent vertical gap spacing.

3. **Issue 3: Mobile menu secondary button sizing and layout.**
   - *Problem:* The "ABOUT" and "ENQUIRE" buttons sit side-by-side in the mobile menu, appearing disproportionately small.
   - *Affected Component:* Mobile Navigation Drawer.
   - *Proposed Direction:* Stack these secondary buttons vertically on mobile for a larger, consistent tap target.

4. **Issue 4: Contact form input padding and baseline alignment.**
   - *Problem:* Inputted text in form fields floats noticeably high above the bottom border.
   - *Affected Component:* Contact Page (`/contact`).
   - *Proposed Direction:* Adjust the input `padding-bottom` to ensure text anchors cleanly to the line.

5. **Issue 5: Header contrast over complex hero imagery.**
   - *Problem:* The transparent header text occasionally clashes with bright hero image areas before the user scrolls.
   - *Affected Component:* Global Header / Hero Components.
   - *Proposed Direction:* Introduce a subtle vertical gradient overlay (scrim) to the top of hero images.

## Rules for Future Frontend Modifications

1. Do not invent new color tokens or add raw hex values to `.tsx` files; rely strictly on `var(--)` and the Tailwind classes mapped in `@theme inline`.
2. Do not introduce new font families.
3. Ensure all responsive fixes preserve the existing `1440px` Desktop layout.
4. Distinguish objective frontend bugs (like overflow and inaccessible elements) from subjective visual opinions. 
5. Backend/API integrations remain strictly out-of-scope for this repository.
