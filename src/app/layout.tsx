import type { Metadata } from "next";
import { Bodoni_Moda, Inter } from "next/font/google";
import SmoothScroll from "@/components/layout/SmoothScroll";
import Header from "@/components/layout/Header";
import MenuOverlay from "@/components/layout/MenuOverlay";
import CartDrawer from "@/components/cart/CartDrawer";
import SearchOverlay from "@/components/layout/SearchOverlay";
import Footer from "@/components/layout/Footer";
import Providers from "@/components/providers/Providers";
import LoginModal from "@/components/auth/LoginModal";
import "./globals.css";

const bodoni = Bodoni_Moda({
  variable: "--font-bodoni-moda",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "BegOnShop",
  description: "Modern Luxury Bag E-commerce",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${bodoni.variable} ${inter.variable} antialiased`}
      >
        <Providers>
            <SmoothScroll>
                <Header />
                <MenuOverlay />
                <CartDrawer />
                <SearchOverlay />
                <LoginModal />
                <main className="pt-24 min-h-screen">
                    {children}
                </main>
                <Footer />
            </SmoothScroll>
        </Providers>
      </body>
    </html>
  );
}
