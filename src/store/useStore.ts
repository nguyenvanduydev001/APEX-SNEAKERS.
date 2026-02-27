import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface CartItem {
  productId: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size: string;
}

interface StoreState {
  user: User | null;
  token: string | null;
  cart: CartItem[];
  setUser: (user: User | null, token: string | null) => void;
  logout: () => void;
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: number, size: string) => void;
  updateQuantity: (productId: number, size: string, quantity: number) => void;
  clearCart: () => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      cart: [],
      setUser: (user, token) => set({ user, token }),
      logout: () => set({ user: null, token: null }),
      addToCart: (item) =>
        set((state) => {
          const existing = state.cart.find(
            (i) => i.productId === item.productId && i.size === item.size
          );
          if (existing) {
            return {
              cart: state.cart.map((i) =>
                i.productId === item.productId && i.size === item.size
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            };
          }
          return { cart: [...state.cart, item] };
        }),
      removeFromCart: (productId, size) =>
        set((state) => ({
          cart: state.cart.filter(
            (i) => !(i.productId === productId && i.size === size)
          ),
        })),
      updateQuantity: (productId, size, quantity) =>
        set((state) => ({
          cart: state.cart.map((i) =>
            i.productId === productId && i.size === size
              ? { ...i, quantity: Math.max(1, quantity) }
              : i
          ),
        })),
      clearCart: () => set({ cart: [] }),
    }),
    {
      name: 'walkin-storage',
    }
  )
);
