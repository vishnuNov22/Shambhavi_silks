import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope, Italiana } from "next/font/google";
import "@/styles/base.css";
import "@/styles/layout.css";
import "@/styles/home.css";
import "@/styles/shop.css";
import { StoreProvider } from "@/lib/store";
import SmoothScroll from "@/components/layout/SmoothScroll";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/layout/CartDrawer";
import SearchOverlay from "@/components/layout/SearchOverlay";
import QuickView from "@/components/layout/QuickView";
import Cursor from "@/components/layout/Cursor";
import Toast from "@/components/layout/Toast";
import PetalsLayer from "@/components/layout/PetalsLayer";
import { SITE } from "@/data/site";

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});
const sans = Manrope({ subsets: ["latin"], weight: ["300", "400", "500", "600"], variable: "--font-sans", display: "swap" });
const display = Italiana({ subsets: ["latin"], weight: "400", variable: "--font-display", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: "Shambhavi Silks & Handlooms — Sarees, Lehengas & Bridal Couture, Marthandam", template: "%s · Shambhavi Silks" },
  description:
    "Silk sarees, designer lehengas, Anarkali gowns and bridal couture from Shambhavi Silks & Handlooms, Pammam, Marthandam. Being traditional is being classy.",
  openGraph: {
    title: "Shambhavi Silks & Handlooms",
    description: "Woven in tradition. Draped in elegance.",
    url: SITE.url,
    siteName: SITE.name,
    locale: "en_IN",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#160e10",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable} ${display.variable}`}>
      <body>
        <StoreProvider>
          <SmoothScroll />
          <Header />
          <main id="main">{children}</main>
          <Footer />
          <CartDrawer />
          <SearchOverlay />
          <QuickView />
          <Toast />
          <PetalsLayer />
          <Cursor />
        </StoreProvider>
      </body>
    </html>
  );
}
