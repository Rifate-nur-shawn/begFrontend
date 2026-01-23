"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useFeaturedProducts } from "@/lib/api/products-hooks";
import { UI_CONSTANTS, ROUTES } from "@/lib/constants";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Use SWR for cached product data
  const { products, isLoading } = useFeaturedProducts(1);
  const featuredProduct = products[0];
  
  const heroImage = featuredProduct?.media?.images?.[0] || UI_CONSTANTS.HERO_FALLBACK_IMAGE;

  // Smooth spring physics for buttery scroll animations
  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };
  
  const rawY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const rawOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const rawScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  
  // Apply spring for smooth, luxury feel
  const y = useSpring(rawY, springConfig);
  const opacity = useSpring(rawOpacity, springConfig);
  const scale = useSpring(rawScale, springConfig);

  return (
    <div 
      ref={containerRef} 
      className="relative h-screen w-full overflow-hidden -mt-16"
    >
      {/* Full-screen Background Image with Parallax */}
      <motion.div 
        style={{ y, scale }} 
        className="absolute inset-0 z-0 will-change-transform"
      >
        {isLoading ? (
          <div className="w-full h-full bg-neutral-200 animate-pulse" />
        ) : (
          <Image
            src={heroImage}
            alt="Luxury Fashion"
            fill
            className="object-cover object-center"
            priority
            sizes="100vw"
            quality={90}
          />
        )}
        {/* Darker overlay for better text visibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60" />
      </motion.div>

      {/* Content - CENTERED */}
      <motion.div 
        style={{ opacity }}
        className="relative z-10 h-full flex flex-col justify-center items-center text-center px-6"
      >
        <div className="overflow-hidden">
          <motion.h1 
            initial={{ y: "110%" }}
            animate={{ y: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
            className="font-display text-5xl md:text-8xl lg:text-[10rem] tracking-tight text-white mb-6"
            style={{
              textShadow: "0 4px 30px rgba(0,0,0,0.4), 0 1px 3px rgba(0,0,0,0.3)"
            }}
          >
            {UI_CONSTANTS.HERO_TITLE}
          </motion.h1>
        </div>
        
        <div className="overflow-hidden">
          <motion.p 
            initial={{ y: "110%" }}
            animate={{ y: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
            className="font-utility text-sm md:text-base tracking-[0.2em] uppercase text-white/85 mb-12 max-w-lg"
            style={{
              textShadow: "0 2px 20px rgba(0,0,0,0.5)"
            }}
          >
            {UI_CONSTANTS.HERO_SUBTITLE}
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.9 }}
        >
          <Link 
            href={ROUTES.COLLECTIONS}
            className="group relative inline-flex items-center gap-3 px-10 py-5 bg-white/95 backdrop-blur-sm text-black font-utility text-xs tracking-[0.15em] uppercase overflow-hidden transition-all duration-500 hover:bg-white hover:scale-[1.02] hover:shadow-2xl"
          >
            <span className="relative z-10 font-medium">{UI_CONSTANTS.HERO_BUTTON_TEXT}</span>
            <svg 
              className="w-4 h-4 relative z-10 transition-transform duration-500 group-hover:translate-x-2" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </motion.div>
      </motion.div>

      {/* Elegant Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3"
      >
        <span className="font-utility text-[9px] tracking-[0.3em] uppercase text-white/60">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-px h-10 bg-gradient-to-b from-white/60 to-transparent"
        />
      </motion.div>
    </div>
  );
}
