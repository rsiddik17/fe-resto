import { axiosInstance } from "../lib/axios";

export const tableAPI = {
  // Ambil semua meja
  getAllTables: async () => {
    const response = await axiosInstance.get("/table/");
    return response.data;
  },

  getTableByNumber: async (tableNumber: string) => {
    const response = await axiosInstance.get("/table/", {
      params: { table_number: tableNumber }
    });
    return response.data;
  }
};