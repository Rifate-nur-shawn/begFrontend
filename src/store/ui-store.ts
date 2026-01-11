import { create } from 'zustand';

interface UIState {
  isMenuOpen: boolean;
  isCartOpen: boolean;
  isSearchOpen: boolean;
  isLoginOpen: boolean;
  toggleMenu: () => void;
  closeMenu: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  openSearch: () => void;
  closeSearch: () => void;
  openLogin: () => void;
  closeLogin: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isMenuOpen: false,
  isCartOpen: false,
  isSearchOpen: false,
  isLoginOpen: false,
  toggleMenu: () => set((state) => ({ isMenuOpen: !state.isMenuOpen, isCartOpen: false, isSearchOpen: false, isLoginOpen: false })),
  closeMenu: () => set({ isMenuOpen: false }),
  toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen, isMenuOpen: false, isSearchOpen: false, isLoginOpen: false })),
  openCart: () => set({ isCartOpen: true, isMenuOpen: false, isSearchOpen: false, isLoginOpen: false }),
  closeCart: () => set({ isCartOpen: false }),
  openSearch: () => set({ isSearchOpen: true, isMenuOpen: false, isCartOpen: false, isLoginOpen: false }),
  closeSearch: () => set({ isSearchOpen: false }),
  openLogin: () => set({ isLoginOpen: true, isMenuOpen: false, isCartOpen: false, isSearchOpen: false }),
  closeLogin: () => set({ isLoginOpen: false }),
}));
