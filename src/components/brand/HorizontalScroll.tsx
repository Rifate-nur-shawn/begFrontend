"use client";

import { motion, useTransform, useScroll } from "framer-motion";
import { useRef } from "react";

export default function HorizontalScroll({ children, className }: { children: React.ReactNode; className?: string }) {
  const targetRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  const x = useTransform(scrollYProgress, [0, 1], ["1%", "-95%"]);

  return (
    <section ref={targetRef} className="relative h-[300vh] bg-neutral-900">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <motion.div style={{ x }} className={`flex gap-4 ${className}`}>
          {children}
        </motion.div>
      </div>
    </section>
  );
}
