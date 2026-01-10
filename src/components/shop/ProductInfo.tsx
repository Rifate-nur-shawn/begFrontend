"use client";

import { useState } from "react";
import { Product } from "@/lib/api/products";
import { useCartStore } from "@/store/cart-store";
import { useUIStore } from "@/store/ui-store";

export default function ProductInfo({ product }: { product: Product }) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const { openCart: openCartUI } = useUIStore();
  const { addItem: addToStore } = useCartStore();

  const handleAddToCart = () => {
    if (!selectedSize) return;
    
    addToStore({
        id: product.id,
        name: product.name,
        price: product.price,
        size: selectedSize,
        color: "Default", // Mocking color for now
        image: product.images[0]
    });
    openCartUI();
  };

  return (
    <div className="sticky top-24 px-4 md:px-12 py-8 h-fit">
      <div className="mb-8">
        <h1 className="font-display text-4xl md:text-5xl mb-2">{product.name}</h1>
        <p className="font-utility text-lg">${product.price.toLocaleString()}</p>
      </div>

      <div className="mb-8">
        <p className="font-utility text-sm leading-relaxed text-neutral-600 max-w-md">
            {product.description}
        </p>
      </div>

      {/* Size Selector */}
      <div className="mb-8">
        <p className="font-utility text-xs uppercase tracking-widest mb-3 text-neutral-500">Select Size</p>
        <div className="flex flex-wrap gap-2">
            {product.variants.map((variant) => (
                <button
                    key={variant.size}
                    disabled={!variant.inStock}
                    onClick={() => setSelectedSize(variant.size)}
                    className={`w-12 h-12 flex items-center justify-center border text-xs font-utility transition-all duration-200
                        ${selectedSize === variant.size 
                            ? "bg-primary text-canvas border-primary" 
                            : "bg-transparent border-neutral-200 hover:border-primary text-primary"
                        }
                        ${!variant.inStock && "opacity-50 cursor-not-allowed decoration-slice"}
                    `}
                >
                    {variant.size}
                </button>
            ))}
        </div>
      </div>

      {/* Actions */}
      <button
        onClick={handleAddToCart}
        disabled={!selectedSize}
        className={`w-full py-4 text-center font-utility text-sm uppercase tracking-widest transition-all duration-300
            ${selectedSize 
                ? "bg-primary text-canvas hover:bg-neutral-800" 
                : "bg-neutral-200 text-neutral-400 cursor-not-allowed"
            }
        `}
      >
        {selectedSize ? "Add to Bag" : "Select a Size"}
      </button>
      
       <div className="mt-6 border-t border-neutral-100 pt-6 space-y-2">
            <div className="flex justify-between font-utility text-[10px] uppercase text-neutral-500">
                <span>Product Code</span>
                <span>{product.id.toUpperCase()}</span>
            </div>
             <div className="flex justify-between font-utility text-[10px] uppercase text-neutral-500">
                <span>Category</span>
                <span>{product.category}</span>
            </div>
       </div>

    </div>
  );
}
