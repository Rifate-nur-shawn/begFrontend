"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { productApi } from "@/lib/api/products";
import { Category } from "@/types/api";
import { motion } from "framer-motion";

export default function CollectionsPage() {
    const [collections, setCollections] = useState<any[]>([]); // Using any temporarily, should define Collection type
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCollections = async () => {
            try {
                // Fetch actual collections (curated lists), not categories
                const data = await productApi.getCollections(); 
                setCollections(data);
            } catch (err) {
                console.error("Failed to fetch collections", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCollections();
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen pt-32 pb-24 px-4 md:px-12 bg-canvas">
                <div className="max-w-[1920px] mx-auto">
                    <div className="mb-16 text-center animate-pulse">
                        <div className="h-12 w-64 bg-neutral-200 mx-auto rounded mb-4"/>
                        <div className="h-4 w-48 bg-neutral-200 mx-auto rounded"/>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="aspect-[16/9] bg-neutral-100 animate-pulse rounded"/>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-32 pb-24 px-4 md:px-12 bg-canvas text-primary">
            <div className="max-w-[1920px] mx-auto">
                {/* Header */}
                <div className="mb-16 text-center">
                    <h1 className="font-display text-5xl md:text-7xl mb-6">Curated Collections</h1>
                    <p className="font-utility text-xs tracking-widest uppercase text-neutral-500 max-w-lg mx-auto">
                        Explore our exclusive selections
                    </p>
                </div>

                {/* Collections Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {collections.length > 0 ? (
                        collections.map((collection, index) => (
                            <Link href={`/collections/${collection.slug}`} key={collection.id} className="group block relative overflow-hidden">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="relative aspect-[4/3]"
                                >
                                    <div className="absolute inset-0 bg-neutral-200">
                                       <Image 
                                         src={collection.image || "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=2069&auto=format&fit=crop"} 
                                         alt={collection.title || "Collection"}
                                         fill
                                         className="object-cover transition-transform duration-700 group-hover:scale-105"
                                       />
                                    </div>
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300" />
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                                        <h2 className="font-display text-3xl md:text-4xl tracking-wide">{collection.title}</h2>
                                        <div className="h-px w-12 bg-white mt-4 transition-all duration-300 group-hover:w-24" />
                                        <span className="font-utility text-[10px] uppercase tracking-widest mt-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                                            View Collection
                                        </span>
                                    </div>
                                </motion.div>
                            </Link>
                        ))
                    ) : (
                         <div className="col-span-full text-center py-24">
                            <p className="font-display text-2xl text-neutral-400">No collections found.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
