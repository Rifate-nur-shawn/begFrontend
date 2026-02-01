import { create } from 'zustand';
import { wishlistApi } from '@/lib/api/wishlist';
import { useAuthStore } from './auth-store';
import { Product } from '@/types/api';

export interface WishlistItem {
  id: string; // Product ID or Wishlist Item ID
  productId: string;
  name: string;
  price: number;
  image: string;
  addedAt: string;
}

interface WishlistState {
  items: WishlistItem[];
  isLoading: boolean;
  fetchWishlist: () => Promise<void>;
  addItem: (product: Product) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  items: [],
  isLoading: false,

  fetchWishlist: async () => {
    const { isAuthenticated } = useAuthStore.getState();
    if (!isAuthenticated) return;

    set({ isLoading: true });
    try {
      const data = await wishlistApi.get();
      // Map backend response to WishlistItem
      const mappedItems = (data.items || []).map((item) => ({
          id: item.productId, // Use productId as main ID for easier lookup
          productId: item.productId,
          name: item.product?.name,
          price: item.product?.salePrice || item.product?.basePrice,
          image: item.product?.media?.[0] || item.product?.images?.[0] || "",
          addedAt: item.addedAt
      }));
      set({ items: mappedItems });
    } catch (error) {
      console.error("Failed to fetch wishlist", error);
    } finally {
      set({ isLoading: false });
    }
  },

  addItem: async (product) => {
    const { isAuthenticated } = useAuthStore.getState();
    if (!isAuthenticated) return;

    // Optimistic Update
    const newItem: WishlistItem = {
        id: product.id,
        productId: product.id,
        name: product.name,
        price: product.salePrice || product.basePrice,
        image: product.media?.[0] || product.images?.[0] || "",
        addedAt: new Date().toISOString()
    };
    
    set((state) => ({ items: [...state.items, newItem] }));

    try {
      await wishlistApi.add(product.id);
    } catch (error) {
      console.error("Failed to add to wishlist", error);
      // Rollback
      set((state) => ({ items: state.items.filter(i => i.productId !== product.id) }));
    }
  },

  removeItem: async (productId) => {
    const { isAuthenticated } = useAuthStore.getState();
    
    // Optimistic Update
    set((state) => ({ items: state.items.filter(i => i.productId !== productId) }));

    if (isAuthenticated) {
        try {
            await wishlistApi.remove(productId);
        } catch (error) {
            console.error("Failed to remove from wishlist", error);
             // Re-fetch to ensure sync
             get().fetchWishlist();
        }
    }
  },

  isInWishlist: (productId) => {
      return get().items.some(item => item.productId === productId);
  }
}));
