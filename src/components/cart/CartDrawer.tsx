"use client";

import { useCartStore } from "@/store/cart-store";
import { useUIStore } from "@/store/ui-store";
import { AnimatePresence, motion } from "framer-motion";
import CartItem from "./CartItem";
import Link from "next/link";
import { useEffect } from "react";

export default function CartDrawer() {
  const { isCartOpen, closeCart } = useUIStore();
  const { items } = useCartStore();

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Prevent scrolling when cart is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isCartOpen]);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 250 }}
            className="fixed top-0 right-0 h-full w-full md:w-[450px] bg-canvas z-[70] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-neutral-100">
              <h2 className="font-display text-xl">Shopping Bag ({items.length})</h2>
              <button
                onClick={closeCart}
                className="font-utility text-xs uppercase tracking-widest hover:text-neutral-500"
              >
                Close
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-neutral-500">
                  <p className="font-utility text-sm uppercase tracking-widest">Your bag is empty</p>
                </div>
              ) : (
                items.map((item, i) => (
                    <CartItem key={`${item.id}-${item.size}-${i}`} item={item} />
                ))
              )}
            </div>

             {/* Footer */}
             {items.length > 0 && (
                <div className="p-6 border-t border-neutral-100 bg-neutral-50">
                    <div className="flex justify-between mb-4 font-utility text-sm uppercase tracking-widest">
                        <span>Total</span>
                        <span>${total.toLocaleString()}</span>
                    </div>
                    <Link 
                        href="/checkout" 
                        onClick={closeCart}
                        className="block w-full py-4 bg-primary text-canvas text-center font-utility text-xs uppercase tracking-widest hover:bg-neutral-800 transition-colors"
                    >
                        Proceed to Checkout
                    </Link>
                </div>
             )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
