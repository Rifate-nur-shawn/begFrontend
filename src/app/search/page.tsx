"use client";

import { useSearchParams } from "next/navigation";
import { useProduct } from "@/lib/api/products-hooks";
import Image from "next/image";
import Link from "next/link";
import { useFeaturedProducts } from "@/lib/api/products-hooks";

export default function SearchPage() {
    const searchParams = useSearchParams();
    const query = searchParams.get("q") || "";
    
    // For now, we'll use the featured products hook as a mock search
    // In a real app, you'd pass the query to a dedicated search hook
    const { products, isLoading } = useFeaturedProducts(12);

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
                                    {/* Quick action overlay could go here */}
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
