import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { cartApi } from '@/lib/api/cart';
import { useAuthStore } from './auth-store';
import { CartItem } from '@/types/api';
import { UI_CONSTANTS } from '@/lib/constants';

interface CartState {
  items: CartItem[];
  addItem: (productId: string, quantity?: number, variantId?: string) => Promise<void>;
  removeItem: (productId: string, variantId?: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number, variantId?: string) => Promise<void>;
  clearCart: () => void;
  fetchCart: () => Promise<void>;
  topbarText: string;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      topbarText: UI_CONSTANTS.TOPBAR_TEXT,

      fetchCart: async () => {
        const { isAuthenticated } = useAuthStore.getState();
        if (!isAuthenticated) return;

        try {
          const cart = await cartApi.get();
          // Map backend cart items if necessary, but if schema matches, just set
          // Assuming backend returns proper CartItem structure, but checking api.ts
          // CartItem in api.ts has product, quantity, etc.
          // We might need to handle images or nulls safely.
          set({ items: cart.items || [] });
        } catch (err) {
            console.error("Failed to fetch cart", err);
        }
      },

      addItem: async (productId, quantity = 1, variantId) => {
        const { isAuthenticated } = useAuthStore.getState();
        
        // Optimistic Update (Simplification for now, better to just wait or proper optimistic with rollback)
        // For now, let's just call backend and refetch or update state
        if (isAuthenticated) {
            try {
                const updatedCart = await cartApi.add(productId, quantity, variantId);
                set({ items: updatedCart.items });
            } catch (err) {
                console.error("Failed to add to cart backend", err);
            }
        }
      },

      removeItem: async (productId, variantId) => {
         const { isAuthenticated } = useAuthStore.getState();
         if (isAuthenticated) {
             try {
                 const updatedCart = await cartApi.remove(productId, variantId);
                 set({ items: updatedCart.items });
             } catch(err) {
                 console.error("Failed to remove item", err);
             }
         }
      },

      updateQuantity: async (productId, quantity, variantId) => {
         const { isAuthenticated } = useAuthStore.getState();
         if (isAuthenticated) {
             try {
                 const updatedCart = await cartApi.update(productId, quantity, variantId);
                 set({ items: updatedCart.items });
             } catch(err) {
                 console.error("Failed to update quantity", err);
             }
         }
      },

      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'cart-storage',
    }
  )
);
