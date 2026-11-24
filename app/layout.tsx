// Global styles first: every CSS Module must load after them to override them.
import "./globals.css";
import type { Metadata } from "next";
import localFont from "next/font/local";
import { ThemeProvider } from "next-themes";
import { HeroPrefetch } from "@/components/shared/HeroPrefetch";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { CartDrawer } from "@/features/booking/components/CartDrawer";
import { RegisterInterestModal } from "@/features/residences/components/RegisterInterestModal";
import { CartProvider } from "@/features/booking/cart/CartProvider";
import { SITE_URL } from "@/lib/metadata";

// Fonts are subset to the characters the site uses (Latin, Latin-1/Extended-A, punctuation, arrows, rupee, check)
// with their standard OpenType features, as WOFF2: about 69 KB for all three instead of about 295 KB. Re-subset from the
// originals in git history if a page needs another script or a stylistic set.
const hypatia = localFont({
  src: "./fonts/HypatiaSansPro-SemiBold.woff2",
  weight: "600",
  style: "normal",
  variable: "--font-hypatia",
  display: "swap",
});

const archivo = localFont({
  src: [
    { path: "./fonts/ArchivoExpanded-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/ArchivoExpanded-SemiBold.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-archivo",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Tavaro — Discover the World Between Worlds",
    template: "%s",
  },
  description:
    "Tavaro is a hospitality and lifestyle group creating places and experiences around a more meaningful way of living — Resorts, Residences, Experiences, Wellness and Màre.",
};

// Sets <html data-scrolled> once the page is past 40px, before first paint and
// without waiting for React. The header's scrolled look keys off it, so it is
// right even while the page hydrates, including when the browser restores a
// scroll position on reload.
const SCROLL_STATE_SCRIPT = `(function(){var d=document.documentElement;function u(){d.toggleAttribute("data-scrolled",window.scrollY>40)}u();window.addEventListener("scroll",u,{passive:true})})()`;

// The light/dark choice, carried between subdomains by a cookie on the whole domain (ThemeToggle sets it).
const THEME_FROM_COOKIE_SCRIPT = `try{var m=document.cookie.match(/(?:^|; )theme=(light|dark)/);if(m)localStorage.setItem("theme",m[1])}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-IN"
      className={`${hypatia.variable} ${archivo.variable}`}
      suppressHydrationWarning
      data-scroll-behavior="smooth"
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: SCROLL_STATE_SCRIPT }} />
        {/* Before next-themes reads its saved choice: take the one made on another subdomain. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_FROM_COOKIE_SCRIPT }} />
      </head>
      <body>
        <ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem={true}>
          <CartProvider>
            <Header />
            {children}
            <HeroPrefetch />
            <Footer />
            <CartDrawer />
            <RegisterInterestModal />
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
