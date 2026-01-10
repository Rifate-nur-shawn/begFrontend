'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useRef } from 'react';

export default function MagneticButton({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLButtonElement>(null);
  
  // Mouse position values
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth spring physics (The "Magnetic" feel)
  const springConfig = { damping: 15, stiffness: 150, mass: 0.1 };
  const xSpring = useSpring(x, springConfig);
  const ySpring = useSpring(y, springConfig);

  // Text moves slightly more than the button for depth
  const textX = useTransform(xSpring, (latest) => latest * 0.5);
  const textY = useTransform(ySpring, (latest) => latest * 0.5);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    
    // Calculate distance from center
    x.set(e.clientX - centerX);
    y.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: xSpring, y: ySpring }}
      className="group relative px-8 py-4 bg-transparent border border-neutral-900 overflow-hidden cursor-pointer"
    >
      {/* The Liquid Fill Hover Effect */}
      <span className="absolute inset-0 bg-neutral-900 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
      
      {/* The Text Content */}
      <motion.span 
        style={{ x: textX, y: textY }}
        className="relative block font-serif text-lg tracking-wide uppercase text-neutral-900 group-hover:text-white transition-colors duration-300"
      >
        {children}
      </motion.span>
    </motion.button>
  );
}
