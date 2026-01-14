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
          className="fixed inset-0 z-40 bg-[#FAFAFA] text-[#1a1a1a] flex flex-col pt-28 px-8 md:px-16 lg:px-24 h-screen overflow-hidden"
        >
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 w-full max-w-[1600px] mx-auto h-full"
          >
            {/* Links Columns */}
            <div className="md:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-16">
                {MENU_DATA.map((section) => (
                <div key={section.title} className="flex flex-col">
                    <motion.h3
                    variants={itemVariants}
                    className="font-utility text-[10px] font-semibold tracking-[0.3em] uppercase text-[#888] mb-8"
                    >
                    {section.title}
                    </motion.h3>
                    <ul className="space-y-3">
                    {section.items.map((item) => (
                        <motion.li key={item.label} variants={itemVariants}>
                        <Link
                            href={item.href}
                            onClick={closeMenu}
                            onMouseEnter={() => item.image && setHoveredImage(item.image)}
                            onMouseLeave={() => setHoveredImage(null)}
                            className={`group block text-[22px] md:text-[28px] font-display italic leading-relaxed transition-all duration-400 ease-out ${
                            item.featured 
                              ? "text-[#1a1a1a]" 
                              : "text-[#555] hover:text-[#1a1a1a]"
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
            <div className="hidden md:block md:col-span-5 h-[55vh] relative self-center">
                 <AnimatePresence mode="wait">
                    {hoveredImage ? (
                        <motion.div 
                            key={hoveredImage}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            className="relative w-full h-full overflow-hidden"
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
                             className="w-full h-full flex items-center justify-center bg-[#F0F0F0]"
                        >
                            <p className="font-display text-6xl text-[#D0D0D0] tracking-[0.3em] font-light">Velancis</p>
                        </motion.div>
                    )}
                 </AnimatePresence>
            </div>

            {/* Footer Links (Socials etc) */}
             <motion.div variants={itemVariants} className="md:col-span-12 border-t border-[#E5E5E5] pt-6 pb-6 mt-auto flex justify-between items-center font-utility text-[9px] uppercase tracking-[0.25em] text-[#999]">
                <div className="flex gap-8">
                    <a href="#" className="hover:text-[#1a1a1a] transition-colors duration-300">Instagram</a>
                    <a href="#" className="hover:text-[#1a1a1a] transition-colors duration-300">TikTok</a>
                    <a href="#" className="hover:text-[#1a1a1a] transition-colors duration-300">Pinterest</a>
                </div>
                <p>Velancis &copy; 2026</p>
             </motion.div>
 
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
