import { axiosInstance } from "../lib/axios";

export interface DiscountData {
  id: number;
  discount_name: string;
  discount_code: string;
  value: string | number; 
  min_purches: string | number;
  is_active: boolean;
  start_date?: string;
  end_date?: string;
}

export const discountAPI = {
  // Ambil semua diskon
  getAllDiscounts: async () => {
    const response = await axiosInstance.get("/discount/");
    return response.data;
  },

  // Buat diskon baru
  createDiscount: async (payload: Partial<DiscountData>) => {
    const response = await axiosInstance.post("/discount/create-discounts", payload);
    return response.data;
  },

  // Update diskon
  updateDiscount: async (id: number, payload: Partial<DiscountData>) => {
    const response = await axiosInstance.put(`/discount/update-discounts/${id}`, payload);
    return response.data;
  },

  // Hapus diskon
  deleteDiscount: async (id: number) => {
    const response = await axiosInstance.delete(`/discount/delete-discounts/${id}`);
    return response.data;
  }
};