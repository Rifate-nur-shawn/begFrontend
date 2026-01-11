"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";
import { useUIStore } from "@/store/ui-store";
import { useCartStore } from "@/store/cart-store";
import { useAuthStore } from "@/store/auth-store";
import clsx from "clsx";

export default function Header() {
  const pathname = usePathname();
  const { toggleMenu, isMenuOpen, openCart, openSearch, isSearchOpen, isCartOpen, openLogin } = useUIStore();
  const { items } = useCartStore();
  const { isAuthenticated, user, logout } = useAuthStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 50) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  });

  // Calculate if any overlay is open (Menu, Cart, Search)
  const isOverlayOpen = isMenuOpen || isCartOpen || isSearchOpen;

  // Luxury Brand Logic:
  // 1. Top of Homepage (Hero): Transparent BG, White Text.
  // 2. Top of Internal Pages: Transparent BG, Black Text (assuming white pages).
  // 3. Scrolled (Anywhere): Solid Black BG, White Text, Reduced vertical padding.
  
  // Logic helpers
  const isHomePage = pathname === "/";
  const isScrolledState = isScrolled && !isOverlayOpen;

  // Text Color Logic
  let textColorClass = "text-primary"; // Default (Black)
  
  if (isScrolledState) {
      textColorClass = "text-white"; // White when scrolled (on Black BG)
  } else if (isHomePage) {
      textColorClass = "text-white"; // White on Home Hero
  } else if (isOverlayOpen) {
      textColorClass = "text-primary"; // Black on white overlay
  } 
  // Else (Internal page at top) -> Default Black

  return (
    <header
      className={clsx(
        "fixed top-0 left-0 w-full z-50 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] border-b border-transparent",
        isScrolledState 
            ? "bg-[#050505] py-4 shadow-[0_1px_0_0_rgba(255,255,255,0.1)]" // Premium Dark
            : "bg-transparent py-8" // Spacious at top
      )}
    >
      <div className={clsx(
        "max-w-[1920px] mx-auto px-6 md:px-12 flex justify-between items-center relative z-[100] transition-colors duration-500",
        textColorClass
      )}>
        {/* Left: Menu Trigger */}
        <button
          onClick={toggleMenu}
          className="font-utility text-xs tracking-widest uppercase hover:underline underline-offset-4"
        >
          {isMenuOpen ? "Close" : "Menu"}
        </button>

        {/* Center: Logo - Hide if overlay is open on mobile to avoid clutter, or keep it. Keeping it. */}
        <Link href="/" className="absolute left-1/2 -translate-x-1/2">
          <h1 className="font-display text-2xl md:text-4xl tracking-tight font-bold">
            BegOnShop
          </h1>
        </Link>

        {/* Right: Actions */}
        <div className="flex gap-6 items-center">
            <button 
                onClick={openSearch}
                className="font-utility text-xs tracking-widest uppercase hidden md:block hover:underline underline-offset-4"
            >
                Search
            </button>
            <button 
                onClick={openCart}
                className="font-utility text-xs tracking-widest uppercase"
            >
                Bag ({items.length})
            </button>
            
             {isAuthenticated ? (
                <button
                    onClick={() => logout()}
                    className="font-utility text-xs tracking-widest uppercase hover:underline underline-offset-4 text-accent-alert"
                    title={user?.email}
                >
                    Logout
                </button>
            ) : (
                <button 
                    onClick={openLogin}
                    className="font-utility text-xs tracking-widest uppercase hover:underline underline-offset-4"
                >
                    Login
                </button>
            )}
        </div>
      </div>
    </header>
  );
}
