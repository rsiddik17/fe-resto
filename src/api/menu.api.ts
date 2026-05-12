import { axiosInstance } from "../lib/axios";

export const menuAPI = {
  // Ambil semua menu
  getAllMenu: async () => {
    const response = await axiosInstance.get("/menu/");
    return response.data; 
  },
  
  // Ambil detail menu by ID
  getMenuById: async (id: string) => {
    const response = await axiosInstance.get(`/menu/${id}`);
    return response.data;
  },

  // Tambah menu baru
  createMenu: async (formData: FormData) => {
    const response = await axiosInstance.post("/menu/create-menu", formData);
    return response.data;
  },

  // Update menu
  updateMenu: async (id: string, formData: FormData) => {
    const response = await axiosInstance.patch(`/menu/update-menu/${id}`, formData);
    return response.data;
  },

  // Hapus menu berdasarkan ID
  deleteMenu: async (id: string) => {
    const response = await axiosInstance.delete(`/menu/delete-menu/${id}`);
    return response.data;
  }
};