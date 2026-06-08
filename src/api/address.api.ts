import { axiosInstance } from "../lib/axios";

export const addressAPI = {
  getMyAddresses: async () => {
    const response = await axiosInstance.get("/profile/address", );
    return response.data;
  },

  createAddress: async (payload: any) => {
    const response = await axiosInstance.post("/profile/address", payload);
    return response.data;
  },

  updateAddress: async (id: string, payload: any) => {
    const response = await axiosInstance.put(`/profile/address/${id}`, payload);
    return response.data;
  },

  deleteAddress: async (id: string) => {
    const response = await axiosInstance.delete(`/profile/address/${id}`);
    return response.data;
  },
};
