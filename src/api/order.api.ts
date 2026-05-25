import { axiosInstance } from "../lib/axios";

// Interface untuk payload yang akan dikirim ke backend
export interface CreateOrderPayload {
  source: "KIOSK" | "WAITER" | "CASHIER" | "ONLINE" | "QR_SCAN";
  table_id: number | null;
  discount_id?: number;
  order_items: {
    menu_id: string;
    quantity: number;
    notes: string;
  }[];
}

export const orderAPI = {
  // Membuat pesanan baru
  createOrder: async (payload: CreateOrderPayload) => {
    // Sesuaikan URL endpoint ini jika berbeda di backend-mu
    const response = await axiosInstance.post("/order/create-order", payload);
    return response.data;
  },

  // (Nanti bisa ditambah fungsi lain seperti getOrder, cancelOrder, dll)
};