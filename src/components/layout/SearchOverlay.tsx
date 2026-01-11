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

  const popularSearches = ["Tote", "Crossbody", "Clutch", "Weekender"];

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] bg-white overflow-auto"
        >
          <div className="max-w-6xl mx-auto px-6 md:px-12 py-8">
            
            {/* Header */}
            <div className="flex justify-between items-center mb-12">
              <span className="font-utility text-[10px] uppercase tracking-[0.2em] text-neutral-400">Search</span>
              <button 
                onClick={closeSearch} 
                className="font-utility text-[10px] uppercase tracking-[0.2em] text-neutral-500 hover:text-black transition-colors"
              >
                Close
              </button>
            </div>

            {/* Search Input */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="mb-12"
            >
              <input
                ref={inputRef}
                type="text"
                placeholder="Search..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-transparent font-display text-3xl md:text-4xl text-black placeholder:text-neutral-300 focus:outline-none border-b border-neutral-200 pb-4 transition-colors focus:border-black"
              />
            </motion.div>

            {/* Grid Layout */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12"
            >
              {/* Trending */}
              <div>
                <p className="font-utility text-[10px] text-neutral-400 uppercase tracking-[0.2em] mb-5">Trending</p>
                <div className="flex flex-col gap-3">
                  {trendingItems.map((item) => (
                    <Link 
                      key={item.name}
                      href={item.href}
                      onClick={closeSearch}
                      className="font-display text-lg text-black hover:opacity-50 transition-opacity"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Popular */}
              <div>
                <p className="font-utility text-[10px] text-neutral-400 uppercase tracking-[0.2em] mb-5">Popular</p>
                <div className="flex flex-col gap-3">
                  {popularSearches.map((term) => (
                    <button
                      key={term}
                      onClick={() => setQuery(term)}
                      className="font-display text-lg text-neutral-400 hover:text-black transition-colors text-left"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>

              {/* Featured Image */}
              <div className="col-span-2">
                <p className="font-utility text-[10px] text-neutral-400 uppercase tracking-[0.2em] mb-5">Featured</p>
                <div className="relative aspect-[2/1] overflow-hidden group cursor-pointer">
                  <Image
                    src="https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1935&auto=format&fit=crop"
                    alt="Featured"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                  <Link 
                    href="/collections/new-arrivals"
                    onClick={closeSearch}
                    className="absolute bottom-4 left-4 font-utility text-[10px] uppercase tracking-[0.15em] bg-white text-black px-4 py-2 hover:bg-black hover:text-white transition-colors"
                  >
                    Shop Now
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* Footer */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-16 pt-6 flex justify-between items-center border-t border-neutral-100"
            >
              <div className="flex gap-6">
                <a href="#" className="font-utility text-[10px] uppercase tracking-[0.15em] text-neutral-400 hover:text-black transition-colors">Instagram</a>
                <a href="#" className="font-utility text-[10px] uppercase tracking-[0.15em] text-neutral-400 hover:text-black transition-colors">TikTok</a>
              </div>
              <p className="font-utility text-[10px] uppercase tracking-[0.15em] text-neutral-300">Velancis © 2026</p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
