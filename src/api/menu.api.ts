import { axiosInstance } from "../lib/axios";

export const menuAPI = {
  // Ambil semua menu
  getAllMenus: async () => {
    const response = await axiosInstance.get("/menu");
    return response.data; 
  },
  
  // Nanti kalau butuh get by ID
  getMenuById: async (id: string) => {
    const response = await axiosInstance.get(`/menu/${id}`);
    return response.data;
  }
};