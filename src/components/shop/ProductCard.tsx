"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
import { useCartStore } from "@/store/cart-store";
import { UI_CONSTANTS } from "@/lib/constants";

interface Product {
    id: string;
    name: string;
    slug: string;
    basePrice: number;
    salePrice?: number | null;
    isNew?: boolean;
    media?: {
        images?: string[];
    };
    category?: {
        name: string;
    };
    // Mock data for colors and sizes until backend supports them
    colors?: { name: string; hex: string }[];
    sizes?: string[];
}

// Default mock data for demo purposes
const DEFAULT_COLORS = [
    { name: "Red", hex: "#C41E3A" },
    { name: "Beige", hex: "#D4B896" },
    { name: "Cream", hex: "#F5F5DC" },
    { name: "Blue", hex: "#87CEEB" },
];
const DEFAULT_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

export default function ProductCard({ product }: { product: Product }) {
    const { addItem } = useCartStore();
    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [isHovered, setIsHovered] = useState(false);
    
    if (!product) return null;

    const price = product.salePrice && product.salePrice < product.basePrice ? product.salePrice : product.basePrice;
    const hasDiscount = product.salePrice && product.salePrice < product.basePrice;
    
    const image = (product.media?.images?.length) 
        ? product.media.images[0] 
        : UI_CONSTANTS.HERO_FALLBACK_IMAGE;

    const colors = product.colors || DEFAULT_COLORS;
    const sizes = product.sizes || DEFAULT_SIZES;

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!selectedSize) return;
        
        addItem({
            id: product.id,
            productId: product.id,
            name: product.name,
            price: price,
            image: image,
            size: selectedSize,
            color: selectedColor || "Default"
        });
    };

    return (
        <Link href={`/products/${product.slug}`} className="group block">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5 }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Image Container - Taller aspect ratio to match reference */}
                <div className="relative aspect-[3/4.5] overflow-hidden bg-neutral-100">
                    <Image
                        src={image}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                    
                    {/* NEW Badge - Top Left, Gray Background */}
                    {product.isNew && (
                        <div className="absolute top-4 left-4 bg-neutral-500/90 text-white px-3 py-1.5 font-utility text-[10px] uppercase tracking-wider">
                            New
                        </div>
                    )}

                    {/* Sale Badge */}
                    {hasDiscount && !product.isNew && (
                        <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1.5 font-utility text-[10px] uppercase tracking-wider">
                            Sale
                        </div>
                    )}

                    {/* Product Info Overlay - Bottom Left */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/40 via-black/20 to-transparent">
                        <h3 className="font-utility text-sm font-medium text-white leading-tight">
                            {product.name}
                        </h3>
                        <p className="font-utility text-xs text-amber-400 mt-1">
                            {price.toLocaleString('en-US', { minimumFractionDigits: 2 })} EUR
                        </p>
                    </div>

                    {/* Hover State - Color & Size Selector */}
                    <div 
                        className={`absolute bottom-0 left-0 right-0 bg-white border-t border-neutral-200 transition-all duration-300 ease-out ${
                            isHovered ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
                        }`}
                    >
                        {/* Colors Row */}
                        <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-100">
                            <span className="font-utility text-[10px] uppercase tracking-wider text-neutral-500">
                                Colours
                            </span>
                            <div className="flex gap-2">
                                {colors.map((color) => (
                                    <button
                                        key={color.name}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            setSelectedColor(color.name);
                                        }}
                                        className={`w-5 h-5 rounded-full border-2 transition-all ${
                                            selectedColor === color.name 
                                                ? "border-black scale-110" 
                                                : "border-transparent hover:scale-110"
                                        }`}
                                        style={{ backgroundColor: color.hex }}
                                        title={color.name}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Sizes Row */}
                        <div className="flex items-center justify-between px-4 py-3">
                            <span className="font-utility text-[10px] uppercase tracking-wider text-neutral-500">
                                Sizes
                            </span>
                            <div className="flex gap-1">
                                {sizes.map((size) => (
                                    <button
                                        key={size}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            setSelectedSize(size);
                                        }}
                                        className={`px-2 py-1 font-utility text-[10px] transition-all ${
                                            selectedSize === size 
                                                ? "bg-black text-white" 
                                                : "text-neutral-600 hover:text-black"
                                        }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </Link>
    );
}
