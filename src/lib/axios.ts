import axios from "axios";
import { useAuthStore } from "../store/useAuthStore";

export const axiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}/api`,
  timeout: 10000,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;

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
      
      // BEST PRACTICE 3: Jangan lakukan auto-logout jika 401 terjadi di endpoint "/login"
      const isLoginUrl = error.config.url?.includes("login");
      
      if (!isLoginUrl) {
        console.warn("Sesi habis atau tidak valid. Melakukan auto-logout...");
        
        // BEST PRACTICE 4: Wajib bersihkan state Zustand HINGGA BERSIH sebelum redirect!
        // (Pastikan kamu punya aksi logout di dalam useAuthStore)
        useAuthStore.getState().setAuth("", null); // Atau gunakan useAuthStore.getState().logout() jika ada
        
        // BEST PRACTICE 5: Cegah reload berulang jika sudah berada di halaman login
        // (Asumsi halaman login kamu ada di route "/")
        if (window.location.pathname !== "/") {
          window.location.href = "/";
        }
      }
    }

    return Promise.reject(error);
  }
);