import api from './axios';
import { Product, Category, PaginatedResponse, Review } from '@/types/api';

export const productApi = {
  // Products
  getAll: async (params?: { page?: number; limit?: number; category?: string; sort?: string; search?: string }) => {
    const { data } = await api.get<PaginatedResponse<Product>>('/products', { params });
    return data;
  },

  getBySlug: async (slug: string) => {
    const { data } = await api.get<Product>(`/products/${slug}`);
    return data;
  },

  getById: async (id: string) => {
    const { data } = await api.get<Product>(`/product/${id}`);
    return data;
  },

  // Categories
  getCategories: async () => {
    const { data } = await api.get<Category[]>('/categories/tree');
    return data;
  },

  // Collections (if needed)
  getCollections: async () => {
      const { data } = await api.get('/collections');
      return data;
  },
  
  // Reviews
  getReviews: async (id: string) => {
      const { data } = await api.get<Review[]>(`/products/${id}/reviews`);
      return data;
  }
};
