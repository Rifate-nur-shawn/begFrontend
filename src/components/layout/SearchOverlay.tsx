"use client";

import { useUIStore } from "@/store/ui-store";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { productApi } from "@/lib/api/products";

export default function SearchOverlay() {
  const router = useRouter();
  const { isSearchOpen, closeSearch } = useUIStore();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Quick search tags for bags
  const quickTags = [
    { label: "HANDBAGS", query: "handbag" },
    { label: "TOTES", query: "tote" },
    { label: "CLUTCHES", query: "clutch" },
  ];

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      setQuery("");
      setResults([]);
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isSearchOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSearchOpen) {
        closeSearch();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, closeSearch]);

  // Debounced search
  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const data = await productApi.getAll({ search: query, limit: 6 });
        setResults(data.data || []);
      } catch (err) {
        console.error("Search error:", err);
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSearch = () => {
    if (query.length > 0) {
      closeSearch();
      router.push(`/shop?q=${encodeURIComponent(query)}`);
    }
  };

  const handleTagClick = (tagQuery: string) => {
    setQuery(tagQuery);
    closeSearch();
    router.push(`/shop?q=${encodeURIComponent(tagQuery)}`);
  };

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh]">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeSearch}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          {/* Modal - Apple Glass Style */}
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative z-[101] w-[92%] max-w-[640px] bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-white/50"
            style={{
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1) inset'
            }}
          >
            {/* Search Input Header */}
            <div className="flex items-center px-6 py-5 border-b border-white/30 bg-white/40">
              {/* Search Icon */}
              <svg 
                className="w-5 h-5 text-neutral-400 shrink-0" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor" 
                strokeWidth={1.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>

              {/* Input */}
              <input
                ref={inputRef}
                type="text"
                placeholder="Search products..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch();
                  }
                }}
                className="flex-1 mx-4 text-base text-neutral-800 placeholder:text-neutral-400 bg-transparent border-none outline-none ring-0 focus:ring-0 focus:outline-none focus:border-none focus-visible:outline-none focus-visible:ring-0"
                style={{ boxShadow: 'none', outline: 'none' }}
              />

              {/* Close Button */}
              <button
                onClick={closeSearch}
                className="p-1 text-neutral-400 hover:text-neutral-600 transition-colors"
                aria-label="Close search"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content Area */}
            <div className="px-6 py-8 min-h-[180px] bg-white/30">
              {query.length > 0 && results.length > 0 ? (
                /* Search Results */
                <div className="space-y-3">
                  {results.slice(0, 5).map((product) => (
                    <Link
                      key={product.id}
                      href={`/products/${product.slug}`}
                      onClick={closeSearch}
                      className="flex items-center gap-4 p-2 -mx-2 rounded-lg hover:bg-neutral-50 transition-colors"
                    >
                      <div className="w-12 h-12 bg-neutral-100 rounded overflow-hidden shrink-0">
                        {product.images?.[0] && (
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-neutral-800 truncate">{product.name}</p>
                        <p className="text-xs text-neutral-500">
                          ${product.salePrice || product.basePrice}
                        </p>
                      </div>
                    </Link>
                  ))}
                  
                  {/* View All Link */}
                  <button
                    onClick={handleSearch}
                    className="w-full mt-3 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors"
                  >
                    View all results →
                  </button>
                </div>
              ) : query.length > 0 && !isSearching ? (
                /* No Results */
                <div className="text-center py-4">
                  <p className="text-sm text-neutral-500">No products found</p>
                </div>
              ) : isSearching ? (
                /* Loading */
                <div className="text-center py-4">
                  <div className="inline-block w-5 h-5 border-2 border-neutral-200 border-t-neutral-600 rounded-full animate-spin" />
                </div>
              ) : (
                /* Default State */
                <div className="text-center">
                  <p className="text-sm text-neutral-400 mb-6">
                    Start typing to search...
                  </p>

                  {/* Quick Search Tags */}
                  <div className="flex items-center justify-center gap-2 flex-wrap">
                    {quickTags.map((tag) => (
                      <button
                        key={tag.label}
                        onClick={() => handleTagClick(tag.query)}
                        className="px-4 py-1.5 text-xs font-medium tracking-wide text-neutral-700 bg-neutral-100 rounded-full hover:bg-neutral-200 transition-colors"
                      >
                        {tag.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-white/50 border-t border-white/30">
              <p className="text-xs text-neutral-400 text-center">
                Press <kbd className="px-1.5 py-0.5 mx-1 bg-white rounded border border-neutral-200 font-mono text-[10px]">ESC</kbd> to close
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
