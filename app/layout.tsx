import type { Metadata } from "next";
import localFont from "next/font/local";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { PageTransition } from "@/components/PageTransition";
import { SITE_URL } from "@/lib/metadata";
import "./globals.css";

const hypatia = localFont({
  src: "./fonts/HypatiaSansPro-SemiBold.otf",
  weight: "600",
  style: "normal",
  variable: "--font-hypatia",
  display: "swap",
});

const archivo = localFont({
  src: [
    { path: "./fonts/ArchivoExpanded-Regular.ttf", weight: "400", style: "normal" },
    { path: "./fonts/ArchivoExpanded-SemiBold.ttf", weight: "600", style: "normal" },
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

// Runs before hydration so the correct theme is applied before first paint —
// prevents a flash of the wrong theme when the user has chosen "light".
const THEME_INIT_SCRIPT = `try{if(localStorage.getItem('tavaro-theme')==='light')document.documentElement.setAttribute('data-theme','light')}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${hypatia.variable} ${archivo.variable}`} suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <Header />
        <PageTransition>{children}</PageTransition>
        <Footer />
      </body>
    </html>
  );
}
