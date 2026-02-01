"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useProduct } from "@/lib/api/products-hooks";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { useUIStore } from "@/store/ui-store";
import { useAuthStore } from "@/store/auth-store";
import ReviewSection from "@/components/product/ReviewSection";

export default function ProductPage() {
    const params = useParams();
    const slug = params?.slug as string;
    
    const { product, isLoading } = useProduct(slug);
    
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [isAdded, setIsAdded] = useState(false);
    const [activeAccordion, setActiveAccordion] = useState<string | null>(null);
    const { addItem } = useCartStore();
    const { addItem: addToWishlist, isInWishlist, removeItem: removeFromWishlist } = useWishlistStore();
    const { openCart, openLogin } = useUIStore();
    const { isAuthenticated } = useAuthStore();

    const isWishlisted = product ? isInWishlist(product.id) : false;

    useEffect(() => {
        setSelectedImageIndex(0);
    }, [product?.id]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#FAFAF8] pt-24">
                <div className="h-[calc(100vh-96px)] grid grid-cols-1 lg:grid-cols-5 gap-0">
                    <div className="lg:col-span-3 bg-[#F0EDE8] animate-pulse" />
                    <div className="lg:col-span-2 p-8 flex flex-col justify-center space-y-4">
                        <div className="h-3 w-20 bg-[#E5E2DD] animate-pulse rounded" />
                        <div className="h-10 w-3/4 bg-[#E5E2DD] animate-pulse rounded" />
                        <div className="h-6 w-24 bg-[#E5E2DD] animate-pulse rounded" />
                    </div>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAFAF8] gap-4">
                <h1 className="font-display text-4xl">Product Not Found</h1>
                <Link href="/collections/new-arrivals" className="text-sm underline hover:no-underline">
                    ← Back to Collection
                </Link>
            </div>
        );
    }

    const images = product.media && product.media.length > 0 
        ? product.media 
        : product.images && product.images.length > 0 
            ? product.images 
            : [];
            
    const currentImage = images[selectedImageIndex] || "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1935&auto=format&fit=crop";
    const price = product.salePrice && product.salePrice < product.basePrice ? product.salePrice : product.basePrice;
    const hasDiscount = product.salePrice && product.salePrice < product.basePrice;
    const discountPercent = hasDiscount ? Math.round((1 - (product.salePrice || 0) / product.basePrice) * 100) : 0;
    
    // Fallback category logic
    const categoryName = product.categories?.[0]?.name || "Collection";
    const categorySlug = product.categories?.[0]?.slug || "new-arrivals";

    const handleAddToCart = () => {
        addItem(product.id, 1);
        setIsAdded(true);
        setTimeout(() => {
            openCart();
            setIsAdded(false);
        }, 600);
    };

    const handleWishlist = () => {
        if (isWishlisted) {
            removeFromWishlist(product.id);
        } else {
            addToWishlist(product);
        }
    };

    const toggleAccordion = (id: string) => {
        setActiveAccordion(activeAccordion === id ? null : id);
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Compact Breadcrumb */}
            <div className="px-4 lg:px-8 py-2 bg-white">
                <nav className="text-[10px] tracking-[0.12em] uppercase text-neutral-400 flex items-center gap-1.5 max-w-[1800px] mx-auto">
                    <Link href="/" className="hover:text-black transition-colors">Home</Link>
                    <span>/</span>
                    <Link href={`/collections/${categorySlug}`} className="hover:text-black transition-colors">
                        {categoryName}
                    </Link>
                    <span>/</span>
                    <span className="text-neutral-600 truncate max-w-[200px]">{product.name}</span>
                </nav>
            </div>

            {/* Main Content - Optimized Split */}
            <div className="px-4 lg:px-8 pb-8">
                <div className="max-w-[1800px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
                    
                    {/* Left: Image Gallery - 60% width, compact height */}
                    <div className="lg:col-span-7 relative">
                        {/* Main Image */}
                        <div className="relative aspect-[4/3] lg:aspect-[4/3] bg-[#F5F3EF] overflow-hidden group">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={selectedImageIndex}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="absolute inset-0"
                                >
                                    <Image
                                        src={currentImage}
                                        alt={product.name}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                                        priority
                                        sizes="(max-width: 1024px) 100vw, 60vw"
                                    />
                                </motion.div>
                            </AnimatePresence>

                            {/* Discount Badge */}
                            {hasDiscount && (
                                <div className="absolute top-4 left-4 bg-black text-white px-3 py-1.5 text-[10px] tracking-widest font-medium">
                                    SAVE {discountPercent}%
                                </div>
                            )}

                            {/* Navigation Arrows */}
                            {images.length > 1 && (
                                <>
                                    <button 
                                        onClick={() => setSelectedImageIndex(prev => prev === 0 ? images.length - 1 : prev - 1)}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur flex items-center justify-center hover:bg-white transition-colors"
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                                        </svg>
                                    </button>
                                    <button 
                                        onClick={() => setSelectedImageIndex(prev => prev === images.length - 1 ? 0 : prev + 1)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur flex items-center justify-center hover:bg-white transition-colors"
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Thumbnail Row */}
                        {images.length > 1 && (
                            <div className="flex gap-2 mt-2">
                                {images.map((img, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setSelectedImageIndex(i)}
                                        className={`relative w-16 h-16 lg:w-20 lg:h-20 overflow-hidden transition-all ${
                                            i === selectedImageIndex 
                                                ? 'ring-2 ring-black ring-offset-1' 
                                                : 'opacity-50 hover:opacity-100'
                                        }`}
                                    >
                                        <Image src={img} alt="" fill className="object-cover" sizes="80px" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right: Product Details - 40% width, compact */}
                    <div className="lg:col-span-5 flex flex-col">
                        {/* Category */}
                        <span className="text-[10px] tracking-[0.2em] uppercase text-neutral-400 mb-2">
                            {categoryName}
                        </span>

                        {/* Product Name */}
                        <h1 className="font-display text-2xl lg:text-3xl xl:text-4xl leading-tight mb-3">
                            {product.name}
                        </h1>

                        {/* Price */}
                        <div className="flex items-baseline gap-3 mb-4">
                            <span className="font-display text-xl lg:text-2xl italic">
                                ${price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </span>
                            {hasDiscount && (
                                <span className="text-sm text-neutral-400 line-through">
                                    ${product.basePrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                </span>
                            )}
                        </div>

                        {/* Description - Compact */}
                        <p className="text-[13px] leading-relaxed text-neutral-600 mb-5 line-clamp-3 lg:line-clamp-none">
                            {product.description}
                        </p>

                        {/* Actions */}
                        <div className="flex gap-4 mb-2">
                            <button
                                onClick={handleAddToCart}
                                disabled={isAdded}
                                className={`flex-1 py-4 text-[11px] uppercase tracking-[0.2em] font-medium transition-all duration-400 ${
                                    isAdded 
                                        ? "bg-emerald-600 text-white" 
                                        : "bg-black text-white hover:bg-neutral-800"
                                }`}
                            >
                                {isAdded ? "✓ Added to Cart" : "Add to Cart"}
                            </button>
                            <button
                                onClick={handleWishlist}
                                className={`w-14 flex items-center justify-center border transition-colors ${
                                    isWishlisted 
                                        ? "bg-red-50 border-red-200 text-red-500" 
                                        : "border-neutral-200 text-neutral-400 hover:border-black hover:text-black"
                                }`}
                                title="Add to Wishlist"
                            >
                                <svg className={`w-5 h-5 ${isWishlisted ? "fill-current" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            </button>
                        </div>

                        {/* Quick Info */}
                        <div className="flex items-center justify-center gap-4 py-3 text-[9px] tracking-wider uppercase text-neutral-400 mb-4">
                            <span>Free Shipping</span>
                            <span>•</span>
                            <span>Easy Returns</span>
                        </div>

                        {/* Compact Accordions */}
                        <div className="border-t border-neutral-200 mt-2">
                            {/* Specifications */}
                            {product.specifications && Object.keys(product.specifications).length > 0 && (
                                <div className="border-b border-neutral-200">
                                    <button 
                                        onClick={() => toggleAccordion('specs')}
                                        className="w-full flex justify-between items-center py-3 text-left"
                                    >
                                        <span className="text-[11px] tracking-[0.15em] uppercase font-medium">Specifications</span>
                                        <svg className={`w-4 h-4 transition-transform ${activeAccordion === 'specs' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <AnimatePresence>
                                        {activeAccordion === 'specs' && (
                                            <motion.div 
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.2 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="pb-4 grid grid-cols-2 gap-3">
                                                    {Object.entries(product.specifications).map(([key, val]) => (
                                                        <div key={key}>
                                                            <span className="block text-[9px] text-neutral-400 uppercase tracking-wider">{key}</span>
                                                            <span className="block text-xs text-neutral-700 capitalize">{String(val)}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            )}

                            {/* Care */}
                            <div className="border-b border-neutral-200">
                                <button 
                                    onClick={() => toggleAccordion('care')}
                                    className="w-full flex justify-between items-center py-3 text-left"
                                >
                                    <span className="text-[11px] tracking-[0.15em] uppercase font-medium">Materials & Care</span>
                                    <svg className={`w-4 h-4 transition-transform ${activeAccordion === 'care' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                <AnimatePresence>
                                    {activeAccordion === 'care' && (
                                        <motion.div 
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="pb-4 text-xs text-neutral-600 space-y-1.5">
                                                <p>• Premium Italian leather</p>
                                                <p>• Store in dust bag</p>
                                                <p>• Avoid moisture</p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Shipping */}
                            <div>
                                <button 
                                    onClick={() => toggleAccordion('shipping')}
                                    className="w-full flex justify-between items-center py-3 text-left"
                                >
                                    <span className="text-[11px] tracking-[0.15em] uppercase font-medium">Shipping & Returns</span>
                                    <svg className={`w-4 h-4 transition-transform ${activeAccordion === 'shipping' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                <AnimatePresence>
                                    {activeAccordion === 'shipping' && (
                                        <motion.div 
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="pb-4 text-xs text-neutral-600 space-y-1.5">
                                                <p>• Free express shipping worldwide</p>
                                                <p>• 30-day returns</p>
                                                <p>• Full refund on unworn items</p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Compact Trust Bar */}
                        <div className="mt-4 pt-4 border-t border-neutral-200 flex justify-between text-center">
                            {[
                                { icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z", label: "Authentic" },
                                { icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", label: "Fast" },
                                { icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z", label: "Secure" },
                                { icon: "M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9", label: "Global" }
                            ].map((item, i) => (
                                <div key={i} className="flex flex-col items-center gap-1">
                                    <svg className="w-4 h-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                                    </svg>
                                    <span className="text-[8px] tracking-wider uppercase text-neutral-400">{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Review Section - Added below main content */}
                <ReviewSection productId={product.id} />
            </div>
        </div>
    );
}
            