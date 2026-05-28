import { create } from "zustand";
import { authAPI } from "../api/auth.api";

// Definisikan semua role yang ada (kecuali QR karena dia temporary guest)
export type UserRole = "ADMIN" | "CASHIER" | "WAITER" | "KIOSK_SYSTEM" | "KITCHEN" | "CUSTOMER" | "GUEST" | null;

export interface UserProfile {
  fullname?: string;
  phone_number?: string;
  gender?: string;
  email?: string;
  role?: string;
  is_active?: boolean;
}

interface AuthState {
  token: string | null;
  role: UserRole;
  user: UserProfile | null;
  setAuth: (token: string, role: UserRole) => void;
  setUser: (userData: UserProfile) => void;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem("token"),
  role: (localStorage.getItem("role") as UserRole) || null,
  user: null,
  
  setAuth: (token, role) => {
    localStorage.setItem("token", token);
    localStorage.setItem("role", role as string);
    set({ token, role });
  },

  setUser: (userData) => {
    set({ user: userData });
  },
  
  logout: async () => {
    try {
      await authAPI.logout(); // Hit API ke backend
    } catch (error) {
      console.error("Gagal logout dari server:", error);
    } finally {
      // Pastikan data lokal selalu dihapus meskipun API error/token expired
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      set({ token: null, role: null, user: null });
    }
  },
}));