import { create } from "zustand";
import { persist } from "zustand/middleware";
import { type MenuItem } from "../components/MenuCardOnline/MenuCardOnline";

export interface CartItem extends MenuItem {
  cartId: string; // ID unik untuk membedakan pesanan dengan catatan berbeda
  qty: number;
  notes: string;
  checked?: boolean;
}

interface CartStore {
  items: CartItem[];
  addToCart: (item: MenuItem, qty: number, notes: string) => void;
  getTotalItems: () => number;
  updateQty: (cartId: string, qty: number) => void;
  updateNotes: (cartId: string, newNotes: string) => void;
  removeItem: (cartId: string) => void;
  toggleChecked: (cartId: string) => void;
  toggleAllChecked: (status: boolean) => void;
    clearCart: () => void;
    removeCheckedItems: () => void;
    
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
        return get().items.length
        // return get().items.reduce((total, item) => total + item.qty, 0);
      },

      updateQty: (cartId, qty) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.cartId === cartId ? { ...item, qty: Math.max(1, qty) } : item,
          ),
        }));
      },
      updateNotes: (cartId, newNotes) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.cartId === cartId ? { ...item, notes: newNotes } : item,
          ),
        }));
      },
      removeItem: (cartId) => {
        set((state) => ({
          items: state.items.filter((item) => item.cartId !== cartId),
        }));
      },
      toggleChecked: (cartId) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.cartId === cartId ? { ...item, checked: !item.checked } : item,
          ),
        })),
      toggleAllChecked: (status) =>
        set((state) => ({
          items: state.items.map((item) => ({ ...item, checked: status })),
        })),
        clearCart: () => set({ items: [] }),
        removeCheckedItems: () => {
        set((state) => ({
          // Kita hanya menyimpan item yang checked-nya false (belum dibayar)
          items: state.items.filter((item) => !item.checked),
        }));
      },
    }),
    
    {
      name: "its-resto-cart", // 3. NAMA KUNCI DI LOCAL STORAGE
    },
  ),
);
