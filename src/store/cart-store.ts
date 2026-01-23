import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/lib/api/axios';
import { useAuthStore } from './auth-store';
import { BackendCartItem } from '@/types/defaults';
import { UI_CONSTANTS } from '@/lib/constants';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
  image: string;
  productId: string; 
}

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => Promise<void>;
  removeItem: (id: string, size: string) => Promise<void>;
  updateQuantity: (id: string, size: string, quantity: number) => Promise<void>;
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
          const { data } = await api.get('/cart');
          
          const mappedItems: CartItem[] = (data.items || []).map((item: BackendCartItem) => {
             const image = item.product.media?.images?.[0] || UI_CONSTANTS.HERO_FALLBACK_IMAGE;
             
             return {
                 id: item.id, 
                 productId: item.productId,
                 name: item.product.name,
                 price: item.product.salePrice ?? item.product.basePrice,
                 quantity: item.quantity,
                 size: "One Size", // Default until backend supports variants
                 color: "Default", // Default until backend supports variants
                 image: image,
             };
          });
          set({ items: mappedItems });
        } catch (err) {
            console.error("Failed to fetch cart", err);
        }
      },

      addItem: async (newItem) => {
        const { isAuthenticated } = useAuthStore.getState();
        
        // Optimistic Update
        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (item) => item.productId === newItem.productId && item.size === newItem.size
          );
          if (existingItemIndex > -1) {
            const newItems = [...state.items];
            newItems[existingItemIndex].quantity += 1;
            return { items: newItems };
          }
          return { items: [...state.items, { ...newItem, quantity: 1 }] };
        });

        if (isAuthenticated) {
            try {
                await api.post('/cart', {
                    productId: newItem.productId,
                    quantity: 1
                });
            } catch (err) {
                console.error("Failed to add to cart backend", err);
            }
        }
      },

      removeItem: async (id, size) => {
        set((state) => ({
          items: state.items.filter((item) => !(item.id === id && item.size === size)),
        }));
        
        // Backend synchronization logic would go here when available
      },

      updateQuantity: async (id, size, quantity) => {
         set((state) => {
           if (quantity <= 0) {
             return { items: state.items.filter((item) => !(item.id === id && item.size === size)) };
           }
          return {
            items: state.items.map((item) =>
              item.id === id && item.size === size ? { ...item, quantity } : item
            ),
          };
        });
      },

      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'cart-storage',
    }
  )
);
