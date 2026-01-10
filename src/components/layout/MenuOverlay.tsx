"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useUIStore } from "@/store/ui-store";
import { MENU_DATA } from "@/lib/api/menu";
import { useState } from "react";
import Image from "next/image";

export default function MenuOverlay() {
  const { isMenuOpen, closeMenu } = useUIStore();
  const [hoveredImage, setHoveredImage] = useState<string | null>(null);

  const menuVariants = {
    closed: {
      opacity: 0,
      y: "-100%",
      transition: {
        duration: 0.8,
        ease: [0.76, 0, 0.24, 1], 
      },
    },
    open: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.76, 0, 0.24, 1],
      },
    },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.4,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  };

  return (
    <AnimatePresence>
      {isMenuOpen && (
        <motion.div
          variants={menuVariants}
          initial="closed"
          animate="open"
          exit="closed"
          className="fixed inset-0 z-40 bg-canvas text-primary flex flex-col pt-32 px-6 md:px-12 h-screen overflow-hidden"
        >
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-12 gap-12 w-full max-w-[1920px] mx-auto h-full"
          >
            {/* Links Columns */}
            <div className="md:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-12">
                {MENU_DATA.map((section) => (
                <div key={section.title} className="flex flex-col space-y-6">
                    <motion.h3
                    variants={itemVariants}
                    className="font-utility text-xs tracking-widest uppercase text-neutral-400 border-b border-accent-subtle pb-2"
                    >
                    {section.title}
                    </motion.h3>
                    <ul className="space-y-4">
                    {section.items.map((item) => (
                        <motion.li key={item.label} variants={itemVariants}>
                        <Link
                            href={item.href}
                            onClick={closeMenu}
                            onMouseEnter={() => item.image && setHoveredImage(item.image)}
                            onMouseLeave={() => setHoveredImage(null)}
                            className={`block text-3xl md:text-5xl font-display hover:translate-x-4 transition-all duration-300 ${
                            item.featured ? "text-primary italic" : "text-neutral-600 hover:text-primary"
                            }`}
                        >
                            {item.label}
                        </Link>
                        </motion.li>
                    ))}
                    </ul>
                </div>
                ))}
            </div>
            
            {/* Image Preview Column */}
            <div className="hidden md:block md:col-span-4 h-[60vh] relative self-center">
                 <AnimatePresence mode="wait">
                    {hoveredImage ? (
                        <motion.div 
                            key={hoveredImage}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.4 }}
                            className="relative w-full h-full overflow-hidden bg-neutral-100"
                        >
                             <Image 
                                src={hoveredImage} 
                                alt="Preview" 
                                fill 
                                className="object-cover"
                             />
                        </motion.div>
                    ) : (
                        <motion.div 
                             initial={{ opacity: 0 }}
                             animate={{ opacity: 1 }}
                             className="w-full h-full flex items-center justify-center border border-neutral-100"
                        >
                            <p className="font-display text-4xl text-neutral-200">BegOnShop</p>
                        </motion.div>
                    )}
                 </AnimatePresence>
            </div>

            {/* Footer Links (Socials etc) */}
             <motion.div variants={itemVariants} className="md:col-span-12 border-t border-neutral-100 pt-6 pb-6 mt-auto flex justify-between items-center font-utility text-[10px] uppercase tracking-widest text-neutral-500">
                <div className="flex gap-4">
                    <a href="#" className="hover:text-primary">Instagram</a>
                    <a href="#" className="hover:text-primary">TikTok</a>
                </div>
                <p>BegOnShop &copy; 2026</p>
             </motion.div>
 
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
