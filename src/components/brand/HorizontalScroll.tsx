"use client";

import { motion, useTransform, useScroll } from "framer-motion";
import { useRef, useEffect, useState } from "react";

export default function HorizontalScroll({ children, className }: { children: React.ReactNode; className?: string }) {
  const targetRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [scrollWidth, setScrollWidth] = useState(0);
  const [windowWidth, setWindowWidth] = useState(0);

  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  // Calculate actual scroll distance needed
  useEffect(() => {
    const updateDimensions = () => {
      if (contentRef.current) {
        setScrollWidth(contentRef.current.scrollWidth);
      }
      setWindowWidth(window.innerWidth);
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, [children]);

  // Calculate the percentage to translate (content width - viewport width)
  const scrollDistance = scrollWidth > windowWidth ? scrollWidth - windowWidth : 0;
  const scrollPercentage = scrollWidth > 0 ? (scrollDistance / scrollWidth) * 100 : 85;

  const x = useTransform(scrollYProgress, [0, 1], ["0%", `-${scrollPercentage}%`]);

  // Adjust section height based on content width (more content = more scroll space)
  const sectionHeight = scrollWidth > 0 ? Math.max(150, Math.min(200, (scrollWidth / windowWidth) * 100)) : 200;

  return (
    <section ref={targetRef} className="relative bg-canvas" style={{ height: `${sectionHeight}vh` }}>
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        <motion.div 
          ref={contentRef}
          style={{ x }} 
          className={`flex gap-4 px-12 md:px-32 ${className}`}
        >
          {children}
        </motion.div>
      </div>
    </section>
  );
}
