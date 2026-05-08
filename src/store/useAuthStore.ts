import { create } from "zustand";

// Definisikan semua role yang ada (kecuali QR karena dia temporary guest)
export type UserRole = "ADMIN" | "CASHIER" | "WAITER" | "KIOSK_SYSTEM" | "KITCHEN" | "CUSTOMER" | null;

export interface UserProfile {
  fullname?: string;
  phone_number?: string;
  gender?: string;
  email?: string;
  role?: string;
}

interface AuthState {
  token: string | null;
  role: UserRole;
  user: UserProfile | null;
  setAuth: (token: string, role: UserRole) => void;
  setUser: (userData: UserProfile) => void;
  logout: () => void;
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
  
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    set({ token: null, role: null, user: null });
  },
}));