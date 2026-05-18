import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Order {
  address: string;
  orderId: string;
  items: any[];
  finalPayment: number;
  subTotal: number;
  discountAmount: number;
  adminFee: number;
  status: "dimasak" | "diantar" | "diterima" | "proses"; // Menggunakan huruf kecil agar sinkron
  date: string;
}

interface OrderStore {
  orders: Order[];
  hasSeenNotifications: boolean;
  setNotificationsRead: () => void;
  addOrder: (order: Order) => void;
  updateOrderStatus: (
    orderId: string,
    status: "dimasak" | "diantar" | "diterima" | "proses",
  ) => void;
  clearOrders: () => void;
}

export const useOrderStore = create<OrderStore>()(
  persist(
    (set) => ({
      orders: [
        {
          orderId: "260401205",
          address: "Jl. Sholeh Iskandar No.Km.02, UIKA Bogor",
          // Ditambahkan price agar tidak NaN
          items: [{ name: "Nasi Goreng Special", qty: 1, price: 40000 }], 
          finalPayment: 45000,
          subTotal: 40000,
          discountAmount: 0,
          adminFee: 5000,
          status: "dimasak", // Huruf kecil
          date: "14 Mei 2026, 02.15",
        },
        {
          orderId: "260401202",
          address: "Jl. Sholeh Iskandar No.Km.02, UIKA Bogor",
          // Ditambahkan price agar tidak NaN
          items: [{ name: "Es Teh Manis", qty: 2, price: 5000 }], 
          finalPayment: 15000,
          subTotal: 10000,
          discountAmount: 0,
          adminFee: 5000,
          status: "diantar", // Huruf kecil (Es Teh sedang diantar)
          date: "14 Mei 2026, 02.00",
        },
        {
          orderId: "260401200",
          address: "Jl. Sholeh Iskandar No.Km.02, UIKA Bogor",
          // Ditambahkan price agar tidak NaN
          items: [{ name: "Es Jeruk", qty: 2, price: 5000 }], 
          finalPayment: 15000,
          subTotal: 10000,
          discountAmount: 0,
          adminFee: 5000,
          status: "diterima", // Huruf kecil
          date: "14 Mei 2026, 01.30",
        },
      ],

      hasSeenNotifications: false,
      
      setNotificationsRead: () => 
        set({ hasSeenNotifications: true }),

      addOrder: (order) =>
        set((state) => ({
          orders: [order, ...state.orders],
          hasSeenNotifications: false, 
        })),

      updateOrderStatus: (orderId, status) =>
        set((state) => ({
          orders: state.orders.map((o) =>
            o.orderId === orderId ? { ...o, status: status.toLowerCase() as any } : o,
          ),
          hasSeenNotifications: false,
        })),

      clearOrders: () => set({ orders: [] }),
    }),
    {
      name: "order-storage",
      version: 10, // Naikkan versi ke 10 agar browser otomatis menghapus data yang salah kemarin
    },
  ),
);