import axios from "axios";
import { useAuthStore } from "../store/useAuthStore";

export const axiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}/api`,
  timeout: 10000,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token || localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response, // Jika sukses, langsung kembalikan datanya
  (error) => {
    // Cek apakah errornya adalah 401 (Unauthorized)
    if (error.response && error.response.status === 401) {
      
      const isLoginUrl = error.config.url?.includes("login");
      const currentPath = window.location.pathname;

      // LOGIKA BARU: Cek apakah user sedang berada di halaman QR (Guest)
      const isQrRoute = currentPath.includes("/qr/");

      //  Deteksi apakah URL-nya bener-bener endpoint update-password milik modul Online Customer
      const isCustomerChangePassword = error.config.url === "/profile/update-password";
      
      if (!isLoginUrl && !isQrRoute && !isCustomerChangePassword) {
        console.warn("Sesi habis atau tidak valid. Melakukan auto-logout...");
        
        // Bersihkan state Zustand HINGGA BERSIH sebelum redirect!
        useAuthStore.getState().setAuth("", null);
        
        // BEST PRACTICE 5: Cegah reload berulang jika sudah berada di halaman login
        if (currentPath !== "/" && currentPath !== "/its-resto" && currentPath !== "/its-resto/") {
          window.location.href = "/its-resto/"; 
        }
      }
    }

    return Promise.reject(error);
  }
);