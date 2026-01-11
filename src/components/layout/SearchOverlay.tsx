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
          transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
          className="fixed inset-0 z-[100] bg-white/98 backdrop-blur-xl pt-32 px-6 md:px-12 flex flex-col"
        >
          {/* Close Button Absolute */}
          <button 
                onClick={closeSearch} 
                className="absolute top-8 right-6 md:right-12 font-utility text-xs uppercase tracking-[0.2em] text-neutral-500 hover:text-black transition-colors z-50 group"
          >
                <span className="block group-hover:scale-110 transition-transform duration-300">Close</span>
          </button>

          <div className="max-w-5xl mx-auto w-full relative">
             <div className="relative overflow-hidden mb-16">
                 <motion.input
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1, duration: 0.5 }}
                    ref={inputRef}
                    type="text"
                    placeholder="WHAT ARE YOU LOOKING FOR?"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full bg-transparent font-display text-4xl md:text-6xl lg:text-7xl placeholder:text-black text-black focus:outline-none uppercase border-b border-neutral-100 pb-8 transition-colors focus:border-black"
                 />
             </div>
             
             {/* Results / Suggestions */}
             <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="grid grid-cols-1 md:grid-cols-12 gap-12"
             >
                 <div className="md:col-span-4">
                     <p className="font-utility text-[10px] text-black uppercase tracking-[0.2em] mb-6">Trending Now</p>
                     <div className="flex flex-col items-start gap-4">
                         {["New Arrivals", "Leather Goods", "Summer Collection", "Accessories"].map((tag, i) => (
                             <button key={i} className="font-display text-xl md:text-2xl text-neutral-600 hover:text-black hover:translate-x-2 transition-all duration-300">
                                 {tag}
                             </button>
                         ))}
                     </div>
                 </div>

                 <div className="md:col-span-8">
                     <p className="font-utility text-[10px] text-black uppercase tracking-[0.2em] mb-6">Suggested</p>
                     {/* Mock Results */}
                     <div className="grid grid-cols-2 gap-4">
                        <div className="aspect-[3/4] bg-neutral-100 relative group cursor-pointer overflow-hidden">
                            {/* Placeholder for suggested product */}
                            <div className="absolute inset-0 bg-neutral-200" />
                            <div className="absolute bottom-4 left-4 font-utility text-xs uppercase tracking-widest bg-white px-2 py-1">Featured</div>
                        </div>
                        <div className="aspect-[3/4] bg-neutral-100 relative group cursor-pointer overflow-hidden">
                             <div className="absolute inset-0 bg-neutral-200" />
                        </div>
                     </div>
                 </div>
             </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
