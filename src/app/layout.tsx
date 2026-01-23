import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import SmoothScroll from "@/components/layout/SmoothScroll";
import Header from "@/components/layout/Header";
import MenuOverlay from "@/components/layout/MenuOverlay";
import CartDrawer from "@/components/cart/CartDrawer";
import SearchOverlay from "@/components/layout/SearchOverlay";
import Footer from "@/components/layout/Footer";
import Providers from "@/components/providers/Providers";
import LoginModal from "@/components/auth/LoginModal";
import "./globals.css";
import { APP_CONFIG } from "@/lib/constants";

const playfair = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: APP_CONFIG.BRAND_NAME,
  description: APP_CONFIG.DESCRIPTION,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${playfair.variable} ${inter.variable} antialiased`}
      >
        <Providers>
            <SmoothScroll>
                <Header />
                <MenuOverlay />
                <CartDrawer />
                <SearchOverlay />
                <main className="pt-16 min-h-screen">
                    {children}
                </main>
                <Footer />
            </SmoothScroll>
        </Providers>
      </body>
    </html>
  );
}
