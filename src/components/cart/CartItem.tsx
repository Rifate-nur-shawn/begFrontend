"use client";

import Image from "next/image";
import { useCartStore } from "@/store/cart-store";
import { CartItem as CartItemType } from "@/types/api";
import { motion } from "framer-motion";

export default function CartItem({ item }: { item: CartItemType }) {
  const { removeItem, updateQuantity } = useCartStore();
  
  const price = item.product.salePrice || item.product.basePrice;
  const image = item.product.media?.[0] || item.product.images?.[0] || "";
  const size = item.variant?.attributes?.size || "One Size"; // Fallback to variant attribute or One Size

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex gap-4 p-4 border-b border-neutral-100"
    >
      <div className="relative w-20 h-26 bg-neutral-100 shrink-0">
        <Image
          src={image}
          alt={item.product.name}
          fill
          className="object-cover"
        />
      </div>
      <div className="flex flex-col justify-between flex-grow">
        <div>
          <h4 className="font-display text-sm uppercase tracking-wide text-primary">{item.product.name}</h4>
          <p className="font-utility text-[10px] text-neutral-500 uppercase mt-1">
            Size: {size}
          </p>
        </div>
        <div className="flex justify-between items-end">
          <div className="flex flex-col gap-1">
             <p className="font-utility text-xs text-primary">Tk {price.toLocaleString()}</p>
             
             {/* Quantity Controls */}
             <div className="flex items-center gap-3 mt-1">
                 <button 
                    onClick={() => updateQuantity(item.productId, item.quantity - 1, item.variantId)}
                    className="w-5 h-5 flex items-center justify-center border border-neutral-200 text-primary font-utility text-[10px] hover:bg-neutral-100 transition-colors"
                    disabled={item.quantity <= 1}
                 >
                    -
                 </button>
                 <span className="font-utility text-xs text-primary w-3 text-center">{item.quantity}</span>
                 <button 
                    onClick={() => updateQuantity(item.productId, item.quantity + 1, item.variantId)}
                     className="w-5 h-5 flex items-center justify-center border border-neutral-200 text-primary font-utility text-[10px] hover:bg-neutral-100 transition-colors"
                 >
                    +
                 </button>
             </div>
          </div>
          
          <button 
            onClick={() => removeItem(item.productId, item.variantId)}
            className="font-utility text-[10px] uppercase text-neutral-400 hover:text-alert transition-colors"
          >
            Remove
          </button>
        </div>
      </div>
    </motion.div>
  );
}
