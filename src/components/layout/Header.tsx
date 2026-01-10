"use client";

import Link from "next/link";
import { useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";
import { useUIStore } from "@/store/ui-store";
import { useCartStore } from "@/store/cart-store";
import clsx from "clsx";

export default function Header() {
  const { toggleMenu, isMenuOpen, openCart } = useUIStore();
  const { items } = useCartStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 50) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  });

  return (
    <header
      className={clsx(
        "fixed top-0 left-0 w-full z-50 transition-all duration-500 border-b border-transparent",
        isScrolled ? "bg-canvas/80 backdrop-blur-md py-4 border-accent-subtle" : "bg-transparent py-6"
      )}
    >
      <div className="max-w-[1920px] mx-auto px-6 md:px-12 flex justify-between items-center">
        {/* Left: Menu Trigger */}
        <button
          onClick={toggleMenu}
          className="font-utility text-xs tracking-widest uppercase hover:underline underline-offset-4"
        >
          {isMenuOpen ? "Close" : "Menu"}
        </button>

        {/* Center: Logo */}
        <Link href="/" className="absolute left-1/2 -translate-x-1/2">
          <h1 className="font-display text-2xl md:text-4xl tracking-tight font-bold">
            BegOnShop
          </h1>
        </Link>

        {/* Right: Actions */}
        <div className="flex gap-6 items-center">
            <button className="font-utility text-xs tracking-widest uppercase hidden md:block">
                Search
            </button>
            <button 
                onClick={openCart}
                className="font-utility text-xs tracking-widest uppercase"
            >
                Bag ({items.length})
            </button>
        </div>
      </div>
    </header>
  );
}
