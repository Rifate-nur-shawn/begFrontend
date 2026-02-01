import api from './axios';
import { User, Address } from '@/types/api';

export const authApi = {
  loginGoogle: async (code: string) => {
    const { data } = await api.post<{ accessToken: string; user: User }>('/auth/google', { code });
    return data;
  },

  logout: async () => {
    await api.post('/auth/logout');
  },

  getMe: async () => {
    const { data } = await api.get<User>('/auth/me');
    return data;
  },

  refresh: async () => {
    const { data } = await api.post<{ accessToken: string }>('/auth/refresh');
    return data;
  },

  // Address Management
  getAddresses: async () => {
    const { data } = await api.get<Address[]>('/user/addresses');
    return data;
  },

  addAddress: async (address: Omit<Address, 'id' | 'userId'>) => {
    const { data } = await api.post<Address>('/user/addresses', address);
    return data;
  },

  updateAddress: async (id: string, address: Partial<Address>) => {
    const { data } = await api.put<Address>(`/user/addresses/${id}`, address);
    return data;
  },

  deleteAddress: async (id: string) => {
    await api.delete(`/user/addresses/${id}`);
  },
};
