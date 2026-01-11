"use client";

import { useUIStore } from "@/store/ui-store";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function SearchOverlay() {
  const { isSearchOpen, closeSearch } = useUIStore();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isSearchOpen]);

  const trendingItems = [
    { name: "New Arrivals", href: "/collections/new-arrivals" },
    { name: "Signature Bags", href: "/collections/signature" },
    { name: "Leather Goods", href: "/collections/leather" },
    { name: "Accessories", href: "/collections/accessories" },
  ];

  const popularSearches = ["Tote Bag", "Crossbody", "Clutch", "Weekender", "Travel"];

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
          className="fixed inset-0 z-[100] bg-white"
        >
          {/* Full Width Container */}
          <div className="h-full w-full px-8 md:px-16 lg:px-24 pt-10 pb-12 flex flex-col">
            
            {/* Header Row */}
            <div className="flex justify-between items-center mb-20">
              <span className="font-utility text-[11px] font-medium uppercase tracking-[0.25em] text-neutral-500">Search</span>
              <button 
                onClick={closeSearch} 
                className="font-utility text-[11px] font-medium uppercase tracking-[0.25em] text-black hover:opacity-60 transition-opacity"
              >
                Close
              </button>
            </div>

            {/* Search Input - Full Width */}
            <div className="mb-20">
              <motion.div
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="relative"
              >
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="What are you looking for?"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full bg-transparent font-display text-4xl md:text-6xl lg:text-7xl text-black placeholder:text-neutral-400 focus:outline-none border-b border-neutral-200 pb-6 transition-colors focus:border-black"
                />
              </motion.div>
            </div>

            {/* Wide Grid Layout */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="flex-1 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-12 lg:gap-20"
            >
              {/* Trending Column */}
              <div>
                <p className="font-utility text-[11px] font-medium text-neutral-500 uppercase tracking-[0.25em] mb-8">Trending</p>
                <div className="flex flex-col gap-5">
                  {trendingItems.map((item, i) => (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + i * 0.05, duration: 0.5 }}
                    >
                      <Link 
                        href={item.href}
                        onClick={closeSearch}
                        className="font-display text-2xl md:text-3xl lg:text-4xl text-black hover:opacity-50 transition-opacity block"
                      >
                        {item.name}
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Popular Searches Column */}
              <div>
                <p className="font-utility text-[11px] font-medium text-neutral-500 uppercase tracking-[0.25em] mb-8">Popular</p>
                <div className="flex flex-col gap-5">
                  {popularSearches.map((term, i) => (
                    <motion.button
                      key={term}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.35 + i * 0.05, duration: 0.5 }}
                      onClick={() => setQuery(term)}
                      className="font-display text-2xl md:text-3xl lg:text-4xl text-neutral-400 hover:text-black transition-colors text-left"
                    >
                      {term}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Featured Image - Spans 2 columns on large */}
              <div className="lg:col-span-2 hidden md:block">
                <p className="font-utility text-[11px] font-medium text-neutral-500 uppercase tracking-[0.25em] mb-8">Featured</p>
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                  className="relative aspect-[16/9] bg-neutral-100 overflow-hidden group cursor-pointer"
                >
                  <Image
                    src="https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1935&auto=format&fit=crop"
                    alt="Featured Luxury Bag"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-black/20" />
                  <Link 
                    href="/collections/new-arrivals"
                    onClick={closeSearch}
                    className="absolute bottom-6 left-6 font-utility text-[11px] font-medium uppercase tracking-[0.2em] bg-black text-white px-5 py-3 hover:bg-neutral-800 transition-colors"
                  >
                    Shop New Arrivals
                  </Link>
                </motion.div>
              </div>
            </motion.div>

            {/* Footer */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-auto pt-10 flex justify-between items-center border-t border-neutral-100"
            >
              <div className="flex gap-8">
                <a href="#" className="font-utility text-[11px] font-medium uppercase tracking-[0.2em] text-neutral-400 hover:text-black transition-colors">Instagram</a>
                <a href="#" className="font-utility text-[11px] font-medium uppercase tracking-[0.2em] text-neutral-400 hover:text-black transition-colors">TikTok</a>
              </div>
              <p className="font-utility text-[11px] font-medium uppercase tracking-[0.2em] text-neutral-300">Velancis © 2026</p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
