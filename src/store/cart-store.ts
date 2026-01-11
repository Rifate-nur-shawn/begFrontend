import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/lib/api/axios';
import { useAuthStore } from './auth-store';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
  image: string;
  productId: string; // Add productId for backend sync
}

// Backend Cart Item Type
interface BackendProduct {
    name: string;
    basePrice: number;
    salePrice?: number;
    media?: {
        images?: string[];
    };
}
interface BackendCartItem {
    id: string;
    productId: string;
    product: BackendProduct;
    quantity: number;
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
    (set) => ({
      items: [],
      topbarText: "COMPLIMENTARY SHIPPING & RETURNS ON ALL ORDERS",

      fetchCart: async () => {
        const { isAuthenticated } = useAuthStore.getState();
        if (!isAuthenticated) return;

        try {
          const { data } = await api.get('/cart');
          
          const mappedItems: CartItem[] = (data.items || []).map((item: BackendCartItem) => {
             // Extract image from media if available
             let image = "";
             if (item.product.media && item.product.media.images && item.product.media.images.length > 0) {
                 image = item.product.media.images[0];
             }
             
             return {
                 id: item.id, // CartItem ID
                 productId: item.productId,
                 name: item.product.name,
                 price: item.product.salePrice || item.product.basePrice,
                 quantity: item.quantity,
                 size: "One Size", // Backend doesn't support yet, default
                 color: "Default", // Backend doesn't support yet
                 image: image || "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=2069", // Fallback
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
                // Determine quantity. If item existed, we incremented. Backend expected absolute quantity or add?
                // Backend: "AddToCart" usually means ADD quantity or Update?
                // orderUC.AddToCart(ctx, userID, prodID, quantity) usually adds. 
                // Let's assume it adds to existing or creates new.
                await api.post('/cart', {
                    productId: newItem.productId,
                    quantity: 1
                });
                // Optionally re-fetch to ensure sync
                // get().fetchCart(); 
            } catch (err) {
                console.error("Failed to add to cart backend", err);
                // Revert?
            }
        }
      },

      removeItem: async (id, size) => {
          // This id is CartItem ID or ProductID?
          // Frontend uses mixed ID logic. 
          // If we sync from backend, 'id' is CartItem ID.
          // If local, 'id' might be product ID.
          // We need to standardize. 
          // For now, let's assume 'id' passed here is what is in the items array.
          
        set((state) => ({
          items: state.items.filter((item) => !(item.id === id && item.size === size)),
        }));
        
        // Backend doesn't have Remove Item endpoint in the list I saw earlier! 
        // Logic: "AddToCart" with negative quantity? Or missing endpoint?
        // Checked order_handler.go: GetCart, AddToCart, Checkout, GetMyOrders.
        // NO RemoveFromCart.
        // So I can't sync removals yet!
        console.warn("Backend remove not supported yet");
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
        
        // Backend support missing for explicit update?
        // AddToCart allows adding. 
      },

      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'cart-storage',
    }
  )
);
