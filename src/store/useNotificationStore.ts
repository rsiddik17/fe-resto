// src/store/useNotificationStore.ts
import { create } from "zustand";
import { notificationAPI } from "../api/notification.api";

export interface Notification {
  id: string;
  order_id: string;
  target_role: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

interface NotificationStore {
  notifications: Notification[];
  isLoading: boolean;
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [],
  isLoading: false,

  fetchNotifications: async () => {
    set({ isLoading: true });
    try {
      const res = await notificationAPI.getNotifications();
      if (res.success) {
        // Filter untuk customer
        const customerNotif = res.data.filter(
          (n: Notification) => n.target_role === "CUSTOMER"
        );
        set({ notifications: customerNotif });
      }
    } catch (error) {
      console.error("Gagal fetch notifikasi:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  markAsRead: async (id: string) => {
    try {
      await notificationAPI.markAsRead(id);
      const { notifications } = get();
      const updated = notifications.map((n) =>
        n.id === id ? { ...n, is_read: true } : n
      );
      set({ notifications: updated });
    } catch (error) {
      console.error("Gagal mark as read:", error);
    }
  },

  markAllAsRead: async () => {
    const { notifications } = get();
    const unread = notifications.filter((n) => !n.is_read);
    await Promise.all(unread.map((n) => notificationAPI.markAsRead(n.id)));
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, is_read: true })),
    }));
  },
}));