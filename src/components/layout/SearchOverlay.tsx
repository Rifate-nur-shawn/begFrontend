"use client";

import { useUIStore } from "@/store/ui-store";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useFeaturedProducts } from "@/lib/api/products-hooks";

export default function SearchOverlay() {
  const { isSearchOpen, closeSearch } = useUIStore();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Fetch suggested products for "You may also like"
  const { products: suggestedProducts } = useFeaturedProducts(3);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isSearchOpen]);

  const highlights = [
        { name: "New In", href: "/collections/new-arrivals" },
        { name: "Bags", href: "/collections/bags" },
        { name: "Shoes", href: "/collections/shoes" },
        { name: "Ready to wear", href: "/collections/ready-to-wear" },
  ];

  const trending = [
        "Soft, spacious bags",
        "Lightweight athletic sneakers",
        "Everyday functionality",
        "Smooth retro shapes",
  ];

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <div className="fixed inset-0 z-[100]">
            {/* Backdrop with Glass Effect */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                onClick={closeSearch}
                className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            />

            {/* Content Container (80% Height for maximum visibility) */}
            <motion.div
                initial={{ y: "-100%" }}
                animate={{ y: 0 }}
                exit={{ y: "-100%" }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                className="relative z-[101] bg-white flex flex-col h-[80vh] shadow-2xl"
            >
                {/* Top Bar */}
                <header className="flex items-center h-20 px-6 md:px-12 border-b border-neutral-200 bg-white shrink-0">
                    {/* Search Icon */}
                    <svg className="w-5 h-5 text-black mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>

                    {/* Input */}
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Search"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && query.length > 0) {
                                closeSearch();
                                window.location.href = `/search?q=${encodeURIComponent(query)}`;
                            }
                        }}
                        className="flex-1 h-full bg-transparent font-utility text-sm md:text-base text-black placeholder:text-neutral-400 focus:outline-none focus:ring-0 focus-visible:outline-none border-none ring-0 outline-none"
                    />

                    {/* Close Button with Separator */}
                    <div className="flex items-center h-full"> 
                        <div className="w-px h-full bg-neutral-200 mx-6 md:mx-8" />
                        <button 
                            onClick={closeSearch}
                            className="font-utility text-[11px] uppercase tracking-[0.15em] font-medium text-black hover:opacity-70 transition-opacity"
                        >
                            Close
                        </button>
                    </div>
                </header>

                {/* Split Content Area */}
                <div className="flex-1 flex overflow-hidden">
                    <div className="w-full max-w-[1920px] mx-auto flex flex-col md:flex-row px-6 md:px-12 py-8 h-full overflow-y-auto">
                        
                        {/* Left Sidebar: Highlights */}
                        <div className="w-full md:w-1/4 mb-8 md:mb-0 md:border-r border-transparent md:pr-12">
                            <h3 className="font-utility text-[10px] uppercase tracking-[0.2em] text-neutral-500 mb-6">
                                Highlights
                            </h3>
                            <div className="flex flex-col gap-4">
                                {highlights.map((item) => (
                                    <Link 
                                        key={item.name}
                                        href={item.href}
                                        onClick={closeSearch}
                                        className="font-utility text-sm text-neutral-600 hover:text-black transition-colors"
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Right Content Area */}
                        <div className="w-full md:w-3/4 md:pl-12 pb-20">
                            {query.length > 0 ? (
                                // Search Results / Suggested State
                                <div className="animate-fadeIn">
                                    <div className="flex justify-between items-end mb-8">
                                        <div>
                                            <h3 className="font-utility text-sm text-neutral-500 mb-2">
                                                {suggestedProducts.length} results found
                                            </h3>
                                            <h3 className="font-display text-lg">You may also like</h3>
                                        </div>
                                        <Link
                                            href={`/search?q=${encodeURIComponent(query)}`}
                                            onClick={closeSearch}
                                            className="font-utility text-[10px] uppercase tracking-[0.15em] font-medium text-black border-b border-black pb-1 hover:opacity-70 transition-opacity"
                                        >
                                            View all results
                                        </Link>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
                                        {suggestedProducts.slice(0, 4).map((product) => (
                                            <Link 
                                                key={product.id} 
                                                href={`/products/${product.slug}`}
                                                onClick={closeSearch}
                                                className="group block"
                                            >
                                                <div className="relative aspect-[3/4] bg-neutral-100 mb-4 overflow-hidden">
                                                    <Image
                                                        src={product.media?.images?.[0] || ""}
                                                        alt={product.name}
                                                        fill
                                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                                    />
                                                </div>
                                                <p className="font-utility text-[10px] uppercase tracking-[0.1em] text-neutral-500 mb-1">
                                                    {product.category?.name}
                                                </p>
                                                <h4 className="font-display text-sm text-black mb-1 line-clamp-1">{product.name}</h4>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                // Default State: Trending
                                <div className="animate-fadeIn">
                                    <h3 className="font-utility text-[10px] uppercase tracking-[0.2em] text-neutral-500 mb-6">
                                        What's Trending
                                    </h3>
                                    <div className="flex flex-col gap-4">
                                        {trending.map((item) => (
                                            <button
                                                key={item}
                                                onClick={() => setQuery(item)}
                                                className="text-left font-utility text-sm text-neutral-600 hover:text-black transition-colors"
                                            >
                                                {item}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
