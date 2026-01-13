"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import api from "@/lib/api/axios";

interface Product {
    id: string;
    name: string;
    slug: string;
    description: string;
    basePrice: number;
    salePrice?: number;
    media?: {
        images?: string[];
    };
    category?: {
        name: string;
    };
}

export default function FeaturedGrid() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchFeaturedProducts() {
            try {
                const { data } = await api.get('/products', {
                    params: { limit: 4 }
                });
                setProducts(data.data || []);
            } catch (error) {
                console.error("Failed to fetch featured products", error);
            } finally {
                setLoading(false);
            }
        }
        fetchFeaturedProducts();
    }, []);

    // Layout configurations for the grid
    const layouts = [
        { span: "md:col-span-2", height: "h-[400px] md:h-[600px]" },
        { span: "md:col-span-1", height: "h-[400px]" },
        { span: "md:col-span-1", height: "h-[400px] md:h-[500px]" },
        { span: "md:col-span-2", height: "h-[400px] md:h-[500px]" },
    ];

    if (loading) {
        return (
            <section className="py-24 px-4 md:px-12 bg-canvas">
                <div className="max-w-[1920px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[...Array(4)].map((_, i) => (
                        <div 
                            key={i} 
                            className={`${layouts[i]?.span || "md:col-span-1"} ${layouts[i]?.height || "h-[400px]"} bg-neutral-100 animate-pulse`} 
                        />
                    ))}
                </div>
            </section>
        );
    }

    return (
        <section className="py-24 px-4 md:px-12 bg-canvas">
            <div className="text-center mb-16">
                <h2 className="font-display text-4xl md:text-6xl mb-4">Featured Collection</h2>
                <p className="font-utility text-xs tracking-widest uppercase text-neutral-500">
                    Handpicked pieces from our latest arrivals
                </p>
            </div>
            
            <div className="max-w-[1920px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
                {products.slice(0, 4).map((product, i) => {
                    const layout = layouts[i] || layouts[0];
                    const image = product.media?.images?.[0] || "/products/product_saree_red_1768316591404.png";
                    
                    return (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8, delay: i * 0.1 }}
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
                                    />
                                </div>
                                
                                {/* Overlay Text */}
                                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors duration-500 p-8 flex flex-col justify-end">
                                    <h3 className="font-display text-3xl md:text-4xl text-white translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                                        {product.name}
                                    </h3>
                                    <p className="font-utility text-xs tracking-widest text-white uppercase translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                                        ${(product.salePrice || product.basePrice).toLocaleString()}
                                    </p>
                                </div>
                            </Link>
                        </motion.div>
                    );
                })}
            </div>

            <div className="text-center mt-16">
                <Link 
                    href="/collections/sarees" 
                    className="inline-block font-utility text-xs tracking-widest uppercase border border-primary px-8 py-4 hover:bg-primary hover:text-white transition-colors"
                >
                    View All Products
                </Link>
            </div>
        </section>
    );
}
