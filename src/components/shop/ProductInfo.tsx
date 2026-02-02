"use client";

import { useState } from "react";
import { Product } from "@/lib/api/products-hooks";
import { useCartStore } from "@/store/cart-store";
import { useUIStore } from "@/store/ui-store";

export default function ProductInfo({ product }: { product: Product }) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const { openCart: openCartUI } = useUIStore();
  const { addItem: addToStore } = useCartStore();

  const handleAddToCart = () => {
    if (!selectedSize) return;
    
    // Find variant ID from selected size if available
    const selectedVariant = product.variants?.find(v => v.name === selectedSize);
    const variantId = selectedVariant?.id;
    
    addToStore(product.id, 1, variantId);
    openCartUI();
  };

  return (
    <div className="sticky top-24 px-4 md:px-12 py-8 h-fit">
      <div className="mb-8">
        <h1 className="font-display text-4xl md:text-5xl mb-2">{product.name}</h1>
        <p className="font-utility text-lg">Tk {(product.salePrice || product.basePrice).toLocaleString()}</p>
      </div>

// ...

       <div className="mt-6 border-t border-neutral-100 pt-6 space-y-2">
            <div className="flex justify-between font-utility text-[10px] uppercase text-neutral-500">
                <span>Product Code</span>
                <span>{product.id?.slice(0, 8).toUpperCase()}</span>
            </div>
             <div className="flex justify-between font-utility text-[10px] uppercase text-neutral-500">
                <span>Category</span>
                <span>{product.categories?.[0]?.name || 'Uncategorized'}</span>
            </div>
       </div>

    </div>
  );
}
