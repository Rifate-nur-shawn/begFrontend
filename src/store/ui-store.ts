import { create } from 'zustand';

interface UIState {
  isMenuOpen: boolean;
  isCartOpen: boolean;
  isSearchOpen: boolean;
  toggleMenu: () => void;
  closeMenu: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleSearch: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isMenuOpen: false,
  isCartOpen: false,
  isSearchOpen: false,
  toggleMenu: () => set((state) => ({ isMenuOpen: !state.isMenuOpen, isCartOpen: false, isSearchOpen: false })),
  closeMenu: () => set({ isMenuOpen: false }),
  toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen, isMenuOpen: false, isSearchOpen: false })),
  openCart: () => set({ isCartOpen: true, isMenuOpen: false, isSearchOpen: false }),
  closeCart: () => set({ isCartOpen: false }),
  toggleSearch: () => set((state) => ({ isSearchOpen: !state.isSearchOpen, isMenuOpen: false, isCartOpen: false })),
}));
