"use client";

import { useUIStore } from "@/store/ui-store";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";

export default function SearchOverlay() {
  const { isSearchOpen, closeSearch } = useUIStore();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
       // Focus input when open
       setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isSearchOpen]);

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 bg-canvas/95 backdrop-blur-md pt-32 px-6 md:px-12"
        >
          <div className="max-w-4xl mx-auto">
             <div className="flex border-b-2 border-primary pb-4">
                 <input
                    ref={inputRef}
                    type="text"
                    placeholder="Search collections, products..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full bg-transparent font-display text-3xl md:text-5xl placeholder:text-neutral-300 focus:outline-none uppercase"
                 />
                 <button onClick={closeSearch} className="font-utility text-xs uppercase tracking-widest ml-4 self-center">
                    Close
                 </button>
             </div>
             
             {/* Results / Suggestions Placeholder */}
             <div className="mt-12">
                 <p className="font-utility text-xs text-neutral-400 uppercase tracking-widest mb-6">Trending Now</p>
                 <div className="flex flex-wrap gap-4 font-utility text-sm">
                     <button className="border border-neutral-200 px-4 py-2 hover:bg-black hover:text-white transition-colors">Arcadie Bag</button>
                     <button className="border border-neutral-200 px-4 py-2 hover:bg-black hover:text-white transition-colors">Leather</button>
                     <button className="border border-neutral-200 px-4 py-2 hover:bg-black hover:text-white transition-colors">Summer 2026</button>
                 </div>
             </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
