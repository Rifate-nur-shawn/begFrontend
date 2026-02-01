"use client";

import { useCartStore } from "@/store/cart-store";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import { orderApi } from "@/lib/api/orders";

export default function CheckoutPage() {
  const { items, clearCart } = useCartStore();
  const total = items.reduce((sum, item) => sum + (item.product.salePrice || item.product.basePrice) * item.quantity, 0);
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  // Redirect if cart empty
  if (items.length === 0 && !isProcessing) {
     if (typeof window !== "undefined") {
         // Simple client-side redirect check or show empty state
         // For now let's just show an empty message to avoid hydration mismatches
     }
  }

// State for form
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postalCode: "",
    phone: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    try {
        await orderApi.create({
            address: {
                email: formData.email,
                firstName: formData.firstName,
                lastName: formData.lastName,
                street: formData.address,
                city: formData.city,
                zip: formData.postalCode,
                phone: formData.phone
            },
            paymentMethod: "stripe" // Mock payment method
        });
        
        clearCart();
        alert("Order placed successfully! Welcome to Velancis.");
        router.push("/account"); // Redirect to account orders
    } catch (err) {
        console.error("Checkout failed", err);
        alert("Failed to place order. Please try again.");
    } finally {
        setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 pt-32 pb-24 px-4 md:px-12">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-24">
        
        {/* Left: Form */}
        <div className="md:col-span-7">
             <form id="checkout-form" onSubmit={handleOrder}>
                 <h1 className="font-display text-4xl mb-12">Checkout</h1>
                 
                 {/* Section: Contact */}
                 <div className="mb-12">
                    <h2 className="font-utility text-xs uppercase tracking-widest text-neutral-500 mb-6 border-b border-neutral-200 pb-2">Contact Information</h2>
                    <div className="space-y-4">
                        <input name="email" value={formData.email} onChange={handleInputChange} type="email" placeholder="Email Address" required className="w-full bg-transparent border-b border-neutral-300 py-3 focus:outline-none focus:border-black transition-colors font-utility text-sm placeholder:text-neutral-400" />
                        <div className="grid grid-cols-2 gap-4">
                            <input name="firstName" value={formData.firstName} onChange={handleInputChange} type="text" placeholder="First Name" required className="w-full bg-transparent border-b border-neutral-300 py-3 focus:outline-none focus:border-black transition-colors font-utility text-sm placeholder:text-neutral-400" />
                            <input name="lastName" value={formData.lastName} onChange={handleInputChange} type="text" placeholder="Last Name" required className="w-full bg-transparent border-b border-neutral-300 py-3 focus:outline-none focus:border-black transition-colors font-utility text-sm placeholder:text-neutral-400" />
                        </div>
                    </div>
                 </div>

                 {/* Section: Shipping */}
                 <div className="mb-12">
                    <h2 className="font-utility text-xs uppercase tracking-widest text-neutral-500 mb-6 border-b border-neutral-200 pb-2">Shipping Details</h2>
                    <div className="space-y-4">
                         <input name="address" value={formData.address} onChange={handleInputChange} type="text" placeholder="Address" required className="w-full bg-transparent border-b border-neutral-300 py-3 focus:outline-none focus:border-black transition-colors font-utility text-sm placeholder:text-neutral-400" />
                         <div className="grid grid-cols-2 gap-4">
                            <input name="city" value={formData.city} onChange={handleInputChange} type="text" placeholder="City" required className="w-full bg-transparent border-b border-neutral-300 py-3 focus:outline-none focus:border-black transition-colors font-utility text-sm placeholder:text-neutral-400" />
                            <input name="postalCode" value={formData.postalCode} onChange={handleInputChange} type="text" placeholder="Postal Code" required className="w-full bg-transparent border-b border-neutral-300 py-3 focus:outline-none focus:border-black transition-colors font-utility text-sm placeholder:text-neutral-400" />
                         </div>
                         <input name="phone" value={formData.phone} onChange={handleInputChange} type="text" placeholder="Phone" required className="w-full bg-transparent border-b border-neutral-300 py-3 focus:outline-none focus:border-black transition-colors font-utility text-sm placeholder:text-neutral-400" />
                    </div>
                 </div>
             </form>

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
                        {items.map((item) => {
                            const price = item.product.salePrice || item.product.basePrice;
                            const image = item.product.media?.[0] || item.product.images?.[0] || "";
                            
                            return (
                                <div key={`${item.id}-${item.productId}`} className="flex gap-4">
                                    <div className="relative w-16 h-20 bg-neutral-100 shrink-0">
                                        <Image src={image} alt={item.product.name} fill className="object-cover" />
                                    </div>
                                    <div>
                                        <p className="font-display text-sm">{item.product.name}</p>
                                        <p className="font-utility text-xs text-neutral-500">Qty: {item.quantity}</p>
                                        <p className="font-utility text-xs mt-1">Tk {price}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                <div className="border-t border-neutral-100 pt-6 space-y-2 mb-8">
                     <div className="flex justify-between font-utility text-sm">
                        <span className="text-neutral-500">Subtotal</span>
                        <span>Tk {total.toLocaleString()}</span>
                     </div>
                     <div className="flex justify-between font-utility text-sm">
                        <span className="text-neutral-500">Shipping</span>
                        <span>Calculated at next step</span>
                     </div>
                     <div className="flex justify-between font-utility text-sm pt-4 border-t border-dashed border-neutral-200">
                        <span>Total</span>
                        <span className="font-bold">Tk {total.toLocaleString()}</span>
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
