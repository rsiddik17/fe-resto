import { create } from "zustand";
import { persist } from "zustand/middleware";
import { type MenuItem } from "../components/MenuCard/MenuCard";

export interface CartItem extends MenuItem {
  cartId: string; // ID unik untuk membedakan pesanan dengan catatan berbeda
  qty: number;
  notes: string;
}

interface CartStore {
  items: CartItem[];
  addToCart: (item: MenuItem, qty: number, notes: string) => void;
  getTotalItems: () => number;
  updateQty: (cartId: string, delta: number) => void;
  removeItem: (cartId: string) => void;
  getTotalPrice: () => number;
  updateNote: (cartId: string, newNote: string) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addToCart: (item, qty, notes) => {
        if (qty <= 0) return;

        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (i) => i.id === item.id && i.notes === notes,
          );

          if (existingItemIndex > -1) {
            const newItems = [...state.items];
            newItems[existingItemIndex].qty += qty;
            return { items: newItems };
          } else {
            return {
              items: [
                ...state.items,
                { ...item, cartId: crypto.randomUUID(), qty, notes },
              ],
            };
          }
        });
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.qty, 0);
      },

      updateQty: (cartId, delta) => {
        set((state) => {
          const newItems = state.items
            .map((item) => {
              if (item.cartId === cartId) {
                const newQty = item.qty + delta;
                return { ...item, qty: newQty };
              }
              return item;
            })
            .filter((item) => item.qty > 0); // Otomatis hapus item jika qty 0

          return { items: newItems };
        });
      },

      removeItem: (cartId) => {
        set((state) => ({
          items: state.items.filter((item) => item.cartId !== cartId),
        }));
      },

      getTotalPrice: () =>
        get().items.reduce((total, item) => total + item.price * item.qty, 0),

      updateNote: (cartId, newNote) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.cartId === cartId ? { ...item, notes: newNote } : item,
          ),
        }));
      },

      clearCart: () => set({ items: [] }),
    }),
    {
      name: "its-resto-cart", // 3. NAMA KUNCI DI LOCAL STORAGE
    },
  ),
);
