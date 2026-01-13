"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useFeaturedProducts } from "@/lib/api/products-hooks";

export default function FeaturedGrid() {
    // Use SWR for cached data
    const { products, isLoading } = useFeaturedProducts(4);

    // Layout configurations for the grid
    const layouts = [
        { span: "md:col-span-2", height: "h-[400px] md:h-[600px]" },
        { span: "md:col-span-1", height: "h-[400px]" },
        { span: "md:col-span-1", height: "h-[400px] md:h-[500px]" },
        { span: "md:col-span-2", height: "h-[400px] md:h-[500px]" },
    ];

    if (isLoading) {
        return (
            <section className="py-24 px-4 md:px-12 bg-canvas">
                <div className="text-center mb-16">
                    <div className="h-12 w-64 bg-neutral-100 animate-pulse mx-auto mb-4" />
                    <div className="h-4 w-48 bg-neutral-100 animate-pulse mx-auto" />
                </div>
                <div className="max-w-[1920px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
                    {layouts.map((layout, i) => (
                        <div 
                            key={i} 
                            className={`${layout.span} ${layout.height} bg-neutral-100 animate-pulse`} 
                        />
                    ))}
                </div>
            </section>
        );
    }

    return (
        <section className="py-24 px-4 md:px-12 bg-canvas">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center mb-16"
            >
                <h2 className="font-display text-4xl md:text-6xl mb-4">Featured Collection</h2>
                <p className="font-utility text-xs tracking-widest uppercase text-neutral-500">
                    Handpicked pieces from our latest arrivals
                </p>
            </motion.div>
            
            <div className="max-w-[1920px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
                {products.slice(0, 4).map((product, i) => {
                    const layout = layouts[i] || layouts[0];
                    const image = product.media?.images?.[0] || "/products/product_saree_red_1768316591404.png";
                    const price = product.salePrice && product.salePrice < product.basePrice 
                        ? product.salePrice 
                        : product.basePrice;
                    
                    return (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.6, delay: i * 0.1 }}
                            className={`relative group overflow-hidden ${layout.span} ${layout.height}`}
                        >
                            <Link href={`/products/${product.slug}`} className="block w-full h-full relative">
                                {/* Image Scale Effect */}
                                <div className="absolute inset-0 overflow-hidden">
                                    <Image
                                        src={image}
                                        alt={product.name}
                                        fill
                                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                    />
                                </div>
                                
                                {/* Overlay Text */}
                                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors duration-500 p-8 flex flex-col justify-end">
                                    <h3 className="font-display text-3xl md:text-4xl text-white translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                                        {product.name}
                                    </h3>
                                    <p className="font-utility text-xs tracking-widest text-white uppercase translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                                        ${price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                    </p>
                                </div>
                            </Link>
                        </motion.div>
                    );
                })}
            </div>

            <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-center mt-16"
            >
                <Link 
                    href="/collections/sarees" 
                    className="inline-block font-utility text-xs tracking-widest uppercase border border-primary px-8 py-4 hover:bg-primary hover:text-white transition-colors"
                >
                    View All Products
                </Link>
            </motion.div>
        </section>
    );
}
