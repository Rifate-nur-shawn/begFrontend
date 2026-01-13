"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useCartStore } from "@/store/cart-store";

interface Product {
    id: string;
    name: string;
    slug: string;
    basePrice: number;
    salePrice?: number | null;
    media?: {
        images?: string[];
    };
    category?: {
        name: string;
    };
}

export default function ProductCard({ product }: { product: Product }) {
    const { addItem } = useCartStore();
    
    if (!product) return null;

    const price = product.salePrice && product.salePrice < product.basePrice ? product.salePrice : product.basePrice;
    const hasDiscount = product.salePrice && product.salePrice < product.basePrice;
    
    // Use local fallback instead of external URL
    const image = (product.media?.images?.length) 
        ? product.media.images[0] 
        : "/products/product_saree_red_1768316591404.png";

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        addItem({
            id: product.id,
            productId: product.id,
            name: product.name,
            price: price,
            image: image,
            size: "One Size",
            color: "Default"
        });
    };

    return (
        <Link href={`/products/${product.slug}`} className="group block">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5 }}
            >
                {/* Image Container */}
                <div className="relative aspect-[3/4] overflow-hidden bg-neutral-50">
                    <Image
                        src={image}
                        alt={product.name}
                        fill
                        className="object-cover transition-all duration-700 ease-out group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    
                    {/* Discount Badge */}
                    {hasDiscount && (
                        <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 font-utility text-[10px] uppercase tracking-widest">
                            Sale
                        </div>
                    )}
                    
                    {/* Quick Add Overlay */}
                    <div className="absolute bottom-0 left-0 w-full p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out">
                        <button 
                            onClick={handleAddToCart}
                            className="w-full bg-white/95 backdrop-blur-sm text-primary py-4 px-4 font-utility text-[10px] uppercase tracking-[0.15em] hover:bg-primary hover:text-white transition-all duration-300"
                        >
                            Quick Add
                        </button>
                    </div>

                    {/* Hover Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                
                {/* Product Info */}
                <div className="mt-5 space-y-2">
                    <div className="flex justify-between items-start gap-4">
                        <div className="flex-1 min-w-0">
                            <h3 className="font-display text-lg leading-tight truncate group-hover:text-neutral-600 transition-colors">
                                {product.name}
                            </h3>
                            <p className="font-utility text-[10px] text-neutral-500 uppercase tracking-[0.15em] mt-1">
                                {product.category?.name || "Collection"}
                            </p>
                        </div>
                        <div className="text-right shrink-0">
                            <span className="font-utility text-sm tracking-wide">
                                ${price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </span>
                            {hasDiscount && (
                                <span className="block font-utility text-[10px] text-neutral-400 line-through mt-0.5">
                                    ${product.basePrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </motion.div>
        </Link>
    );
}
