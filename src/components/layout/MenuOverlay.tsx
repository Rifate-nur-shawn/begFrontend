"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useUIStore } from "@/store/ui-store";
import { MENU_DATA } from "@/lib/api/menu";

export default function MenuOverlay() {
  const { isMenuOpen, closeMenu } = useUIStore();

  const menuVariants = {
    closed: {
      opacity: 0,
      y: "-100%",
      transition: {
        duration: 0.8,
        ease: [0.76, 0, 0.24, 1] as any, // Custom bezier for "Shutters" effect
      },
    },
    open: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.76, 0, 0.24, 1] as any,
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
          className="fixed inset-0 z-40 bg-canvas text-primary flex flex-col pt-32 px-6 md:px-12 h-screen overflow-y-auto"
        >
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-3 gap-12 w-full max-w-7xl mx-auto"
          >
            {MENU_DATA.map((section) => (
              <div key={section.title} className="flex flex-col space-y-6">
                <motion.h3
                  variants={itemVariants}
                  className="font-utility text-xs tracking-widest uppercase text-neutral-400 border-b border-accent-subtle pb-2"
                >
                  {section.title}
                </motion.h3>
                <ul className="space-y-2">
                  {section.items.map((item) => (
                    <motion.li key={item.label} variants={itemVariants}>
                      <Link
                        href={item.href}
                        onClick={closeMenu}
                        className={`block text-3xl md:text-5xl font-display hover:italic transition-all duration-300 ${
                          item.featured ? "text-primary" : "text-neutral-600 hover:text-primary"
                        }`}
                      >
                        {item.label}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </div>
            ))}
            
            {/* Extra decorative column or image could go here */}
             <div className="hidden md:block bg-accent-subtle/30 p-8 h-full min-h-[400px]">
                <p className="font-utility text-xs tracking-widest uppercase text-neutral-500 mb-4">Featured Campaign</p>
                <div className="w-full h-64 bg-neutral-200 animate-pulse">
                    {/* Placeholder for campaign image */}
                </div>
                <h4 className="font-display text-2xl mt-4">Arcadie</h4>
             </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
