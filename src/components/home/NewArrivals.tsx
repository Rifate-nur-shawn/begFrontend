"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useFeaturedProducts } from "@/lib/api/products-hooks";
import ProductCard from "@/components/shop/ProductCard";
import { ROUTES } from "@/lib/constants";

export default function NewArrivals() {
  // Use SWR to fetch products. using "featured" hook with limit 8 for now as a proxy for "new"
  const { products, isLoading } = useFeaturedProducts(8);

  return (
    <section className="py-24 px-4 md:px-12 bg-canvas">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6"
      >
        <div>
           <h2 className="font-display text-4xl md:text-5xl mb-2">New Arrivals</h2>
           <p className="font-utility text-xs tracking-widest uppercase text-neutral-500">
             The latest additions to our collection
           </p>
        </div>
        
        <Link 
            href={ROUTES.COLLECTIONS} // Ideally /collections/new-arrivals
            className="hidden md:block font-utility text-xs font-bold tracking-[0.15em] uppercase hover:text-neutral-600 transition-colors pb-1 border-b border-black hover:border-neutral-400"
        >
            View All
        </Link>
      </motion.div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {[...Array(4)].map((_, i) => (
                <div key={i} className="aspect-[3/4] bg-neutral-100 animate-pulse" />
            ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10 group/grid">
            {products.map((product, i) => (
                <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                    <ProductCard product={{...product, isNew: i < 2}} /> {/* Mocking 'isNew' for now */}
                </motion.div>
            ))}
        </div>
      )}

      <div className="md:hidden mt-12 text-center">
        <Link 
            href={ROUTES.COLLECTIONS} 
            className="inline-block font-utility text-xs font-bold tracking-[0.15em] uppercase border-b border-black pb-1"
        >
            View All
        </Link>
      </div>
    </section>
  );
}
