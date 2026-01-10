"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

interface CollectionItem {
    id: string;
    title: string;
    subtitle: string;
    image: string;
    span: "col-span-1" | "col-span-2";
    height: "h-[400px]" | "h-[600px]" | "h-[800px]";
}

const COLLECTIONS: CollectionItem[] = [
    {
        id: "c1",
        title: "The Signature",
        subtitle: "Iconic silhouettes",
        image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=2069&auto=format&fit=crop", 
        span: "col-span-2",
        height: "h-[600px]"
    },
    {
        id: "c2",
        title: "Travel Edit",
        subtitle: "For the journey",
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1974&auto=format&fit=crop",
        span: "col-span-1",
        height: "h-[400px]"
    },
    {
        id: "c3",
        title: "Evening Wear",
        subtitle: "Night out essentials",
        image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1935&auto=format&fit=crop",
        span: "col-span-1",
        height: "h-[800px]"
    },
     {
        id: "c4",
        title: "Accessories",
        subtitle: "The finishing touch",
        image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=1974&auto=format&fit=crop",
        span: "col-span-2",
        height: "h-[600px]"
    },
]

export default function FeaturedGrid() {
  return (
    <section className="py-24 px-4 md:px-12 bg-canvas">
      <div className="max-w-[1920px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {COLLECTIONS.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: i * 0.1 }}
            className={`relative group overflow-hidden ${item.span} ${item.height}`}
          >
            <Link href={`/collections/${item.id}`} className="block w-full h-full relative">
                {/* Image Scale Effect */}
                <div className="absolute inset-0 overflow-hidden">
                    <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                </div>
                
                {/* Overlay Text */}
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-500 p-8 flex flex-col justify-end">
                    <h3 className="font-display text-4xl text-white translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                        {item.title}
                    </h3>
                    <p className="font-utility text-xs tracking-widest text-white uppercase translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                        {item.subtitle}
                    </p>
                </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
