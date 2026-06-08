import { useState, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { profileAPI } from "../api/profile.api";

export const useProfile = () => {
  const { user, setUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState<boolean>(!user); 

useEffect(() => {
    const fetchProfile = async () => {
      // Hanya hit API kalau user belum ada di Zustand
      if (!user) {
        try {
          setIsLoading(true);
          const response = await profileAPI.getStaffProfile();
          if (response.success && response.data) {
            setUser(response.data);
          }
        } catch (error) {
          console.error("Gagal mengambil data profil:", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [user, setUser]);

  // Ekstrak nama depan
  const firstName = user?.fullname ? user.fullname.split(" ")[0] : "Memuat...";

  // Format Role sesuai standar UI Bahasa Indonesia
  const formatRole = (role?: string) => {
    if (role === "WAITER") return "Pelayan";
    if (role === "CASHIER") return "Kasir";
    if (role === "KITCHEN") return "Dapur";
    return role || "Memuat...";
  };

  const roleName = formatRole(user?.role);

  // Return semua data yang dibutuhkan oleh halaman-halaman
  return { 
    user, 
    firstName, 
    roleName, 
    isLoading 
  };
};