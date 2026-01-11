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
  const { toggleMenu, isMenuOpen, openCart, openSearch, isSearchOpen, isCartOpen } = useUIStore();
  const { items } = useCartStore();
  const { isAuthenticated, user, logout } = useAuthStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 30);
  });

  // Page context
  const isLoginPage = pathname === "/login";
  const isOverlayOpen = isMenuOpen || isCartOpen || isSearchOpen;

  // iOS 26 Ultra Glass Effect
  // - High backdrop-blur with saturation boost
  // - Very subtle semi-transparent background
  // - Thin bottom border with vibrancy
  // - Subtle shadow glow
  
  const headerClasses = clsx(
    "fixed top-0 left-0 w-full z-50 transition-all duration-500",
    isLoginPage && !isOverlayOpen
      ? "bg-black/80 backdrop-blur-3xl backdrop-saturate-200" // Dark glass for login
      : [
          "bg-white/60 backdrop-blur-2xl backdrop-saturate-200",
          "border-b border-white/30",
          "shadow-[0_1px_3px_rgba(0,0,0,0.05),inset_0_1px_0_rgba(255,255,255,0.6)]" // iOS inner highlight
        ]
  );

  const textColorClass = clsx(
    isLoginPage && !isOverlayOpen ? "text-white" : "text-[#1d1d1f]"
  );

  return (
    <header className={headerClasses}>
      <div className={clsx(
        "max-w-[1920px] mx-auto px-6 md:px-12 py-4 flex justify-between items-center relative",
        textColorClass
      )}>
        {/* Left: Menu Trigger */}
        <button
          onClick={toggleMenu}
          className={clsx(
            "font-utility text-[11px] font-medium tracking-widest uppercase transition-opacity hover:opacity-60",
            isOverlayOpen && !isLoginPage ? "text-[#1d1d1f]" : ""
          )}
        >
          {isMenuOpen ? "Close" : "Menu"}
        </button>

        {/* Center: Logo */}
        <Link href="/" className="absolute left-1/2 -translate-x-1/2">
          <h1 className="font-display text-xl md:text-2xl tracking-tight font-medium">
            Velancis
          </h1>
        </Link>

        {/* Right: Actions */}
        <div className="flex gap-5 items-center">
          <button 
            onClick={openSearch}
            className="font-utility text-[11px] font-medium tracking-widest uppercase hidden md:block transition-opacity hover:opacity-60"
          >
            Search
          </button>
          <button 
            onClick={openCart}
            className="font-utility text-[11px] font-medium tracking-widest uppercase transition-opacity hover:opacity-60"
          >
            Bag ({items.length})
          </button>
          
          {isAuthenticated ? (
            <button
              onClick={() => logout()}
              className="font-utility text-[11px] font-medium tracking-widest uppercase transition-opacity hover:opacity-60"
              title={user?.email}
            >
              Account
            </button>
          ) : (
            <Link 
              href="/login"
              className="font-utility text-[11px] font-medium tracking-widest uppercase transition-opacity hover:opacity-60"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
