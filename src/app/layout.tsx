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
  title: "Velancis",
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
        className={`${playfair.variable} ${inter.variable} antialiased`}
      >
        <Providers>
            <SmoothScroll>
                <Header />
                <MenuOverlay />
                <CartDrawer />
                <SearchOverlay />
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
