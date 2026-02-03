"use client";

import { useParams } from "next/navigation";
import useSWR from "swr";
import api from "@/lib/api/axios";
import ProductCard from "@/components/shop/ProductCard";
import { motion } from "framer-motion";
import { Product } from "@/types/api";

interface Collection {
    id: string;
    title: string;
    slug: string;
    description?: string;
    image?: string;
    story?: string;
    isActive: boolean;
    products?: Product[];
}

const fetcher = (url: string) => api.get(url).then((res) => res.data);

export default function CollectionPage() {
    const params = useParams();
    const slug = params?.slug as string;
    
    // Fetch collection with its products from /collections/{slug}
    const { data: collection, isLoading, error } = useSWR<Collection>(
        slug ? `/collections/${slug}` : null,
        fetcher,
        { revalidateOnFocus: true, revalidateOnMount: true }
    );
    
    const products = collection?.products || [];
    const title = collection?.title?.toUpperCase() || slug?.replace(/-/g, " ").toUpperCase() || "COLLECTION";

    return (
        <div className="min-h-screen pt-32 pb-24 px-4 md:px-12 bg-canvas text-primary">
            <div className="max-w-[1920px] mx-auto">
                {/* Header */}
                <div className="mb-16 text-center">
                    <h1 className="font-display text-5xl md:text-8xl break-words mb-6">
                        {isLoading ? "LOADING..." : title}
                    </h1>
                    <p className="font-utility text-xs tracking-widest uppercase text-neutral-500 max-w-lg mx-auto">
                        {collection?.description || "Explore our latest collection"}
                    </p>
                </div>

                {/* Grid */}
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-12">
                         {[1, 2, 3].map((i) => (
                             <div key={i} className="aspect-[3/4] bg-neutral-100 animate-pulse" />
                         ))}
                    </div>
                ) : error ? (
                    <div className="text-center py-24">
                        <p className="font-display text-2xl text-neutral-400">Collection not found.</p>
                        <p className="font-utility text-xs tracking-widest mt-4">Please check the URL and try again.</p>
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
