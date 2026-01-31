import { create } from 'zustand';
import api from '@/lib/api/axios';
import { useAuthStore } from './auth-store';

export interface WishlistItem {
  id: string; // Product ID
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
  addItem: (product: any) => Promise<void>; // flexible product type for now
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
      const { data } = await api.get('/wishlist');
      // Map backend response to WishlistItem if necessary.
      // Assuming backend returns list of products or similar structure
      // Adjust mapping based on actual API response, inferred for now as standard
      const mappedItems = data.map((item: any) => ({
          id: item.id || item.productId,
          productId: item.id || item.productId, // Handle both cases if backend varies
          name: item.name || item.product?.name,
          price: item.salePrice || item.basePrice || item.product?.salePrice || item.product?.basePrice,
          image: item.media?.images?.[0] || item.product?.media?.images?.[0] || "",
          addedAt: new Date().toISOString() // Backend might not send this, fallback
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
    if (!isAuthenticated) return; // Or trigger login modal

    // Optimistic Update
    const newItem: WishlistItem = {
        id: product.id,
        productId: product.id,
        name: product.name,
        price: product.salePrice || product.basePrice,
        image: product.media?.images?.[0] || "",
        addedAt: new Date().toISOString()
    };
    
    set((state) => ({ items: [...state.items, newItem] }));

    try {
      await api.post('/wishlist', { productId: product.id });
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
            await api.delete(`/wishlist/${productId}`);
        } catch (error) {
            console.error("Failed to remove from wishlist", error);
             // Verify if rollback is needed or just re-fetch
             get().fetchWishlist();
        }
    }
  },

  isInWishlist: (productId) => {
      return get().items.some(item => item.productId === productId);
  }
}));
