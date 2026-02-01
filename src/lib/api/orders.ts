import api from './axios';
import { Order } from '@/types/api';

export const orderApi = {
  create: async (payload: { address?: any; addressId?: string; paymentMethod: string; items?: any[] }) => {
    const { data } = await api.post<{ orderId: string; order: Order; paymentUrl?: string }>('/checkout', payload);
    return data;
  },

  getAll: async () => {
    const { data } = await api.get<Order[]>('/orders');
    return data;
  },

  getById: async (id: string) => {
    const { data } = await api.get<Order>(`/orders/${id}`); // Assuming admin endpoint or user endpoint exists
    return data;
  },
};
