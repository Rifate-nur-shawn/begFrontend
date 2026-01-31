"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import api from "@/lib/api/axios";

// Using 'any' for product type here to match quick integration needs, 
// ideally should share the Product interface from types/defaults.ts or similar
// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface SearchResult {
    id: string;
    name: string;
    slug: string;
    basePrice: number;
    salePrice?: number;
    description: string;
    category?: { name: string };
    media?: { images: string[] };
}

export default function SearchPage() {
    const searchParams = useSearchParams();
    const query = searchParams.get("q") || "";
    
    const [products, setProducts] = useState<SearchResult[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchResults = async () => {
            setIsLoading(true);
            try {
                // Backend expects /search?q=...
                const { data } = await api.get(`/search?q=${encodeURIComponent(query)}`);
                setProducts(data || []);
            } catch (error) {
                console.error("Search failed", error);
                setProducts([]);
            } finally {
                setIsLoading(false);
            }
        };

        if (query) {
            fetchResults();
        } else {
            setProducts([]);
            setIsLoading(false);
        }
    }, [query]);

    return (
        <div className="min-h-screen bg-white pt-32 pb-20">
            <div className="max-w-[1920px] mx-auto px-6 md:px-12">
                <div className="mb-12 text-center">
                    <h1 className="font-display text-3xl md:text-4xl mb-4">
                        Search Results
                    </h1>
                    <p className="font-utility text-neutral-500 tracking-wide">
                        {query ? `Showing results for "${query}"` : "Please enter a search term"}
                    </p>
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-x-6 gap-y-12">
                         {products.map((product) => (
                            <Link 
                                key={product.id} 
                                href={`/products/${product.slug}`}
                                className="group block"
                            >
                                <div className="relative aspect-[3/4] bg-neutral-100 mb-4 overflow-hidden">
                                    <Image
                                        src={product.media?.images?.[0] || ""}
                                        alt={product.name}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                </div>
                                <div className="text-center md:text-left">
                                    <p className="font-utility text-[10px] uppercase tracking-[0.1em] text-neutral-500 mb-2">
                                        {product.category?.name}
                                    </p>
                                    <h3 className="font-display text-base text-black mb-1 group-hover:underline decoration-1 underline-offset-4">
                                        {product.name}
                                    </h3>
                                    <p className="font-utility text-sm text-neutral-900">
                                        ${product.basePrice.toLocaleString()}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
                
                {products.length === 0 && !isLoading && (
                    <div className="text-center py-20">
                        <p className="font-utility text-neutral-500">No products found matching your criteria.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
