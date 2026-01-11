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

  // Determine text color: White on Home Hero (unscrolled), Black everywhere else (or when overlay open)
  const isHomeHero = pathname === "/" && !isScrolled && !isOverlayOpen;
  const textColorClass = isHomeHero ? "text-white mix-blend-difference" : "text-primary";

  return (
    <header
      className={clsx(
        "fixed top-0 left-0 w-full z-50 transition-all duration-500 border-b border-transparent",
        isScrolled && !isOverlayOpen ? "bg-canvas/80 backdrop-blur-md py-4 border-accent-subtle" : "bg-transparent py-6"
      )}
    >
      <div className={clsx(
        "max-w-[1920px] mx-auto px-6 md:px-12 flex justify-between items-center relative z-[100]",
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
