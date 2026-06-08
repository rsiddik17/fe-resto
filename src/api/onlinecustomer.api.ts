import { axiosInstance } from "../lib/axios";

export const customerAPI = {
  // Get customer profile
  getProfile: async () => {
    const response = await axiosInstance.get("/profile/");
    return response.data;
  },

  // Update customer profile
 updateProfile: async (payload: any) => {
    const response = await axiosInstance.put("/profile/update-profile", payload);
    return response.data;
  },

  // Update password
  updatePassword: async (payload: any) => {
    // Coba PATCH dulu
    const response = await axiosInstance.patch("/profile/update-password", payload);
    return response.data;
  },
};