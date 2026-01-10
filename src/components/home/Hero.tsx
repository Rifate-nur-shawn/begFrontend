"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import MagneticButton from "@/components/ui/MagneticButton";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div ref={containerRef} className="relative h-screen w-full overflow-hidden bg-primary text-canvas">
      {/* Background Video / Parallax Container */}
      <motion.div style={{ y, opacity }} className="absolute inset-0 z-0">
        {/* Placeholder for actual video - using a gradient for now to ensure it looks good immediately */}
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-800 to-black" />
         {/* 
            <video 
                autoPlay 
                muted 
                loop 
                playsInline 
                className="w-full h-full object-cover opacity-60"
            >
                <source src="/assets/hero-video.mp4" type="video/mp4" />
            </video>
         */}
      </motion.div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-4">
        <div className="overflow-hidden">
             <motion.h1 
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
                className="font-display text-6xl md:text-9xl tracking-tighter mb-6 mix-blend-difference"
             >
            THE NEW ERA
            </motion.h1>
         </div>
         <div className="overflow-hidden">
             <motion.p 
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1], delay: 0.2 }}
                className="font-utility text-sm md:text-lg tracking-[0.2em] uppercase mb-12 max-w-lg mx-auto"
             >
                Redefining modern luxury through structure and void.
            </motion.p>
        </div>

        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
        >
            <MagneticButton>
                Explore Collection
            </MagneticButton>
        </motion.div>
      </div>
    </div>
  );
}
