import { axiosInstance } from "../lib/axios";

// Definisikan tipe data 
export const authAPI = {
  login: async (data: any) => {
    const response = await axiosInstance.post("/auth/login", data);
    return response.data; // Langsung return data-nya
  },
  
  register: async (data: any) => {
    const response = await axiosInstance.post("/auth/register", data);
    return response.data;
  },
  
  forgotPassword: async (data: { email: string }) => {
    const response = await axiosInstance.post("/auth/forgot-password", data);
    return response.data;
  },

  resetPassword: async (payload: any, token: string) => {
    const response = await axiosInstance.post("/auth/reset-password", payload, {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    });
    return response.data;
  },

  verifyOtp: async (data: { email: string; otpCode: number }, isForgotPassword: boolean) => {
    const endpoint = isForgotPassword ? "/auth/verify-reset-otp" : "/auth/verify-otp";
    const response = await axiosInstance.post(endpoint, data);
    return response.data; 
  },

  resendOtp: async (data: { email: string }) => {
    const response = await axiosInstance.post("/auth/resend-otp", data);
    return response.data;
  }
};