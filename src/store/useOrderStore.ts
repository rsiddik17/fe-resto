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
  status: 'Dimasak' | 'Diterima'| 'Selesai';
  date: string;
}

interface OrderStore {
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: 'Dimasak' |'Diterima' | 'Selesai') => void; // Tambahkan fungsi ini
  clearOrders: () => void;
}

export const useOrderStore = create<OrderStore>()(
  persist(
    (set) => ({
      // Isi dengan data dummy agar langsung muncul di tampilan[cite: 2]
      orders: [
        {
          orderId: "260401205",
          address: "Jl. Sholeh Iskandar No.Km.02, UIKA Bogor",
          items: [{ name: "Nasi Goreng Special", qty: 1 }],
          finalPayment: 45000,
          subTotal: 40000,
          discountAmount: 0,
          adminFee: 5000,
          // status: 'Dimasak',
          status: 'Dimasak',
           // Masuk ke tab "Pesanan Aktif"[cite: 2]
          date: "01 Apr 2026 • 20:15"
        },
        {
          orderId: "260401200",
          address: "Jl. Sholeh Iskandar No.Km.02, UIKA Bogor",
          items: [{ name: "Es Teh Manis", qty: 2 }],
          finalPayment: 15000,
          subTotal: 10000,
          discountAmount: 0,
          adminFee: 5000,
          status: 'Selesai', // Masuk ke tab "Pesanan Selesai"[cite: 2]
          date: "01 Apr 2026 • 19:00"
        },
        {
          orderId: "260401200",
          address: "Jl. Sholeh Iskandar No.Km.02, UIKA Bogor",
          items: [{ name: "Es Jeruk", qty: 2 }],
          finalPayment: 15000,
          subTotal: 10000,
          discountAmount: 0,
          adminFee: 5000,
          status: 'Diterima', // Masuk ke tab "Pesanan Selesai"[cite: 2]
          date: "01 Apr 2026 • 19:00"
        }
      ],
      
      addOrder: (order) => set((state) => ({ 
        orders: [order, ...state.orders] 
      })),

      // Fungsi ini penting supaya status bisa berubah otomatis di halaman tracking
      updateOrderStatus: (orderId, status) => set((state) => ({
        orders: state.orders.map((o) => 
          o.orderId === orderId ? { ...o, status } : o
        )
      })),

      clearOrders: () => set({ orders: [] }),
    }),
    {
      name: 'order-storage', 
      version: 1,
    }
  )
);