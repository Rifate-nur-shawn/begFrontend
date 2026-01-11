"use client";

import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/cart-store";

interface Product {
    id: string;
    name: string;
    slug: string;
    basePrice: number;
    salePrice?: number | null; // Allow null or undefined
    media?: {
        images?: string[];
    };
    category?: {
        name: string;
    };
}

export default function ProductCard({ product }: { product: Product }) {
    const { addItem } = useCartStore();
    
    // Safety check for product
    if (!product) return null;

    const price = product.salePrice && product.salePrice < product.basePrice ? product.salePrice : product.basePrice;
    // Handle image safety
    const image = (product.media && product.media.images && product.media.images.length > 0) 
        ? product.media.images[0] 
        : "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=2069"; // Fallback placeholder

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent navigation
        addItem({
            id: product.id,
            productId: product.id, // For backend sync
            name: product.name,
            price: price,
            image: image,
            size: "One Size",
            color: "Default"
        });
        // Feedback?
    };

    return (
        <Link href={`/products/${product.slug}`} className="group block">
            <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100">
                <Image
                    src={image}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                
                {/* Quick Add Overlay */}
                <div className="absolute bottom-0 left-0 w-full p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <button 
                        onClick={handleAddToCart}
                        className="w-full bg-white/90 backdrop-blur-sm text-primary py-3 px-4 font-utility text-xs uppercase tracking-widest hover:bg-black hover:text-white transition-colors"
                    >
                        Add to Bag
                    </button>
                </div>
            </div>
            
            <div className="mt-4 flex justify-between items-start">
                <div>
                    <h3 className="font-display text-lg leading-none mb-1">{product.name}</h3>
                    <p className="font-utility text-[10px] text-neutral-500 uppercase tracking-widest">
                        {product.category?.name || "Collection"}
                    </p>
                </div>
                <div className="font-utility text-xs tracking-widest">
                    ${price.toFixed(2)}
                </div>
            </div>
        </Link>
    );
}
