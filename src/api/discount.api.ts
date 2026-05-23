import { axiosInstance } from "../lib/axios";

export interface DiscountData {
  id: number;
  discount_name: string;
  discount_code: string;
  value: string;
  min_purches: string; 
  is_active: boolean;
}

export const discountAPI = {
  // Ambil semua diskon
  getAllDiscounts: async () => {
    const response = await axiosInstance.get("/discount/");
    return response.data;
  },
};