import api from './axios';
import { Wishlist, Product } from '@/types/api';

export const wishlistApi = {
  get: async () => {
    const { data } = await api.get<{ items: { id: string; productId: string; product: Product; addedAt: string }[] }>('/wishlist');
    return data;
  },

  add: async (productId: string) => {
    const { data } = await api.post('/wishlist', { productId });
    return data;
  },

  remove: async (productId: string) => {
    await api.delete(`/wishlist/${productId}`);
  }
};
