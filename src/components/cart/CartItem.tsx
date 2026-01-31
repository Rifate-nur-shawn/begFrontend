"use client";

import Image from "next/image";
import { useCartStore, CartItem as CartItemType } from "@/store/cart-store";
import { motion } from "framer-motion";

export default function CartItem({ item }: { item: CartItemType }) {
  const { removeItem, updateQuantity } = useCartStore();

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
          src={item.image}
          alt={item.name}
          fill
          className="object-cover"
        />
      </div>
      <div className="flex flex-col justify-between flex-grow">
        <div>
          <h4 className="font-display text-sm uppercase tracking-wide text-primary">{item.name}</h4>
          <p className="font-utility text-[10px] text-neutral-500 uppercase mt-1">
            Size: {item.size}
          </p>
        </div>
        <div className="flex justify-between items-end">
          <div className="flex flex-col gap-1">
             <p className="font-utility text-xs text-primary">Tk {item.price.toLocaleString()}</p>
             
             {/* Quantity Controls */}
             <div className="flex items-center gap-3 mt-1">
                 <button 
                    onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                    className="w-5 h-5 flex items-center justify-center border border-neutral-200 text-primary font-utility text-[10px] hover:bg-neutral-100 transition-colors"
                    disabled={item.quantity <= 1}
                 >
                    -
                 </button>
                 <span className="font-utility text-xs text-primary w-3 text-center">{item.quantity}</span>
                 <button 
                    onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                     className="w-5 h-5 flex items-center justify-center border border-neutral-200 text-primary font-utility text-[10px] hover:bg-neutral-100 transition-colors"
                 >
                    +
                 </button>
             </div>
          </div>
          
          <button 
            onClick={() => removeItem(item.id, item.size)}
            className="font-utility text-[10px] uppercase text-neutral-400 hover:text-alert transition-colors"
          >
            Remove
          </button>
        </div>
      </div>
    </motion.div>
  );
}
