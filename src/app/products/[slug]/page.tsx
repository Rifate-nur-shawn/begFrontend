"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import api from "@/lib/api/axios";
import { useCartStore } from "@/store/cart-store";
import MagneticButton from "@/components/ui/MagneticButton";

export default function ProductPage() {
    const params = useParams();
    const slug = params?.slug as string;
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const { addItem } = useCartStore();

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

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center bg-canvas">
                 <p className="font-utility text-xs tracking-widest animate-pulse">LOADING PRODUCT...</p>
            </div>
        );
    }

    if (!product) {
         return (
            <div className="h-screen flex items-center justify-center bg-canvas">
                 <p className="font-utility text-xs tracking-widest">PRODUCT NOT FOUND</p>
            </div>
        );
    }

    // Safety checks
    const image = (product.media && product.media.images && product.media.images.length > 0) 
        ? product.media.images[0] 
        : "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=2069";

    const price = product.salePrice && product.salePrice < product.basePrice ? product.salePrice : product.basePrice;

    const handleAddToCart = () => {
        addItem({
            id: product.id,
            productId: product.id,
            name: product.name,
            price: price,
            image: image,
            size: "One Size",
            color: "Default"
        });
        // Feedback could be opening the cart drawer
    };

    return (
        <div className="min-h-screen bg-canvas pt-32 pb-24 px-4 md:px-12">
            <div className="max-w-[1920px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
                {/* Images Section */}
                <div className="space-y-4">
                     {/* Main Image */}
                     <div className="relative aspect-[3/4] w-full bg-neutral-100 overflow-hidden">
                        <Image
                            src={image}
                            alt={product.name}
                            fill
                            className="object-cover"
                        />
                     </div>
                     {/* Additional images grid if available */}
                     {product.media?.images?.slice(1).map((img: string, i: number) => (
                         <div key={i} className="relative aspect-[3/4] w-full bg-neutral-100 overflow-hidden">
                            <Image src={img} alt={`${product.name} ${i}`} fill className="object-cover" />
                         </div>
                     ))}
                </div>

                {/* Details Section (Sticky) */}
                <div className="md:sticky md:top-32 h-fit">
                    <p className="font-utility text-xs text-neutral-500 uppercase tracking-widest mb-4">
                        {product.category?.name || "Collection"}
                    </p>
                    <h1 className="font-display text-5xl md:text-7xl mb-6 leading-none">
                        {product.name}
                    </h1>
                    <p className="font-utility text-lg tracking-widest mb-8">
                        ${price.toFixed(2)}
                    </p>

                    <div className="font-utility text-sm leading-relaxed text-neutral-600 mb-12 max-w-md">
                        {product.description}
                    </div>

                    <div className="flex flex-col gap-4 max-w-sm">
                        <div onClick={handleAddToCart} className="mb-4">
                             <MagneticButton>
                                Add to Bag
                             </MagneticButton>
                        </div>
                        <p className="font-utility text-[10px] text-neutral-400 uppercase tracking-widest text-center">
                            Free shipping and returns
                        </p>
                    </div>
                    
                    {/* Specs / Attributes */}
                     {product.specifications && (
                        <div className="mt-16 border-t border-neutral-200 pt-8">
                            <h3 className="font-utility text-xs uppercase tracking-widest mb-4">Specifications</h3>
                            <div className="grid grid-cols-2 gap-4">
                                {Object.entries(product.specifications).map(([key, val]) => (
                                    <div key={key}>
                                        <span className="block font-utility text-[10px] text-neutral-500 uppercase">{key}</span>
                                        <span className="block font-utility text-xs mt-1 capitalize">{String(val)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
