import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
  image: string;
}

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string, size: string) => void;
  updateQuantity: (id: string, size: string, quantity: number) => void;
  clearCart: () => void;
  topbarText: string;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
  
      topbarText: "COMPLIMENTARY SHIPPING & RETURNS ON ALL ORDERS",

      addItem: (newItem) =>
        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (item) => item.id === newItem.id && item.size === newItem.size
          );

          if (existingItemIndex > -1) {
            const newItems = [...state.items];
            newItems[existingItemIndex].quantity += 1;
            return { items: newItems };
          }

          return { items: [...state.items, { ...newItem, quantity: 1 }] };
        }),

      removeItem: (id, size) =>
        set((state) => ({
          items: state.items.filter((item) => !(item.id === id && item.size === size)),
        })),

      updateQuantity: (id, size, quantity) =>
        set((state) => {
           if (quantity <= 0) {
             return { items: state.items.filter((item) => !(item.id === id && item.size === size)) };
           }
          return {
            items: state.items.map((item) =>
              item.id === id && item.size === size ? { ...item, quantity } : item
            ),
          };
        }),

      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'cart-storage',
    }
  )
);
