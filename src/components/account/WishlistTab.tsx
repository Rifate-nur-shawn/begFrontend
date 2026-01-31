import Link from "next/link";
import Image from "next/image";
import { useWishlistStore } from "@/store/wishlist-store";
import { useCartStore } from "@/store/cart-store";
import { useEffect } from "react";

export default function WishlistTab() {
    const { items, fetchWishlist, removeItem, isLoading } = useWishlistStore();
    const { addItem } = useCartStore();

    useEffect(() => {
        fetchWishlist();
    }, []);

    const handleAddToCart = (item: any) => {
        addItem({
            id: item.productId,
            productId: item.productId,
            name: item.name,
            price: item.price,
            image: item.image,
            size: "One Size",
            color: "Default"
        });
    };

    if (isLoading && items.length === 0) {
        return <div className="py-12 text-center text-xs tracking-widest animate-pulse">LOADING WISHLIST...</div>;
    }

    if (items.length === 0) {
        return (
            <div className="py-12 text-center border border-neutral-100">
                <p className="font-utility text-xs tracking-widest text-neutral-500 mb-4">YOUR WISHLIST IS EMPTY</p>
                <Link href="/collections/all" className="inline-block bg-black text-white px-6 py-3 text-[10px] uppercase tracking-widest hover:bg-neutral-800 transition-colors">
                    Explore Collection
                </Link>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
                <div key={item.id} className="group border border-neutral-100 p-4 transition-all hover:border-neutral-300">
                    <div className="relative aspect-square mb-4 bg-neutral-50 overflow-hidden">
                         <Image 
                            src={item.image} 
                            alt={item.name} 
                            fill 
                            className="object-cover transition-transform duration-700 group-hover:scale-105" 
                         />
                         <button 
                            onClick={() => removeItem(item.productId)}
                            className="absolute top-2 right-2 w-8 h-8 bg-white/80 backdrop-blur flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-colors"
                            title="Remove"
                         >
                             <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                             </svg>
                         </button>
                    </div>
                    
                    <Link href={`/products/${item.productId}`} className="block mb-2">
                        <h3 className="font-display text-sm truncate hover:underline">{item.name}</h3>
                    </Link>
                    
                    <div className="flex justify-between items-center mt-4">
                        <span className="font-utility text-xs font-medium">${item.price.toLocaleString()}</span>
                        <button 
                            onClick={() => handleAddToCart(item)}
                            className="text-[10px] uppercase tracking-widest border-b border-black pb-0.5 hover:text-neutral-600 hover:border-neutral-600 transition-colors"
                        >
                            Add to Bag
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
