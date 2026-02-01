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
        
        if (!isAuthenticated) {
          // User not logged in - show a message or prompt to login
          console.warn("Cart: User not authenticated. Please login to add items to cart.");
          // You could also dispatch a UI action here to show a toast/modal
          alert("Please login to add items to your cart.");
          return;
        }
        
        try {
          const updatedCart = await cartApi.add(productId, quantity, variantId);
          set({ items: updatedCart.items });
        } catch (err: any) {
          console.error("Failed to add to cart:", err);
          
          // Provide more specific error messages
          if (err.code === 'ERR_NETWORK') {
            alert("Network error: Unable to connect to the server. Please check if the backend is running.");
          } else if (err.response?.status === 401) {
            alert("Session expired. Please login again.");
            useAuthStore.getState().logout();
          } else if (err.response?.status === 400) {
            alert(err.response?.data?.message || "Invalid request. Please try again.");
          } else {
            alert("Failed to add item to cart. Please try again.");
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
