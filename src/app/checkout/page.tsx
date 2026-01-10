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
    <div className="min-h-screen bg-neutral-50 pt-32 pb-24 px-4 md:px-12">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-24">
        
        {/* Left: Form */}
        <div className="md:col-span-7">
             <h1 className="font-display text-4xl mb-12">Checkout</h1>
             
             {/* Section: Contact */}
             <div className="mb-12">
                <h2 className="font-utility text-xs uppercase tracking-widest text-neutral-500 mb-6 border-b border-neutral-200 pb-2">Contact Information</h2>
                <div className="space-y-4">
                    <input type="email" placeholder="Email Address" className="w-full bg-transparent border-b border-neutral-300 py-3 focus:outline-none focus:border-black transition-colors font-utility text-sm placeholder:text-neutral-400" />
                    <div className="grid grid-cols-2 gap-4">
                        <input type="text" placeholder="First Name" className="w-full bg-transparent border-b border-neutral-300 py-3 focus:outline-none focus:border-black transition-colors font-utility text-sm placeholder:text-neutral-400" />
                        <input type="text" placeholder="Last Name" className="w-full bg-transparent border-b border-neutral-300 py-3 focus:outline-none focus:border-black transition-colors font-utility text-sm placeholder:text-neutral-400" />
                    </div>
                </div>
             </div>

             {/* Section: Shipping */}
             <div className="mb-12">
                <h2 className="font-utility text-xs uppercase tracking-widest text-neutral-500 mb-6 border-b border-neutral-200 pb-2">Shipping Details</h2>
                <div className="space-y-4">
                     <input type="text" placeholder="Address" className="w-full bg-transparent border-b border-neutral-300 py-3 focus:outline-none focus:border-black transition-colors font-utility text-sm placeholder:text-neutral-400" />
                     <div className="grid grid-cols-2 gap-4">
                        <input type="text" placeholder="City" className="w-full bg-transparent border-b border-neutral-300 py-3 focus:outline-none focus:border-black transition-colors font-utility text-sm placeholder:text-neutral-400" />
                        <input type="text" placeholder="Postal Code" className="w-full bg-transparent border-b border-neutral-300 py-3 focus:outline-none focus:border-black transition-colors font-utility text-sm placeholder:text-neutral-400" />
                     </div>
                     <input type="text" placeholder="Phone" className="w-full bg-transparent border-b border-neutral-300 py-3 focus:outline-none focus:border-black transition-colors font-utility text-sm placeholder:text-neutral-400" />
                </div>
             </div>

             {/* Section: Payment (Mock) */}
             <div className="mb-12">
                <h2 className="font-utility text-xs uppercase tracking-widest text-neutral-500 mb-6 border-b border-neutral-200 pb-2">Payment</h2>
                 <div className="p-6 bg-white border border-neutral-200 text-center">
                    <p className="font-utility text-sm text-neutral-500">Secure Payment will be handled by Stripe.</p>
                 </div>
             </div>
        </div>

        {/* Right: Order Summary (Sticky) */}
        <div className="md:col-span-5">
            <div className="sticky top-32 bg-white p-8 border border-neutral-100 shadow-sm">
                <h2 className="font-display text-2xl mb-8">Order Summary</h2>
                
                {items.length === 0 ? (
                    <p className="font-utility text-sm text-neutral-500 mb-6">Your bag is empty.</p>
                ) : (
                    <div className="space-y-6 mb-8 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                        {items.map((item) => (
                            <div key={`${item.id}-${item.size}`} className="flex gap-4">
                                <div className="relative w-16 h-20 bg-neutral-100 shrink-0">
                                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                                </div>
                                <div>
                                    <p className="font-display text-sm">{item.name}</p>
                                    <p className="font-utility text-xs text-neutral-500">{item.size} | x{item.quantity}</p>
                                    <p className="font-utility text-xs mt-1">${item.price}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="border-t border-neutral-100 pt-6 space-y-2 mb-8">
                     <div className="flex justify-between font-utility text-sm">
                        <span className="text-neutral-500">Subtotal</span>
                        <span>${total.toLocaleString()}</span>
                     </div>
                     <div className="flex justify-between font-utility text-sm">
                        <span className="text-neutral-500">Shipping</span>
                        <span>Calculated at next step</span>
                     </div>
                     <div className="flex justify-between font-utility text-sm pt-4 border-t border-dashed border-neutral-200">
                        <span>Total</span>
                        <span className="font-bold">${total.toLocaleString()}</span>
                     </div>
                </div>

                <div className="w-full bg-black text-white py-4 font-utility text-xs uppercase tracking-widest hover:bg-neutral-800 transition-colors text-center cursor-pointer" onClick={() => (document.querySelector('form') as HTMLFormElement)?.requestSubmit()}>
                    {isProcessing ? "Processing..." : "Place Order"}
                </div>
            </div>
        </div>

      </div>
    </div>
  );
}
