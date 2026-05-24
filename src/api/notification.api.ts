// src/api/notification.api.ts
import { axiosInstance } from "../lib/axios";

export const notificationAPI = {
  // Ambil daftar notifikasi untuk user/role yang sedang login
  getNotifications: async () => {
    const response = await axiosInstance.get("/notification/");
    return response.data;
  },

  // Tandai satu notifikasi sebagai sudah dibaca
  markAsRead: async (id: string) => {
    const response = await axiosInstance.put(`/notification/${id}/read`);
    return response.data;
  },
};