import { create } from "zustand";
import { persist } from "zustand/middleware";
import { type MenuItem } from "../components/MenuCardOnline/MenuCardOnline";
import { v4 as uuidv4 } from "uuid";

export interface CartItem extends MenuItem {
  cartId: string; // ID unik untuk membedakan pesanan dengan catatan berbeda
  qty: number;
  notes: string;
  checked?: boolean;
}

interface CartStore {
  items: CartItem[];
  tableId: number | null; 
  tableNumber: string | null; 
  setTableInfo: (id: number | null, numberString: string | null) => void;
  addToCart: (item: MenuItem, qty: number, notes: string) => void;
  getTotalItems: () => number;
  updateNotes: (cartId: string, newNotes: string) => void;
  toggleChecked: (cartId: string) => void;
  toggleAllChecked: (status: boolean) => void;
  removeCheckedItems: () => void;

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
      tableId: null,
      tableNumber: null,

      setTableInfo: (id, numberString) => set({ tableId: id, tableNumber: numberString }),

      addToCart: (item, qty, notes) => {
        if (qty <= 0) return;

        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (i) => i.id === item.id && i.notes === notes,
          );

          if (existingItemIndex > -1) {
            const newItems = [...state.items];
            newItems[existingItemIndex].qty += qty;
            newItems[existingItemIndex].checked = true;
            return { items: newItems };
          } else {
            return {
              items: [
                ...state.items,
                { ...item, cartId: uuidv4(), qty, notes, checked: true },
              ],
            };
          }
        });
      },

      getTotalItems: () => {
        return get().items.length;
        // return get().items.reduce((total, item) => total + item.qty, 0);
      },

     
      updateNotes: (cartId, newNotes) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.cartId === cartId ? { ...item, notes: newNotes } : item,
          ),
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
      removeCheckedItems: () => {
        set((state) => ({
          // Kita hanya menyimpan item yang checked-nya false (belum dibayar)
          items: state.items.filter((item) => !item.checked),
        }));
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

      clearCart: () => set({ items: [], tableId: null, tableNumber: null }),
    }),

    {
      name: "its-resto-cart", // 3. NAMA KUNCI DI LOCAL STORAGE
    },
  ),
);
