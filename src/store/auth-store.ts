import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi } from '@/lib/api/auth';
import { useCartStore } from './cart-store';
import { User } from '@/types/api';


interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Actions
  loginGoogle: (idToken: string) => Promise<void>;
  logout: () => Promise<void>;
  setAccessToken: (token: string) => void;
  fetchMe: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,

      setAccessToken: (token) => set({ accessToken: token }),

      loginGoogle: async (code) => {
        set({ isLoading: true });
        try {
          const data = await authApi.loginGoogle(code);
          set({ 
            user: data.user, 
            accessToken: data.accessToken, 
            isAuthenticated: true, 
            isLoading: false 
          });
          
          useCartStore.getState().fetchCart();
        } catch (error) {
          set({ isLoading: false });
          console.error("Login failed", error);
          throw error;
        }
      },

      logout: async () => {
        try {
          await authApi.logout();
        } catch (err) {
          console.error("Logout error", err);
        } finally {
            set({ user: null, accessToken: null, isAuthenticated: false });
        }
      },

      fetchMe: async () => {
          // If we have a token but no user, or just to sync
          if (!get().accessToken) return;
          try {
              const user = await authApi.getMe();
              set({ user });
          } catch(err) {
              console.error("Fetch me failed", err);
              // potentially logout if token invalid
          }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ accessToken: state.accessToken, user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);
