import { create } from "zustand";

// Definisikan semua role yang ada (kecuali QR karena dia temporary guest)
export type UserRole = "ADMIN" | "CASHIER" | "WAITER" | "KIOSK_SYSTEM" | "KITCHEN" | "CUSTOMER" | null;

interface AuthState {
  token: string | null;
  role: UserRole;
  setAuth: (token: string, role: UserRole) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem("token"),
  role: (localStorage.getItem("role") as UserRole) || null,
  
  setAuth: (token, role) => {
    localStorage.setItem("token", token);
    localStorage.setItem("role", role as string);
    set({ token, role });
  },
  
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    set({ token: null, role: null });
  },
}));