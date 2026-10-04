import type { Metadata } from "next";
import localFont from "next/font/local";
import { ThemeProvider } from "next-themes";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { PageTransition } from "@/components/PageTransition";
import { CartDrawer } from "@/components/CartDrawer";
import { CartProvider } from "@/lib/cart";
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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${hypatia.variable} ${archivo.variable}`} suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="data-theme" defaultTheme="dark" enableSystem={false}>
          <CartProvider>
            <Header />
            <PageTransition>{children}</PageTransition>
            <Footer />
            <CartDrawer />
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
