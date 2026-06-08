import { axiosInstance } from "../lib/axios";

// Interface untuk payload yang akan dikirim ke backend
export interface CreateOrderPayload {
  source: "KIOSK" | "WAITER" | "CASHIER" | "ONLINE" | "QR_SCAN";
  table_id: number | null;
  address_id?: string;  
  discount_id?: number;
  order_items: {
    menu_id: string;
    quantity: number;
    notes: string;
  }[];
}

export const orderAPI = {
  // POST /order/create-order
  createOrder: async (payload: CreateOrderPayload) => {
    const response = await axiosInstance.post("/order/create-order", payload);
    return response.data;
  },

  // PATCH /order/:id/validate-payment
  validatePayment: async (orderId: string, bankName: string) => {
    const response = await axiosInstance.patch(`/order/${orderId}/validate-payment`, {
      bank_name: bankName
    });
    return response.data;
  },

  // PATCH /order/:id/start-cooking
  startCooking: async (orderId: string) => {
    const response = await axiosInstance.patch(`/order/${orderId}/start-cooking`);
    return response.data;
  },

  // PATCH /order/:id/ready
  setOrderReady: async (orderId: string) => {
    const response = await axiosInstance.patch(`/order/${orderId}/ready`);
    return response.data;
  },

  // PATCH /order/:id/completed
  setOrderCompleted: async (orderId: string) => {
    const response = await axiosInstance.patch(`/order/${orderId}/completed`);
    return response.data;
  },

  // PATCH /order/:id/cancel
  cancelOrder: async (orderId: string) => {
    const response = await axiosInstance.patch(`/order/${orderId}/cancel`);
    return response.data;
  },

  // GET /order/my-order/:id
  getMyOrderById: async (id: string) => {
    const response = await axiosInstance.get(`/order/my-order/${id}`);
    return response.data;
  },

  // GET /order/my-order
  getMyAllOrders: async () => {
    const response = await axiosInstance.get("/order/my-order");
    return response.data;
  },

  // GET /order/report
  getReportOrders: async (date?: string) => {
    const response = await axiosInstance.get("/order/report", {
      // Jika butuh dikirim sebagai query ?date=2026-05-28
      params: date ? { date } : undefined 
    });
    return response.data;
  },

  // GET /order/
  getOrdersByStatus: async (status?: string) => {
    const response = await axiosInstance.get("/order/", {
      params: status ? { status } : undefined
    });
    return response.data;
  },

  // GET /order/:id
  getOrderById: async (orderId: string) => {
    const response = await axiosInstance.get(`/order/${orderId}`);
    return response.data;
  },

  // GET /order/substitutes
  getSubstituteMenus: async (targetPrice: number, currentMenuId: string) => {
    const response = await axiosInstance.get("/order/substitutes", {
      params: { 
        price: targetPrice, 
        current_menu_id: currentMenuId 
      }
    });
    return response.data;
  },

  // PATCH /order/:id/swap-item
  swapOrderItem: async (orderId: string, orderItemId: string, newMenuId: string, qtyToSwap: number, newNotes?: string) => {
    const response = await axiosInstance.patch(`/order/${orderId}/swap-item`, {
      order_item_id: orderItemId,
      new_menu_id: newMenuId,
      qty_to_swap: qtyToSwap,
      notes: newNotes
    });
    return response.data;
  },

  // PATCH /order/:id/remove-item
  removeOrderItem: async (orderId: string, orderItemId: string) => {
    const response = await axiosInstance.patch(`/order/${orderId}/remove-item`, {
      order_item_id: orderItemId
    });
    return response.data;
  }
};