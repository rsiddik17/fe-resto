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
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addToCart: (item, qty, notes) => {
        if (qty <= 0) return;

        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (i) => i.id === item.id && i.notes === notes
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
    }),
    {
      name: "its-resto-cart", // 3. NAMA KUNCI DI LOCAL STORAGE
    }
  )
);