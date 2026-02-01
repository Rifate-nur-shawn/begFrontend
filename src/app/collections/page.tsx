"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { productApi } from "@/lib/api/products";
import { Category } from "@/types/api";
import { motion } from "framer-motion";

export default function CollectionsPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await productApi.getCategories();
                setCategories(data);
            } catch (err) {
                console.error("Failed to fetch categories", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCategories();
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
                    <h1 className="font-display text-5xl md:text-7xl mb-6">Collections</h1>
                    <p className="font-utility text-xs tracking-widest uppercase text-neutral-500 max-w-lg mx-auto">
                        Explore our curated categories
                    </p>
                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {categories.length > 0 ? (
                        categories.map((category, index) => (
                            <Link href={`/collections/${category.slug}`} key={category.id} className="group block relative overflow-hidden">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="relative aspect-[4/3]"
                                >
                                    <div className="absolute inset-0 bg-neutral-200">
                                       {/* Fallback image if no category image is provided by API (which is often currently empty strings based on curl) */}
                                       <Image 
                                         src={category.image || "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=2069&auto=format&fit=crop"} 
                                         alt={category.name}
                                         fill
                                         className="object-cover transition-transform duration-700 group-hover:scale-105"
                                       />
                                    </div>
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300" />
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                                        <h2 className="font-display text-3xl md:text-4xl tracking-wide">{category.name}</h2>
                                        <div className="h-px w-12 bg-white mt-4 transition-all duration-300 group-hover:w-24" />
                                        <span className="font-utility text-[10px] uppercase tracking-widest mt-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                                            Shop {category.name}
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
