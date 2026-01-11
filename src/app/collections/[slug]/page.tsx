"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/api/axios";
import ProductCard from "@/components/shop/ProductCard";
import { motion } from "framer-motion";

export default function CategoryPage() {
    const params = useParams();
    const slug = params?.slug as string;
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [categoryName, setCategoryName] = useState(slug); // Placeholder until we fetch cat details or infer

    useEffect(() => {
        if (!slug) return;

        async function fetchProducts() {
            setLoading(true);
            try {
                // Fetch products by category slug
                const { data } = await api.get('/products', {
                    params: {
                        category_slug: slug,
                        limit: 50
                    }
                });
                
                // Backend response: { data: [...], pagination: {...} }
                setProducts(data.data || []);
                
                // Ideally we also fetch Category Details to get proper Name, but for now slug is used
                // Normalize slug for display
                setCategoryName(slug.replace(/-/g, " ").toUpperCase());

            } catch (err) {
                console.error("Failed to fetch products", err);
            } finally {
                setLoading(false);
            }
        }

        fetchProducts();
    }, [slug]);

    return (
        <div className="min-h-screen pt-32 pb-24 px-4 md:px-12 bg-canvas">
            <div className="max-w-[1920px] mx-auto">
                {/* Header */}
                <div className="mb-16 text-center">
                    <h1 className="font-display text-5xl md:text-8xl break-words mb-6">
                        {loading ? "LOADING..." : categoryName}
                    </h1>
                    <p className="font-utility text-xs tracking-widest uppercase text-neutral-500 max-w-lg mx-auto">
                        Explore our latest collection
                    </p>
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-12">
                         {[1, 2, 3].map((i) => (
                             <div key={i} className="aspect-[3/4] bg-neutral-100 animate-pulse" />
                         ))}
                    </div>
                ) : products.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
                        {products.map((product) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <ProductCard product={product} />
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-24">
                        <p className="font-display text-2xl text-neutral-400">No products found in this collection.</p>
                        <p className="font-utility text-xs tracking-widest mt-4">Try checking back later.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
