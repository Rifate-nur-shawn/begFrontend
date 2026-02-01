import api from './axios';
import { Cart, CartItem } from '@/types/api';

export const cartApi = {
  get: async () => {
    const { data } = await api.get<Cart>('/cart');
    return data;
  },

  add: async (productId: string, quantity: number = 1, variantId?: string) => {
    const { data } = await api.post<Cart>('/cart', { productId, quantity, variantId });
    return data;
  },

  update: async (productId: string, quantity: number, variantId?: string) => {
    const { data } = await api.put<Cart>('/cart', { productId, quantity, variantId });
    return data;
  },

  remove: async (productId: string, variantId?: string) => { // Backend might expect query params or body depending on implementation, assuming path param or body
    // Based on standard REST, usually DELETE /cart/{itemId} or DELETE /cart?productId=...
    // The previous code suggested DELETE /api/v1/cart/{productId}
    const { data } = await api.delete<Cart>(`/cart/${productId}`); 
    return data;
  },
  
  clear: async () => {
      // If backend supports clear
  }
};
