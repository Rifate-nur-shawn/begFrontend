"use client";

import { useCartStore } from "@/store/cart-store";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from "react";

export default function CheckoutPage() {
  const { items, clearCart } = useCartStore();
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  // Redirect if cart empty
  if (items.length === 0 && !isProcessing) {
     if (typeof window !== "undefined") {
         // Simple client-side redirect check or show empty state
         // For now let's just show an empty message to avoid hydration mismatches
     }
  }

  const handleOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    clearCart();
    alert("Order placed successfully! Welcome to BegOnShop.");
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-canvas pt-32 pb-12 px-4 md:px-12">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24">
        
        {/* Left: Form */}
        <div>
            <h1 className="font-display text-4xl mb-8">Checkout</h1>
            <form onSubmit={handleOrder} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <input required placeholder="First Name" className="w-full p-4 bg-neutral-50 border border-neutral-200 font-utility text-sm focus:outline-none focus:border-primary placeholder:uppercase placeholder:tracking-widest" />
                    <input required placeholder="Last Name" className="w-full p-4 bg-neutral-50 border border-neutral-200 font-utility text-sm focus:outline-none focus:border-primary placeholder:uppercase placeholder:tracking-widest" />
                </div>
                <input required type="email" placeholder="Email Address" className="w-full p-4 bg-neutral-50 border border-neutral-200 font-utility text-sm focus:outline-none focus:border-primary placeholder:uppercase placeholder:tracking-widest" />
                <input required placeholder="Address" className="w-full p-4 bg-neutral-50 border border-neutral-200 font-utility text-sm focus:outline-none focus:border-primary placeholder:uppercase placeholder:tracking-widest" />
                
                <div className="grid grid-cols-2 gap-4">
                    <input required placeholder="City" className="w-full p-4 bg-neutral-50 border border-neutral-200 font-utility text-sm focus:outline-none focus:border-primary placeholder:uppercase placeholder:tracking-widest" />
                    <input required placeholder="Postal Code" className="w-full p-4 bg-neutral-50 border border-neutral-200 font-utility text-sm focus:outline-none focus:border-primary placeholder:uppercase placeholder:tracking-widest" />
                </div>

                <div className="pt-8">
                    <button 
                        type="submit"
                        disabled={isProcessing}
                        className="w-full py-5 bg-primary text-canvas font-utility text-sm uppercase tracking-widest hover:bg-neutral-800 transition-colors disabled:opacity-50"
                    >
                        {isProcessing ? "Processing..." : "Place Order"}
                    </button>
                    <p className="mt-4 text-[10px] text-neutral-400 font-utility uppercase text-center">
                        This is a simulated checkout. No payment will be processed.
                    </p>
                </div>
            </form>
        </div>

        {/* Right: Summary */}
        <div className="bg-neutral-50 p-8 h-fit top-32">
            <h2 className="font-utility text-xs uppercase tracking-widest mb-6 border-b border-neutral-200 pb-4">Order Summary</h2>
            <div className="space-y-4 mb-8">
                {items.map((item, i) => (
                    <div key={i} className="flex gap-4">
                         <div className="relative w-16 h-20 bg-white shrink-0">
                            <Image src={item.image} alt={item.name} fill className="object-cover" />
                         </div>
                         <div>
                            <p className="font-display text-sm">{item.name}</p>
                            <p className="font-utility text-[10px] text-neutral-500 uppercase">Size: {item.size} x {item.quantity}</p>
                            <p className="font-utility text-xs mt-1">${item.price.toLocaleString()}</p>
                         </div>
                    </div>
                ))}
            </div>
            <div className="flex justify-between font-utility text-sm uppercase tracking-widest border-t border-neutral-200 pt-4">
                <span>Total</span>
                <span>${total.toLocaleString()}</span>
            </div>
        </div>

      </div>
    </div>
  );
}
