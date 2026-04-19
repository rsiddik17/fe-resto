import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Order {
  address: string;
  orderId: string;
  items: any[];
  finalPayment: number;
  subTotal: number;
  discountAmount: number;
  adminFee: number;
  status: 'Dimasak' | 'Selesai';
  date: string;
}

interface OrderStore {
  orders: Order[];
  addOrder: (order: Order) => void;
  clearOrders: () => void;
}

export const useOrderStore = create<OrderStore>()(
  persist(
    (set) => ({
      orders: [],
      addOrder: (order) => set((state) => ({ 
        orders: [order, ...state.orders] 
      })),
      clearOrders: () => set({ orders: [] }),
    }),
    {
      name: 'order-storage', // Data akan tersimpan di LocalStorage
    }
  )
  
);