"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import api from "@/lib/api/axios";
import { useCartStore } from "@/store/cart-store";
import { useUIStore } from "@/store/ui-store";

interface Product {
    id: string;
    name: string;
    slug: string;
    description: string;
    basePrice: number;
    salePrice?: number;
    media?: {
        images?: string[];
    };
    category?: {
        name: string;
        slug: string;
    };
    specifications?: Record<string, string>;
}

export default function ProductPage() {
    const params = useParams();
    const slug = params?.slug as string;
    
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [isAdded, setIsAdded] = useState(false);
    const { addItem } = useCartStore();
    const { openCart } = useUIStore();

    useEffect(() => {
        if (!slug) return;
        async function fetchProduct() {
            setLoading(true);
            try {
                const { data } = await api.get(`/products/${slug}`);
                setProduct(data);
            } catch (err) {
                console.error("Failed to fetch product", err);
            } finally {
                setLoading(false);
            }
        }
        fetchProduct();
    }, [slug]);

    // Loading state with luxury skeleton
    if (loading) {
        return (
            <div className="min-h-screen bg-canvas pt-32 pb-24 px-4 md:px-12">
                <div className="max-w-[1920px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
                    <div className="space-y-4">
                        <div className="aspect-[3/4] bg-neutral-100 animate-pulse" />
                        <div className="grid grid-cols-4 gap-2">
                            {[1,2,3,4].map(i => (
                                <div key={i} className="aspect-square bg-neutral-100 animate-pulse" />
                            ))}
                        </div>
                    </div>
                    <div className="space-y-6 pt-8">
                        <div className="h-4 w-24 bg-neutral-100 animate-pulse" />
                        <div className="h-16 w-3/4 bg-neutral-100 animate-pulse" />
                        <div className="h-6 w-32 bg-neutral-100 animate-pulse" />
                        <div className="h-32 w-full bg-neutral-100 animate-pulse" />
                    </div>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-canvas gap-6">
                <h1 className="font-display text-4xl">Product Not Found</h1>
                <p className="font-utility text-xs tracking-widest text-neutral-500 uppercase">
                    The product you&apos;re looking for doesn&apos;t exist
                </p>
                <Link 
                    href="/collections/sarees" 
                    className="font-utility text-xs tracking-widest uppercase border border-primary px-6 py-3 hover:bg-primary hover:text-white transition-colors"
                >
                    Browse Collection
                </Link>
            </div>
        );
    }

    const images = product.media?.images || [];
    const currentImage = images[selectedImageIndex] || "/products/product_saree_red_1768316591404.png";
    const price = product.salePrice && product.salePrice < product.basePrice ? product.salePrice : product.basePrice;
    const hasDiscount = product.salePrice && product.salePrice < product.basePrice;

    const handleAddToCart = () => {
        addItem({
            id: product.id,
            productId: product.id,
            name: product.name,
            price: price,
            image: currentImage,
            size: "One Size",
            color: "Default"
        });
        setIsAdded(true);
        setTimeout(() => {
            openCart();
            setIsAdded(false);
        }, 500);
    };

    return (
        <div className="min-h-screen bg-canvas text-primary">
            {/* Breadcrumb */}
            <div className="pt-28 pb-8 px-4 md:px-12 max-w-[1920px] mx-auto">
                <nav className="font-utility text-[10px] tracking-widest uppercase text-neutral-500 flex gap-2">
                    <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                    <span>/</span>
                    <Link href="/collections/sarees" className="hover:text-primary transition-colors">
                        {product.category?.name || "Collection"}
                    </Link>
                    <span>/</span>
                    <span className="text-primary">{product.name}</span>
                </nav>
            </div>

            <div className="pb-24 px-4 md:px-12">
                <div className="max-w-[1920px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
                    
                    {/* Image Gallery - Left Side */}
                    <div className="lg:col-span-7 space-y-4">
                        {/* Main Image with Animation */}
                        <motion.div 
                            key={selectedImageIndex}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.4 }}
                            className="relative aspect-[3/4] w-full bg-neutral-50 overflow-hidden group cursor-zoom-in"
                        >
                            <Image
                                src={currentImage}
                                alt={product.name}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                priority
                                sizes="(max-width: 1024px) 100vw, 60vw"
                            />
                        </motion.div>
                        
                        {/* Thumbnail Gallery */}
                        {images.length > 1 && (
                            <div className="grid grid-cols-4 gap-2">
                                {images.map((img, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setSelectedImageIndex(i)}
                                        className={`relative aspect-square bg-neutral-50 overflow-hidden transition-all duration-300 ${
                                            selectedImageIndex === i 
                                                ? "ring-2 ring-primary ring-offset-2" 
                                                : "opacity-60 hover:opacity-100"
                                        }`}
                                    >
                                        <Image
                                            src={img}
                                            alt={`${product.name} ${i + 1}`}
                                            fill
                                            className="object-cover"
                                            sizes="150px"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Details - Right Side (Sticky) */}
                    <div className="lg:col-span-5">
                        <div className="lg:sticky lg:top-32 space-y-8">
                            {/* Category */}
                            <motion.p 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="font-utility text-[10px] text-neutral-500 uppercase tracking-[0.2em]"
                            >
                                {product.category?.name || "Collection"}
                            </motion.p>
                            
                            {/* Title */}
                            <motion.h1 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="font-display text-4xl md:text-5xl lg:text-6xl leading-[0.95]"
                            >
                                {product.name}
                            </motion.h1>
                            
                            {/* Price */}
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="flex items-baseline gap-4"
                            >
                                <span className="font-utility text-2xl tracking-wide">
                                    ${price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                </span>
                                {hasDiscount && (
                                    <span className="font-utility text-sm text-neutral-400 line-through">
                                        ${product.basePrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                    </span>
                                )}
                            </motion.div>

                            {/* Description */}
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="font-utility text-sm leading-[1.8] text-neutral-600 max-w-lg"
                            >
                                {product.description}
                            </motion.div>

                            {/* Divider */}
                            <div className="border-t border-neutral-200" />

                            {/* Add to Cart Button */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                            >
                                <button
                                    onClick={handleAddToCart}
                                    disabled={isAdded}
                                    className={`w-full py-5 font-utility text-xs uppercase tracking-[0.2em] transition-all duration-500 ${
                                        isAdded 
                                            ? "bg-green-600 text-white" 
                                            : "bg-primary text-white hover:bg-neutral-800"
                                    }`}
                                >
                                    {isAdded ? "✓ Added to Bag" : "Add to Bag"}
                                </button>
                                
                                <p className="font-utility text-[10px] text-neutral-400 uppercase tracking-widest text-center mt-4">
                                    Complimentary shipping & returns
                                </p>
                            </motion.div>

                            {/* Product Details Accordion */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.6 }}
                                className="space-y-4 pt-4"
                            >
                                {/* Specifications */}
                                {product.specifications && Object.keys(product.specifications).length > 0 && (
                                    <details className="group border-t border-neutral-200 pt-4">
                                        <summary className="flex justify-between items-center cursor-pointer list-none font-utility text-xs uppercase tracking-widest">
                                            <span>Specifications</span>
                                            <span className="transition-transform group-open:rotate-45">+</span>
                                        </summary>
                                        <div className="mt-4 grid grid-cols-2 gap-4">
                                            {Object.entries(product.specifications).map(([key, val]) => (
                                                <div key={key}>
                                                    <span className="block font-utility text-[10px] text-neutral-500 uppercase">{key}</span>
                                                    <span className="block font-utility text-xs mt-1 capitalize">{String(val)}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </details>
                                )}

                                {/* Care */}
                                <details className="group border-t border-neutral-200 pt-4">
                                    <summary className="flex justify-between items-center cursor-pointer list-none font-utility text-xs uppercase tracking-widest">
                                        <span>Care Instructions</span>
                                        <span className="transition-transform group-open:rotate-45">+</span>
                                    </summary>
                                    <div className="mt-4 font-utility text-xs text-neutral-600 leading-relaxed">
                                        Dry clean only. Store in a cool, dry place away from direct sunlight. 
                                        Use padded hangers to maintain shape.
                                    </div>
                                </details>

                                {/* Shipping */}
                                <details className="group border-t border-neutral-200 pt-4">
                                    <summary className="flex justify-between items-center cursor-pointer list-none font-utility text-xs uppercase tracking-widest">
                                        <span>Shipping & Returns</span>
                                        <span className="transition-transform group-open:rotate-45">+</span>
                                    </summary>
                                    <div className="mt-4 font-utility text-xs text-neutral-600 leading-relaxed space-y-2">
                                        <p>• Free standard shipping on all orders</p>
                                        <p>• Express delivery available (2-3 business days)</p>
                                        <p>• Free returns within 30 days of delivery</p>
                                        <p>• Items must be unworn with original tags attached</p>
                                    </div>
                                </details>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
