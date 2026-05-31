import { axiosInstance } from "../lib/axios";

export const customerAPI = {
  getAllCustomers: async () => {
    const response = await axiosInstance.get("/admin/customer");
    return response.data;
  },
};
