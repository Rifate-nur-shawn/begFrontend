"use client";

import { motion, useTransform, useScroll } from "framer-motion";
import { useRef } from "react";

export default function HorizontalScroll({ children, className }: { children: React.ReactNode; className?: string }) {
  const targetRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-85%"]);

  return (
    <section ref={targetRef} className="relative h-[300vh] bg-canvas">
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        <motion.div style={{ x }} className={`flex gap-4 px-12 md:px-32 ${className}`}>
          {children}
        </motion.div>
      </div>
    </section>
  );
}
